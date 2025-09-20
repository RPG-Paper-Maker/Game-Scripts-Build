/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from './Base.js';
/**
 *  Represents a skill that a class can learn at a certain level.
 */
export class ClassSkill extends Base {
    constructor(json) {
        super(json);
    }
    /** Read the JSON data for the class skill. */
    read(json) {
        this.id = json.id;
        this.level = json.l;
    }
}
