/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Model } from "../index.js";
import { Constants, Utils } from '../Common/index.js';
import { Base } from './Base.js';
/**
 * A font name of the game.
 */
export class FontName extends Base {
    constructor(json) {
        super(json);
    }
    /**
     * Get the font name (default or custom).
     */
    getName() {
        return this.isBasic ? this.font.getValue() : this.name;
    }
    /**
     * Read the JSON associated to the font name.
     */
    read(json) {
        this.name = json.name;
        this.isBasic = Utils.valueOrDefault(json.isBasic, true);
        this.font = Model.DynamicValue.readOrDefaultMessage(json.f, Constants.DEFAULT_FONT_NAME);
        this.customFontID = Utils.valueOrDefault(json.customFontID, 1);
    }
}
