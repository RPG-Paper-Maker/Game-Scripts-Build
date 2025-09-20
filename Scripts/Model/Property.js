/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from './Base.js';
import { DynamicValue } from './DynamicValue.js';
/**
 * Represents a property of an object.
 */
export class Property extends Base {
    constructor(json) {
        super(json);
    }
    /**
     * Initialize this property from JSON data.
     */
    read(json) {
        this.id = json.id;
        this.initialValue = DynamicValue.readOrNone(json.iv);
    }
}
