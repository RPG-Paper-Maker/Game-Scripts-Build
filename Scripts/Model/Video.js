/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Paths, Platform, Utils } from '../Common/index.js';
import { Data } from '../index.js';
import { Base } from './Base.js';
/**
 * A video resource in the game.
 */
export class Video extends Base {
    constructor(json) {
        super(json);
    }
    /**
     * Get the folder associated to videos.
     * @param isBR - Indicate if the video is a BR
     * @param dlc - The DLC name
     */
    static getFolder(isBR, dlc) {
        return ((isBR ? Data.Systems.PATH_BR + '/' : dlc ? `${Data.Systems.PATH_DLCS}/${dlc}/` : Platform.ROOT_DIRECTORY) +
            this.getLocalFolder());
    }
    /**
     * Get the local folder associated to videos.
     */
    static getLocalFolder() {
        return Paths.VIDEOS;
    }
    /**
     * Get the absolute path associated to this video.
     */
    getPath() {
        if (this.base64) {
            return this.base64;
        }
        return this.id === -1 ? '' : Video.getFolder(this.isBR, this.dlc) + '/' + this.name;
    }
    /**
     * Load the video as a blob URL when not on desktop and not br.
     * Blob URLs are required for video elements in browsers — data URLs are
     * rejected with NotSupportedError for large binary media files.
     */
    async checkBase64() {
        if (!Platform.IS_DESKTOP && !this.isBR && Platform.WEB_DEV) {
            const content = await Platform.loadFile(`${Platform.ROOT_DIRECTORY}${Video.getLocalFolder()}/${this.name}`);
            if (content) {
                const response = await fetch(content);
                const blob = await response.blob();
                this.base64 = URL.createObjectURL(blob);
            }
        }
    }
    /**
     * Read JSON into this video.
     */
    read(json) {
        this.id = Utils.valueOrDefault(json.id, -1);
        this.name = Utils.valueOrDefault(json.name, '');
        this.isBR = Utils.valueOrDefault(json.br, false);
        this.dlc = Utils.valueOrDefault(json.d, '');
        this.base64 = Utils.valueOrDefault(json.base64, '');
    }
}
