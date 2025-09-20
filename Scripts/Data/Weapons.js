/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Paths, Platform, Utils } from '../Common/index.js';
import { Weapon } from '../Model/index.js';
import { Base } from './Base.js';
/**
 * Handles all weapon data.
 */
export class Weapons {
    /**
     * Get the weapon by ID.
     */
    static get(id) {
        return Base.get(id, this.list, 'weapon');
    }
    /**
     * Read the JSON file associated with weapons.
     */
    static async read() {
        const json = (await Platform.parseFileJSON(Paths.FILE_WEAPONS));
        this.list = Utils.readJSONMap(json.weapons, Weapon);
    }
}
