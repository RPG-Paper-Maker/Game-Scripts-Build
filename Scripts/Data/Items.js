/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Paths, Platform, Utils } from '../Common/index.js';
import { Item } from '../Model/index.js';
import { Base } from './Base.js';
/**
 * Handles all item data.
 */
export class Items {
    /**
     * Get the item by ID.
     */
    static get(id) {
        return Base.get(id, this.list, 'item');
    }
    /**
     * Read the JSON file associated with items.
     */
    static async read() {
        const json = (await Platform.parseFileJSON(Paths.FILE_ITEMS));
        this.list = Utils.readJSONMap(json.items, Item);
    }
}
