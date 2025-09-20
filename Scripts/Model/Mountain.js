/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { MOUNTAIN_COLLISION_KIND, Utils } from '../Common/index.js';
import { SpecialElement } from './SpecialElement.js';
/**
 * Represents a mountain element.
 */
export class Mountain extends SpecialElement {
    constructor(json) {
        super(json);
    }
    /** True if collision is always forced. */
    forceAlways() {
        return this.collisionKind === MOUNTAIN_COLLISION_KIND.ALWAYS;
    }
    /** True if collision is never forced. */
    forceNever() {
        return this.collisionKind === MOUNTAIN_COLLISION_KIND.NEVER;
    }
    /** Initialize this mountain from JSON data. */
    read(json) {
        super.read(json);
        this.id = json.id;
        this.collisionKind = Utils.valueOrDefault(json.mck, MOUNTAIN_COLLISION_KIND.DEFAULT);
    }
}
