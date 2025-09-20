/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Paths, Platform, Utils } from '../Common/index.js';
import { Status as ModelStatus } from '../Model/index.js';
import { Base } from './Base.js';
/**
 * Handles all status data.
 */
export class Status {
    /**
     * Get the status by ID.
     */
    static get(id) {
        return Base.get(id, this.list, 'status');
    }
    /**
     * Read the JSON file associated with status.
     */
    static async read() {
        const json = (await Platform.parseFileJSON(Paths.FILE_STATUS));
        this.list = Utils.readJSONMap(json.status, ModelStatus);
    }
}
