/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Paths, Platform, Utils } from '../Common/index.js';
import { Class } from '../Model/index.js';
import { Base } from './Base.js';
/**
 * Handles all class data.
 */
export class Classes {
    /**
     * Get the class by ID.
     */
    static get(id, errorMessage) {
        return Base.get(id, this.list, 'class', true, errorMessage);
    }
    /**
     * Read the JSON file associated with classes.
     */
    static async read() {
        const json = (await Platform.parseFileJSON(Paths.FILE_CLASSES));
        this.list = Utils.readJSONMap(json.classes, Class);
    }
}
