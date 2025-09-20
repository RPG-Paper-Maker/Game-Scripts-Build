/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Paths, Platform, Utils } from '../Common/index.js';
import { Skill } from '../Model/index.js';
import { Base } from './Base.js';
/**
 * Handles all skill data.
 */
export class Skills {
    /**
     * Get the skill by ID.
     */
    static get(id) {
        return Base.get(id, this.list, 'skill');
    }
    /**
     * Read the JSON file associated with skills.
     */
    static async read() {
        const json = (await Platform.parseFileJSON(Paths.FILE_SKILLS));
        this.list = Utils.readJSONMap(json.skills, Skill);
    }
}
