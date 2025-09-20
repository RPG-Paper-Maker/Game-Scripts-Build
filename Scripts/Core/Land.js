/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import * as THREE from 'three';
import { Mathf, Utils } from '../Common/index.js';
import { Data } from '../index.js';
import { CustomGeometry } from './CustomGeometry.js';
import { MapElement } from './MapElement.js';
import { Rectangle } from './Rectangle.js';
/**
 * A land element placed on the map grid.
 */
export class Land extends MapElement {
    /**
     * Compute the index of this land’s texture rectangle in a texture atlas.
     */
    getIndex(width) {
        return this.texture.x + this.texture.y * width;
    }
    /**
     * Update the geometry for this land tile and optionally generate collision data.
     *
     * @param geometry - The custom geometry instance to update with vertices, indices and UVs.
     * @param collision - The collision square definition for this tile.
     * @param position - The tile’s position in the map grid.
     * @param x - The X texture coordinate (in pixels).
     * @param y - The Y texture coordinate (in pixels).
     * @param w - The texture width (in pixels).
     * @param h - The texture height (in pixels).
     * @param count - The current face count used for indexing.
     * @returns A {@link StructMapElementCollision} describing collision data, or `null` if no collision should be applied.
     */
    updateGeometryLand(geometry, collision, position, width, height, x, y, w, h, count) {
        const localPosition = position.toVector3();
        const a = localPosition.x;
        let yLayerOffset = position.layer * 0.05;
        if (!this.up) {
            yLayerOffset *= -1;
        }
        const b = localPosition.y + yLayerOffset;
        const c = localPosition.z;
        // Vertices
        const vecA = new THREE.Vector3(a - Data.Systems.SQUARE_SIZE / 2, b, c - Data.Systems.SQUARE_SIZE / 2);
        const vecB = new THREE.Vector3(a + Data.Systems.SQUARE_SIZE / 2, b, c - Data.Systems.SQUARE_SIZE / 2);
        const vecC = new THREE.Vector3(a + Data.Systems.SQUARE_SIZE / 2, b, c + Data.Systems.SQUARE_SIZE / 2);
        const vecD = new THREE.Vector3(a - Data.Systems.SQUARE_SIZE / 2, b, c + Data.Systems.SQUARE_SIZE / 2);
        const center = new THREE.Vector3(a, b, c);
        Mathf.rotateQuadEuler(vecA, vecB, vecC, vecD, center, position.toRotationEuler());
        geometry.pushQuadVertices(vecA, vecB, vecC, vecD);
        // Indices
        geometry.pushQuadIndices(count * 4);
        // UVs
        const coefX = MapElement.COEF_TEX / width;
        const coefY = MapElement.COEF_TEX / height;
        x += coefX;
        y += coefY;
        w -= coefX * 2;
        h -= coefY * 2;
        const texA = new THREE.Vector2();
        const texB = new THREE.Vector2();
        const texC = new THREE.Vector2();
        const texD = new THREE.Vector2();
        CustomGeometry.uvsQuadToTex(texA, texB, texC, texD, x, y, w, h);
        geometry.pushQuadUVs(texA, texB, texC, texD);
        // Collision
        let objCollision = null;
        if (collision !== null) {
            const rect = collision.rect;
            if (!collision.hasAllDirections() || collision.terrain > 0) {
                let rectB = rect === null
                    ? [0, 0, Data.Systems.SQUARE_SIZE, Data.Systems.SQUARE_SIZE]
                    : [rect.x, rect.y, rect.width, rect.height];
                rectB = [a + rectB[0], b + 0.5, c + rectB[1], rectB[2], rectB[3], 1, 0];
                objCollision = {
                    p: position,
                    l: localPosition,
                    b: rectB,
                    cs: collision,
                };
            }
            else if (rect !== null) {
                objCollision = {
                    p: position,
                    l: localPosition,
                    b: [a + rect.x, b + 0.5, c + rect.y, rect.width, rect.height, 1, 0],
                    cs: null,
                };
            }
        }
        return objCollision;
    }
    /**
     * Read and initialize this land tile from JSON data.
     */
    read(json) {
        super.read(json);
        this.up = Utils.valueOrDefault(json.up, true);
        this.texture = Rectangle.createFromArray(json.t);
    }
}
