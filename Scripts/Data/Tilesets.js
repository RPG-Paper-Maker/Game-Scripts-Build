/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Paths, Platform, Utils } from '../Common/index.js';
import { Tileset } from '../Model/index.js';
import { Base } from './Base.js';
/**
 *  All the tilesets data.
 */
export class Tilesets {
    /**
     * Get the tileset by ID.
     */
    static get(id) {
        return Base.get(id, this.list, 'tileset');
    }
    /**
     * Read the JSON file associated to tilesets.
     */
    static async read() {
        const json = (await Platform.parseFileJSON(Paths.FILE_TILESETS));
        this.list = Utils.readJSONMap(json.list, Tileset);
    }
}
