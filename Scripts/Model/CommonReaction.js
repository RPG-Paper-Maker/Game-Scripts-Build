/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Model } from "../index.js";
import { Reaction } from './Reaction.js';
/**
 * A common reaction.
 */
export class CommonReaction extends Reaction {
    constructor(json) {
        super(json);
    }
    /**
     * Read the JSON associated to the common reaction.
     */
    read(json) {
        super.read(json);
        this.parameters = Model.Parameter.readParameters(json);
    }
}
