/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Paths, Platform, SONG_KIND, Utils } from '../Common/index.js';
import { Data } from '../index.js';
import { Base } from './Base.js';
/**
 * A song of the game.
 */
export class Song extends Base {
    constructor(json) {
        super(json);
    }
    /**
     * Convert a song kind to its string label.
     */
    static songKindToString(kind) {
        switch (kind) {
            case SONG_KIND.MUSIC:
                return 'music';
            case SONG_KIND.BACKGROUND_SOUND:
                return 'background music';
            case SONG_KIND.MUSIC_EFFECT:
                return 'music effect';
            case SONG_KIND.SOUND:
                return 'sound';
        }
        return '';
    }
    /**
     * Get the folder path for a given song kind.
     */
    static getFolder(kind, isBR, dlc) {
        return ((isBR ? Data.Systems.PATH_BR + '/' : dlc ? `${Data.Systems.PATH_DLCS}/${dlc}/` : Platform.ROOT_DIRECTORY) +
            this.getLocalFolder(kind));
    }
    /**
     * Get the local subfolder name for a given song kind.
     */
    static getLocalFolder(kind) {
        switch (kind) {
            case SONG_KIND.MUSIC:
                return Paths.MUSICS;
            case SONG_KIND.BACKGROUND_SOUND:
                return Paths.BACKGROUND_SOUNDS;
            case SONG_KIND.SOUND:
                return Paths.SOUNDS;
            case SONG_KIND.MUSIC_EFFECT:
                return Paths.MUSIC_EFFECTS;
        }
        return '';
    }
    /**
     * Get the absolute path of the song.
     */
    getPath() {
        if (this.base64) {
            return this.base64;
        }
        if (this.howl) {
            return this.howl._src;
        }
        return `${Song.getFolder(this.kind, this.isBR, this.dlc)}/${this.name}`;
    }
    /**
     * Load the song into memory.
     */
    load() {
        if (this.id !== -1 && !this.howl) {
            this.howl = new Howl({
                src: [this.getPath()],
                loop: this.kind !== SONG_KIND.MUSIC_EFFECT,
                html5: true,
                pool: 10,
            });
            if (this.base64) {
                this.base64 = '';
            }
        }
    }
    /**
     * Load the song as a base64 string when not on desktop and not br.
     */
    async checkBase64() {
        if (!Platform.IS_DESKTOP && !this.isBR && Platform.WEB_DEV) {
            this.base64 = await Platform.loadFile(`${Platform.ROOT_DIRECTORY.slice(0, -1)}${Song.getLocalFolder(this.kind)}/${this.name}`);
        }
    }
    /**
     * Read the JSON data into this song.
     */
    read(json) {
        this.id = json.id;
        this.name = json.name;
        this.isBR = json.br;
        this.dlc = Utils.valueOrDefault(json.d, '');
        this.base64 = json.base64;
    }
}
