/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

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
/**
 * Represents a possible state of an object.
 */
export class State extends Base {
    constructor(json) {
        super(json);
        this.detection = null;
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
    }
}
