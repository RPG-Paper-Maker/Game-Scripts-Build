/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import * as THREE from 'three';
import { Paths, Platform, ScreenResolution, Utils } from '../Common/index.js';
import { Data } from '../index.js';
import { Stack } from './Stack.js';
class GL {
    constructor() {
        throw new Error('This is a static class');
    }
    /**
     *  Initialize the openGL stuff.
     *  @static
     */
    static initialize() {
        this.renderer = new THREE.WebGLRenderer({ antialias: Data.Systems.antialias, alpha: true });
        this.renderer.autoClear = false;
        this.renderer.setSize(ScreenResolution.CANVAS_WIDTH, ScreenResolution.CANVAS_HEIGHT, true);
        this.renderer.shadowMap.enabled = true;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        if (Data.Systems.antialias) {
            this.renderer.setPixelRatio(2);
        }
        document.body.appendChild(this.renderer.domElement);
    }
    /**
     *  Load shaders stuff.
     *  @static
     */
    static async load() {
        // Shaders
        let json = await Platform.loadFile(Paths.SHADERS + 'default.vert', true);
        this.SHADER_FIX_VERTEX = json;
        json = await Platform.loadFile(Paths.SHADERS + 'default.frag', true);
        this.SHADER_FIX_FRAGMENT = json;
    }
    /**
     *  Set the camera aspect while resizing the window.
     *  @static
     */
    static resize() {
        if (this.renderer) {
            this.renderer.setSize(ScreenResolution.CANVAS_WIDTH, ScreenResolution.CANVAS_HEIGHT, true);
            let camera;
            for (let i = 0, l = Stack.content.length; i < l; i++) {
                camera = Stack.content[i].camera;
                if (camera !== undefined) {
                    camera.resizeGL();
                }
            }
        }
    }
    /**
     *  Load a texture.
     *  @param {string} path - The path of the texture
     *  @returns {Promise<THREE.Material>}
     */
    static async loadTexture(path) {
        const texture = await new Promise((resolve, reject) => {
            this.textureLoader.load(path, (t) => {
                resolve(t);
            }, () => { }, () => {
                const error = 'Could not load ' + path;
                if (Data.Systems.ignoreAssetsLoadingErrors) {
                    const t = new THREE.Texture();
                    t.image = new Image();
                    console.warn(error);
                    resolve(t);
                }
                else {
                    Platform.showErrorMessage(error);
                }
            });
        });
        return this.createMaterial({ texture: texture });
    }
    /**
     *  Load a texture empty.
     *  @returns {THREE.Material}
     */
    static loadTextureEmpty() {
        const material = new THREE.MeshPhongMaterial();
        material.userData.uniforms = {
            t: { value: undefined },
        };
        return material;
    }
    /**
     * Apply the map screen tone while preserving an imported GLTF material's
     * native textures and lighting shader.
     *
     * @param material The GLTF material to update
     */
    static applyScreenTone(material) {
        if (material.userData.rpmScreenToneApplied || !(material instanceof THREE.MeshStandardMaterial)) {
            return;
        }
        material.userData.rpmScreenToneApplied = true;
        const onBeforeCompile = material.onBeforeCompile;
        const customProgramCacheKey = material.customProgramCacheKey;
        material.onBeforeCompile = (shader, renderer) => {
            onBeforeCompile(shader, renderer);
            shader.uniforms.rpmScreenTone = { value: GL.screenTone };
            shader.uniforms.rpmScreenToneLegacy = GL.screenToneLegacy;
            shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nuniform vec4 rpmScreenTone;\nuniform bool rpmScreenToneLegacy;');
            shader.fragmentShader = shader.fragmentShader.replace('#include <fog_fragment>', `vec3 rpmScreenToneRgb = (rpmScreenToneLegacy ? gl_FragColor.rgb : clamp(gl_FragColor.rgb, 0.0, 1.0)) + rpmScreenTone.rgb;
const vec3 rpmScreenToneWeights = vec3(0.2125, 0.7154, 0.0721);
gl_FragColor.rgb = mix(
	vec3(dot(rpmScreenToneRgb, rpmScreenToneWeights)),
	rpmScreenToneRgb,
	rpmScreenTone.a
);
#include <fog_fragment>`);
        };
        material.customProgramCacheKey = () => `${customProgramCacheKey.call(material)}|rpm-screen-tone`;
        material.needsUpdate = true;
    }
    /**
     *  Create a material from texture.
     *  @returns {THREE.MeshPhongMaterial}
     */
    static createMaterial(opts) {
        if (!opts.texture) {
            opts.texture = new THREE.Texture();
        }
        opts.texture.magFilter = THREE.NearestFilter;
        opts.texture.minFilter = THREE.NearestFilter;
        opts.texture.colorSpace = THREE.NoColorSpace;
        opts.texture.flipY = opts.flipY ? true : false;
        opts.texture.wrapS = THREE.RepeatWrapping;
        opts.texture.wrapT = THREE.RepeatWrapping;
        opts.repeat = Utils.valueOrDefault(opts.repeat, 1.0);
        opts.opacity = Utils.valueOrDefault(opts.opacity, 1.0);
        opts.shadows = Utils.valueOrDefault(opts.shadows, true);
        opts.side = Utils.valueOrDefault(opts.side, THREE.DoubleSide);
        const fragment = this.SHADER_FIX_FRAGMENT;
        const vertex = this.SHADER_FIX_VERTEX;
        const screenTone = this.screenTone;
        const uniforms = opts.uniforms
            ? opts.uniforms
            : {
                offset: { value: new THREE.Vector2() },
                colorD: { value: screenTone },
                repeat: { value: opts.repeat },
                enableShadows: { value: opts.shadows },
                hovered: { value: false },
            };
        // Program cache key for multiple shader programs
        const key = fragment === this.SHADER_FIX_FRAGMENT ? 0 : 1;
        // Create material
        const material = new THREE.MeshPhongMaterial({
            map: opts.texture,
            side: opts.side,
            transparent: true,
            alphaTest: 0.01,
            opacity: opts.opacity,
            shininess: 0,
            specular: new THREE.Color(0x000000),
        });
        material.userData.uniforms = uniforms;
        material.userData.customDepthMaterial = new THREE.MeshDepthMaterial({
            depthPacking: THREE.RGBADepthPacking,
            map: opts.texture,
            alphaTest: 0.5,
        });
        // Edit shader information before compiling shader
        material.onBeforeCompile = (shader) => {
            shader.fragmentShader = fragment;
            shader.vertexShader = vertex;
            shader.uniforms.colorD = uniforms.colorD;
            shader.uniforms.screenToneLegacy = GL.screenToneLegacy;
            shader.uniforms.reverseH = { value: opts.flipX };
            shader.uniforms.repeat = { value: opts.repeat };
            shader.uniforms.offset = uniforms.offset;
            shader.uniforms.enableShadows = { value: opts.shadows };
            shader.uniforms.hovered = { value: false };
            shader.uniforms.alpha_threshold = { value: 0.01 };
            material.userData.uniforms = shader.uniforms;
            // Important to run a unique shader only once and be able to use
            // multiple shader with before compile
            material.customProgramCacheKey = () => {
                return '' + key;
            };
        };
        return material;
    }
    static cloneMaterial(material) {
        return this.createMaterial({
            texture: material.map,
            flipY: material.map.flipY,
            side: material.side,
            repeat: material.userData.uniforms.repeat.value,
            opacity: material.opacity,
            shadows: material.userData.uniforms.enableShadows.value,
        });
    }
    /**
     *  Get material THREE.Texture (if exists).
     *  @param {THREE.MeshPhongMaterial}
     *  @returns {THREE.Texture}
     */
    static getMaterialTexture(material) {
        return material && material.map ? material.map : null;
    }
    /**
     *  Reset the sunlight and ambient light values changed by command.
     *  @static
     */
    static resetLighting() {
        this.lightingSun = null;
        this.lightingAmbient = null;
        this.lightingKeep = true;
        this.lightingMapID = -1;
        this.lightingSky.setRGB(1, 1, 1);
        this.lightingTransitionID++;
    }
    /**
     *  Update the sky tint from the ratio between the current lights and the
     *  map properties lights (colors multiplied by intensities).
     *  @static
     *  @param {THREE.Color} mapLight
     *  @param {THREE.Color} currentLight
     */
    static updateLightingSky(mapLight, currentLight) {
        this.lightingSky.setRGB(mapLight.r > 0 ? currentLight.r / mapLight.r : 1, mapLight.g > 0 ? currentLight.g / mapLight.g : 1, mapLight.b > 0 ? currentLight.b / mapLight.b : 1);
    }
    /**
     *  Update the skybox materials tint.
     *  @static
     *  @param {THREE.Material | THREE.Material[]} materials
     */
    static updateSkyTint(materials) {
        const sky = this.lightingSky.getRGB(this.skyTintRGB, THREE.SRGBColorSpace);
        for (const material of Array.isArray(materials) ? materials : [materials]) {
            if (material instanceof THREE.MeshPhongMaterial) {
                material.color.setRGB(sky.r, sky.g, sky.b);
            }
        }
    }
    /**
     *  Update the background color
     *  @static
     *  @param {System.Color} color
     */
    static updateBackgroundColor(color) {
        this.clearColor.set(color.getHex(this.screenTone)).multiply(this.lightingSky);
        this.renderer.setClearColor(this.clearColor, color.alpha);
    }
    /**
     *  Convert 3D vector to a 2D point on screen.
     *  @static
     *  @param {Vector3} vector - The 3D vector
     *  @param {THREE.Camera} camera - The three.js camera
     *  @returns {Vector2}
     */
    static toScreenPosition(vector, camera) {
        const widthHalf = ScreenResolution.CANVAS_WIDTH / 2;
        const heightHalf = ScreenResolution.CANVAS_HEIGHT / 2;
        const position = vector.clone();
        camera.updateMatrixWorld(true);
        position.project(camera);
        return new THREE.Vector2(position.x * widthHalf + widthHalf, -(position.y * heightHalf) + heightHalf);
    }
    static getMaterialTextureSize(material) {
        return {
            width: material?.map?.image?.width ?? 0,
            height: material?.map?.image?.height ?? 0,
        };
    }
}
GL.textureLoader = new THREE.TextureLoader();
GL.raycaster = new THREE.Raycaster();
GL.screenTone = new THREE.Vector4(0, 0, 0, 1);
GL.screenToneByCommand = false;
GL.screenToneTransitionID = 0;
/** @deprecated Screen tone legacy mode (pre-3.2.30 projects), to remove. */
GL.screenToneLegacy = { value: false };
GL.lightingSun = null;
GL.lightingAmbient = null;
GL.lightingKeep = true;
GL.lightingMapID = -1;
GL.lightingSky = new THREE.Color(1, 1, 1);
GL.lightingTransitionID = 0;
GL.skyTintRGB = { r: 1, g: 1, b: 1 };
GL.clearColor = new THREE.Color();
export { GL };
