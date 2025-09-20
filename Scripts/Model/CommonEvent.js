/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from './Base.js';
import { Parameter } from './Parameter.js';
/**
 * Represents an event that can be called with parameters.
 */
export class CommonEvent extends Base {
    constructor(json) {
        super(json);
    }
    /**
     * Reads the JSON data describing the event.
     */
    read(json) {
        this.parameters = Parameter.readParameters(json);
    }
}
