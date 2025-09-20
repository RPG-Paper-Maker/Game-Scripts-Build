/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Paths, Platform, Utils } from '../Common/index.js';
import { Armor } from '../Model/index.js';
import { Base } from './Base.js';
/**
 * Handles all armor data.
 */
export class Armors {
    /**
     * Get the armor by ID.
     */
    static get(id) {
        return Base.get(id, this.list, 'armor');
    }
    /**
     * Read the JSON file associated with armors.
     */
    static async read() {
        const json = (await Platform.parseFileJSON(Paths.FILE_ARMORS));
        this.list = Utils.readJSONMap(json.armors, Armor);
    }
}
