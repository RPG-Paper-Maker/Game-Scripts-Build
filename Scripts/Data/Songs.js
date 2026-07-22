/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Paths, Platform, SONG_KIND } from '../Common/index.js';
import { Song } from '../Model/index.js';
import { Data } from '../index.js';
import { Base } from './Base.js';
/**
 * Handles all song data.
 */
export class Songs {
    /**
     * Get a song by kind and ID.
     */
    static get(kind, id, errorMessage) {
        if (kind === SONG_KIND.NONE || id === -1) {
            return new Song();
        }
        return Base.get(id, this.list.get(kind), `song ${Song.songKindToString(kind)}`, true, errorMessage);
    }
    /**
     * Create every Howl object and wait for all audio to fully decode.
     */
    static async preload() {
        const promises = [];
        for (const kindList of this.list.values()) {
            for (const song of kindList.values()) {
                song.load();
                const howl = song.howl;
                if (!howl || howl.state() === 'loaded') {
                    continue;
                }
                promises.push(new Promise((resolve) => {
                    howl.once('load', () => resolve());
                    howl.once('loaderror', () => resolve());
                }));
            }
        }
        await Promise.all(promises);
    }
    /**
     * Read the JSON file associated with songs.
     */
    static async read() {
        await this.readSelected();
    }
    /** Read only the title music and title-screen sound effects during boot. */
    static async readTitleScreen() {
        const selected = new Map();
        const add = (song, kind) => {
            const id = song?.songID?.getValue();
            if (id !== undefined && id !== -1) {
                if (!selected.has(kind))
                    selected.set(kind, new Set());
                selected.get(kind).add(id);
            }
        };
        add(Data.TitlescreenGameover.titleMusic, SONG_KIND.MUSIC);
        add(Data.Systems.soundCursor, SONG_KIND.SOUND);
        add(Data.Systems.soundConfirmation, SONG_KIND.SOUND);
        add(Data.Systems.soundCancel, SONG_KIND.SOUND);
        add(Data.Systems.soundImpossible, SONG_KIND.SOUND);
        await this.readSelected(selected);
    }
    static async readSelected(selected) {
        const json = (await Platform.parseFileJSON(Paths.FILE_SONGS));
        this.list = new Map();
        for (const jsonHash of json.list) {
            const k = jsonHash.k;
            const jsonList = jsonHash.v;
            const list = new Map();
            for (const jsonSong of jsonList) {
                const id = jsonSong.id ?? 0;
                if (selected && !selected.get(k)?.has(id))
                    continue;
                const song = new Song(jsonSong);
                song.kind = k;
                await song.checkBase64();
                list.set(id, song);
            }
            this.list.set(k, list);
        }
    }
}
