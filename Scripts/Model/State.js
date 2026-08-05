/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { COMMAND_MOVE_KIND, DYNAMIC_VALUE_KIND, EVENT_COMMAND_KIND, OBJECT_MOVING_KIND, Utils } from '../Common/index.js';
import { Rectangle } from '../Core/index.js';
import { Manager } from '../index.js';
import { Base } from './Base.js';
import { DynamicValue } from './DynamicValue.js';
import { Reaction } from './Reaction.js';
/** A light attached to a map object state. */
export class StateLight {
    constructor(json) {
        this.id = json.id ?? 0;
        this.kind = StateLight.readNumber(json.k, 0);
        const kind = typeof json.k === 'number' ? json.k : (json.k?.v ?? 0);
        this.followOrientation = StateLight.readNumber(json.fo, kind === 1 ? 1 : 0);
        this.color = StateLight.readText(json.c, '#ffffff');
        this.groundColor = StateLight.readText(json.gc, '#444444');
        this.intensity = StateLight.readNumber(json.i, 5);
        this.intensityOffset = StateLight.readNumber(json.io, 0);
        this.intensityTime = StateLight.readNumber(json.it, 0);
        this.x = StateLight.readNumber(json.x, 0);
        this.y = StateLight.readNumber(json.y, 1);
        this.z = StateLight.readNumber(json.z, 0);
        this.distance = StateLight.readNumber(json.d, 2);
        this.angle = StateLight.readNumber(json.a, 45);
        this.penumbra = StateLight.readNumber(json.p, 0);
        this.targetX = StateLight.readNumber(json.tx, 0);
        this.targetY = StateLight.readNumber(json.ty, 0);
        this.targetZ = StateLight.readNumber(json.tz, -16);
    }
    createCopy() {
        const light = new StateLight({ id: this.id });
        light.kind = this.kind.createCopy();
        light.followOrientation = this.followOrientation.createCopy();
        light.color = this.color.createCopy();
        light.groundColor = this.groundColor.createCopy();
        light.intensity = this.intensity.createCopy();
        light.intensityOffset = this.intensityOffset.createCopy();
        light.intensityTime = this.intensityTime.createCopy();
        light.x = this.x.createCopy();
        light.y = this.y.createCopy();
        light.z = this.z.createCopy();
        light.distance = this.distance.createCopy();
        light.angle = this.angle.createCopy();
        light.penumbra = this.penumbra.createCopy();
        light.targetX = this.targetX.createCopy();
        light.targetY = this.targetY.createCopy();
        light.targetZ = this.targetZ.createCopy();
        return light;
    }
    static readNumber(json, fallback) {
        return typeof json === 'number'
            ? DynamicValue.createNumberDouble(json)
            : DynamicValue.readOrDefaultNumberDouble(json, fallback);
    }
    static readText(json, fallback) {
        return typeof json === 'string'
            ? DynamicValue.createMessage(json)
            : DynamicValue.readOrDefaultMessage(json, fallback);
    }
}
/**
 * Represents a possible state of an object.
 */
export class State extends Base {
    constructor(json) {
        super(json);
    }
    /**
     * Create a new plain object instance of this state.
     */
    copyInstance() {
        return {
            graphicID: this.graphicID,
            graphicKind: this.graphicKind,
            rectTileset: this.rectTileset ? this.rectTileset.clone() : null,
            indexX: this.indexX,
            indexY: this.indexY,
            speedID: this.speedID,
            frequencyID: this.frequencyID,
            moveAnimation: this.moveAnimation,
            stopAnimation: this.stopAnimation,
            climbAnimation: this.climbAnimation,
            directionFix: this.directionFix,
            through: this.through,
            setWithCamera: this.setWithCamera,
            pixelOffset: this.pixelOffset,
            keepPosition: this.keepPosition,
            centerX: this.centerX.createCopy(),
            centerZ: this.centerZ.createCopy(),
            angleX: this.angleX.createCopy(),
            angleY: this.angleY.createCopy(),
            angleZ: this.angleZ.createCopy(),
            scaleX: this.scaleX.createCopy(),
            scaleY: this.scaleY.createCopy(),
            scaleZ: this.scaleZ.createCopy(),
            lights: this.lights.map((light) => light.createCopy()),
        };
    }
    /**
     * Initialize this state from JSON data.
     */
    read(json) {
        this.id = json.id;
        this.graphicID = json.gid;
        this.graphicKind = json.gk;
        if (this.graphicID === 0) {
            this.rectTileset = Rectangle.createFromArray(json.rt);
        }
        else {
            this.indexX = json.x;
            this.indexY = json.y;
        }
        this.objectMovingKind = Utils.valueOrDefault(json.omk, OBJECT_MOVING_KIND.FIX);
        this.route = new Reaction({
            bh: false,
            c: [
                Utils.valueOrDefault(json.ecr, {
                    kind: EVENT_COMMAND_KIND.MOVE_OBJECT,
                    command: [DYNAMIC_VALUE_KIND.DATABASE, -1, 1, 1, 0, COMMAND_MOVE_KIND.MOVE_RANDOM, 0],
                }),
            ],
        });
        this.speedID = Utils.valueOrDefault(json.s, 1);
        this.frequencyID = Utils.valueOrDefault(json.f, 1);
        this.moveAnimation = json.move;
        this.stopAnimation = json.stop;
        this.climbAnimation = json.climb;
        this.directionFix = json.dir;
        this.through = json.through;
        this.setWithCamera = json.cam;
        this.pixelOffset = json.pix;
        this.keepPosition = json.pos;
        const jsonDetection = Utils.valueOrDefault(json.ecd, null);
        this.detection = jsonDetection === null ? null : Manager.Events.getEventCommand(jsonDetection);
        this.centerX = DynamicValue.readOrDefaultNumberDouble(json.cx, 50);
        this.centerZ = DynamicValue.readOrDefaultNumberDouble(json.cz, 50);
        this.angleX = DynamicValue.readOrDefaultNumberDouble(json.ax, 0);
        this.angleY = DynamicValue.readOrDefaultNumberDouble(json.ay, 0);
        this.angleZ = DynamicValue.readOrDefaultNumberDouble(json.az, 0);
        this.scaleX = DynamicValue.readOrDefaultNumberDouble(json.sx, 1);
        this.scaleY = DynamicValue.readOrDefaultNumberDouble(json.sy, 1);
        this.scaleZ = DynamicValue.readOrDefaultNumberDouble(json.sz, 1);
        this.lights = (json.l ?? []).map((light) => new StateLight(light));
    }
}
