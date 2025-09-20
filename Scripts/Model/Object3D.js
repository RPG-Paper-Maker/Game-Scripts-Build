/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import * as THREE from 'three';
import { CUSTOM_SHAPE_KIND, OBJECT_COLLISION_KIND, SHAPE_KIND, Utils } from '../Common/index.js';
import { Data } from '../index.js';
import { SpecialElement } from './SpecialElement.js';
/** Represents a 3D object. */
export class Object3D extends SpecialElement {
    constructor(json) {
        super(json);
    }
    /** Width in pixels. */
    widthPixels() {
        return this.widthSquare * Data.Systems.SQUARE_SIZE + (this.widthPixel * Data.Systems.SQUARE_SIZE) / 100;
    }
    /** Height in pixels. */
    heightPixels() {
        return this.heightSquare * Data.Systems.SQUARE_SIZE + (this.heightPixel * Data.Systems.SQUARE_SIZE) / 100;
    }
    /** Depth in pixels. */
    depthPixels() {
        return this.depthSquare * Data.Systems.SQUARE_SIZE + (this.depthPixel * Data.Systems.SQUARE_SIZE) / 100;
    }
    /** Width in squares. */
    width() {
        return this.widthSquare + (this.widthPixel > 0 ? 1 : 0);
    }
    /** Height in squares. */
    height() {
        return this.heightSquare + (this.heightPixel > 0 ? 1 : 0);
    }
    /** Depth in squares. */
    depth() {
        return this.depthSquare + (this.depthPixel > 0 ? 1 : 0);
    }
    /** Size as a vector. */
    getSizeVector() {
        return new THREE.Vector3(this.widthPixels(), this.heightPixels(), this.depthPixels());
    }
    /** Get shape object. */
    getObj() {
        return Data.Shapes.get(CUSTOM_SHAPE_KIND.OBJ, this.objID);
    }
    /** Get collision shape object. */
    getCollisionObj() {
        return Data.Shapes.get(CUSTOM_SHAPE_KIND.COLLISIONS, this.collisionCustomID);
    }
    /** Initialize from JSON data. */
    read(json) {
        super.read(json);
        this.id = json.id;
        this.shapeKind = Utils.valueOrDefault(json.sk, SHAPE_KIND.BOX);
        this.objID = Utils.valueOrDefault(json.oid, -1);
        this.mtlID = Utils.valueOrDefault(json.mid, -1);
        this.collisionKind = Utils.valueOrDefault(json.ck, OBJECT_COLLISION_KIND.NONE);
        this.collisionCustomID = Utils.valueOrDefault(json.ccid, -1);
        this.scale = Utils.valueOrDefault(json.s, 1);
        this.widthSquare = Utils.valueOrDefault(json.ws, 1);
        this.widthPixel = Utils.valueOrDefault(json.wp, 0);
        this.heightSquare = Utils.valueOrDefault(json.hs, 1);
        this.heightPixel = Utils.valueOrDefault(json.hp, 0);
        this.depthSquare = Utils.valueOrDefault(json.ds, 1);
        this.depthPixel = Utils.valueOrDefault(json.dp, 0);
        this.stretch = Utils.valueOrDefault(json.st, false);
        this.isTopLeft = Utils.valueOrDefault(json.itl, true);
    }
}
