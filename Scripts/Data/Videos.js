/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Paths, Platform, TITLE_COMMAND_KIND } from '../Common/index.js';
import { Data } from '../index.js';
import { Video } from '../Model/index.js';
import { Base } from './Base.js';
/**
 * Handles all video data.
 */
export class Videos {
    /**
     * Check if a video exists by ID.
     */
    static has(id) {
        return id !== -1 && this.list.has(id);
    }
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
        await this.readSelected();
    }
    /** Read title-screen and credits videos before the game data is fully loaded. */
    static async readTitleScreen() {
        const selected = new Set();
        if (Data.TitlescreenGameover.isTitleBackgroundVideo) {
            selected.add(Data.TitlescreenGameover.titleBackgroundVideoID);
        }
        for (const command of Data.TitlescreenGameover.titleCommands) {
            if (command.kind === TITLE_COMMAND_KIND.CREDITS && command.creditsBackgroundVideoID >= 0) {
                selected.add(command.creditsBackgroundVideoID);
            }
        }
        await this.readSelected(selected);
    }
    static async readSelected(selected) {
        const json = (await Platform.parseFileJSON(Paths.FILE_VIDEOS));
        const videos = new Map();
        for (const videoJSON of json.list) {
            if (selected && !selected.has(videoJSON.id)) {
                continue;
            }
            videos.set(videoJSON.id, new Video(videoJSON));
        }
        for (const video of videos.values()) {
            await video.checkBase64();
        }
        this.list = videos;
    }
}
