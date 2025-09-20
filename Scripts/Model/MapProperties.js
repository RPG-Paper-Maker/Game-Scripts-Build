/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import * as THREE from 'three';
import { Constants, MAP_TRANSITION_KIND, Mathf, PICTURE_KIND, SONG_KIND, Utils } from '../Common/index.js';
import { Game, MapObject, Position } from '../Core/index.js';
import { Data, Manager, Scene } from '../index.js';
import { DynamicValue } from './DynamicValue.js';
import { Localization } from './Localization.js';
import { MapObject as ModelMapObject } from './MapObject.js';
import { PlaySong } from './PlaySong.js';
import { RandomBattle } from './RandomBattle.js';
/**
 * Represents the properties of a map.
 */
export class MapProperties extends Localization {
    constructor(json) {
        super(json);
    }
    /**
     * Load and initialize the startup object state.
     */
    async load() {
        await this.startupObject.changeState();
    }
    /**
     * Update the background (color, image, or skybox).
     */
    updateBackground() {
        if (this.isBackgroundImage) {
            this.updateBackgroundImage();
        }
        else if (!this.isBackgroundColor) {
            this.updateBackgroundSkybox();
        }
        this.updateBackgroundColor();
    }
    /**
     * Update the background color.
     */
    updateBackgroundColor() {
        this.backgroundColor = Data.Systems.getColor(this.isBackgroundColor ? this.backgroundColorID.getValue() : 1);
    }
    /**
     * Update the background image.
     */
    updateBackgroundImage() {
        const texture = Manager.GL.textureLoader.load(Data.Pictures.get(PICTURE_KIND.PICTURES, this.backgroundImageID).getPath());
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        Scene.Map.current.scene.background = texture;
    }
    /**
     * Update the background skybox.
     */
    updateBackgroundSkybox() {
        const size = (10000 * Data.Systems.SQUARE_SIZE) / Constants.BASIC_SQUARE_SIZE;
        this.skyboxGeometry = new THREE.BoxGeometry(size, size, size);
        this.skyboxMesh = new THREE.Mesh(this.skyboxGeometry, Data.Systems.getSkybox(this.backgroundSkyboxID.getValue()).createTextures());
        Scene.Map.current.scene.add(this.skyboxMesh);
    }
    /**
     * Update the max steps numbers for starting a random battle.
     */
    updateMaxNumberSteps() {
        for (const battle of this.randomBattles) {
            battle.resetCurrentNumberSteps();
        }
        this.maxNumberSteps = Mathf.variance(this.randomBattleNumberStep.getValue(), this.randomBattleVariance.getValue());
    }
    /**
     * Check if a random battle can be started.
     */
    checkRandomBattle() {
        let triggered = false;
        for (const battle of this.randomBattles) {
            battle.updateCurrentNumberSteps();
            if (battle.currentNumberSteps >= this.maxNumberSteps) {
                triggered = true;
            }
        }
        if (!triggered) {
            return;
        }
        const rand = Mathf.random(0, 100);
        const battles = this.randomBattles.filter((b) => b.currentPriority > 0 && b.currentNumberSteps >= this.maxNumberSteps);
        const total = battles.reduce((sum, b) => sum + b.currentPriority, 0);
        let cumulative = 0;
        let chosen = null;
        for (const battle of battles) {
            cumulative += (battle.priority.getValue() / total) * 100;
            if (rand <= cumulative) {
                chosen = battle;
                break;
            }
        }
        if (chosen) {
            this.updateMaxNumberSteps();
            const battleMap = Data.BattleSystems.getBattleMap(this.randomBattleMapID.getValue());
            Game.current.heroBattle = new MapObject(Game.current.hero.system, battleMap.position.toVector3(), true);
            Manager.Stack.push(new Scene.Battle(chosen.troopID.getValue(), true, true, battleMap, MAP_TRANSITION_KIND.ZOOM, MAP_TRANSITION_KIND.ZOOM, null, null));
        }
    }
    /**
     * Cleanup background elements.
     */
    close() {
        if (this.skyboxMesh !== null) {
            Scene.Map.current.scene.remove(this.skyboxMesh);
        }
    }
    /**
     * Initialize this map properties from JSON data.
     */
    read(json) {
        super.read(json);
        this.skyboxGeometry = null;
        this.skyboxMesh = null;
        this.id = json.id;
        this.length = json.l;
        this.width = json.w;
        this.height = json.h;
        this.depth = json.d;
        // Tileset & stored map data
        const datas = Game.current.mapsProperties[this.id] ?? {};
        this.tileset = Data.Tilesets.get(Utils.valueOrDefault(datas.tileset, json.tileset));
        this.music = new PlaySong(SONG_KIND.MUSIC, Utils.valueOrDefault(datas.music, json.music));
        this.backgroundSound = new PlaySong(SONG_KIND.BACKGROUND_SOUND, Utils.valueOrDefault(datas.backgroundSound, json.bgs));
        this.cameraProperties = Data.Systems.getCameraProperties(Utils.valueOrDefault(datas.camera, DynamicValue.readOrDefaultDatabase(json.cp, 1).getValue()));
        // Background
        let kind = -1;
        if (datas.color !== undefined) {
            kind = 0;
        }
        else if (datas.skybox !== undefined) {
            kind = 1;
        }
        this.isBackgroundColor = kind === 0 ? true : json.isky;
        this.isBackgroundImage = kind !== -1 ? false : json.isi;
        if (this.isBackgroundColor) {
            this.backgroundColorID =
                datas.color === undefined ? new DynamicValue(json.sky) : DynamicValue.createNumber(datas.color);
        }
        else if (this.isBackgroundImage) {
            this.backgroundImageID = json.ipid;
        }
        else {
            this.backgroundSkyboxID =
                datas.skybox === undefined
                    ? DynamicValue.readOrDefaultDatabase(json.sbid)
                    : DynamicValue.createNumber(datas.skybox);
        }
        // Startup object
        const startupReactions = new ModelMapObject(json.so);
        this.startupObject = new MapObject(startupReactions);
        // Random battles
        this.randomBattleMapID = DynamicValue.readOrDefaultDatabase(json.randomBattleMapID);
        this.randomBattles = Utils.readJSONList(json.randomBattles, RandomBattle);
        this.randomBattleNumberStep = DynamicValue.readOrDefaultNumber(json.randomBattleNumberStep, 300);
        this.randomBattleVariance = DynamicValue.readOrDefaultNumber(json.randomBattleVariance, 20);
        this.updateMaxNumberSteps();
        this.isSunLight = Utils.valueOrDefault(json.isl, true);
        this.readObjects(json);
    }
    /**
     *  Initialize the map objects.
     */
    readObjects(json) {
        const { objs } = json;
        this.allObjects = new Map();
        this.maxObjectsID = 1;
        for (const jsonObject of objs) {
            this.allObjects.set(jsonObject.id, Position.createFromArray(jsonObject.p));
            if (jsonObject.id > this.maxObjectsID) {
                this.maxObjectsID = jsonObject.id;
            }
        }
    }
}
