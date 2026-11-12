/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { SONG_KIND, Utils } from '../Common/index.js';
import { Base } from './Base.js';
import { PlaySong } from './PlaySong.js';
export class Credits extends Base {
    constructor(json) {
        super(json);
    }
    read(json) {
        this.texts = Utils.valueOrDefault(json.ct, {});
        this.speed = Utils.valueOrDefault(json.cs, 40);
        this.backgroundColorID = Utils.valueOrDefault(json.cbc, 1);
        this.backgroundImageID = Utils.valueOrDefault(json.cbi, -1);
        this.backgroundVideoID = Utils.valueOrDefault(json.cbv, -1);
        this.music = new PlaySong(SONG_KIND.MUSIC, json.cm);
        this.canSkip = Utils.valueOrDefault(json.ccs, true);
        this.skipKeyID = Utils.valueOrDefault(json.csk, 11);
        this.maintainKey = Utils.valueOrDefault(json.cmk, true);
        this.maintainDuration = json.cmd > 0 ? json.cmd : 3;
    }
}
