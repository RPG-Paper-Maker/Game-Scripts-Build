/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Model } from "../index.js";
import { Icon } from './Icon.js';
/**
 * A currency of the game.
 */
export class Currency extends Icon {
    constructor(json) {
        super(json);
    }
    /**
     * Read the JSON associated to the currency.
     */
    read(json) {
        super.read(json);
        this.displayInMenu = Model.DynamicValue.readOrDefaultSwitch(json.dim, true);
    }
}
