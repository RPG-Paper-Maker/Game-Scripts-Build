/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Paths, Platform, Utils } from '../Common/index.js';
import { Video } from '../Model/index.js';
import { Base } from './Base.js';
/**
 * Handles all video data.
 */
export class Videos {
    /**
     * Get a video by ID.
     */
    static get(id, errorMessage) {
        if (id === -1) {
            return new Video();
        }
        return Base.get(id, this.list, 'video', true, errorMessage);
    }
    /**
     * Read the JSON file associated with videos.
     */
    static async read() {
        const json = (await Platform.parseFileJSON(Paths.FILE_VIDEOS));
        this.list = Utils.readJSONMap(json.list, Video);
        for (const video of this.list.values()) {
            await video.checkBase64();
        }
    }
}
