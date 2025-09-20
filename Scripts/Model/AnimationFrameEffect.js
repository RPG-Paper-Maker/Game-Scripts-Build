/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { ANIMATION_EFFECT_CONDITION_KIND, SONG_KIND, Utils } from '../Common/index.js';
import { Base } from './Base.js';
import { PlaySong } from './PlaySong.js';
/**
 * Represents an effect triggered during an animation frame,
 * such as playing a sound effect under specific conditions.
 */
export class AnimationFrameEffect extends Base {
    constructor(json) {
        super(json);
    }
    /**
     * Plays the sound effect if conditions are met.
     * @param condition - The current animation effect condition.
     */
    playSE(condition) {
        if (this.se && (this.condition === ANIMATION_EFFECT_CONDITION_KIND.NONE || this.condition === condition)) {
            this.se.playSound();
        }
    }
    /**
     * Reads the JSON data describing the animation frame effect.
     */
    read(json) {
        const isSE = Utils.valueOrDefault(json.ise, true);
        if (isSE) {
            this.se = new PlaySong(SONG_KIND.SOUND, json.se ?? {});
        }
        this.condition = Utils.valueOrDefault(json.c, ANIMATION_EFFECT_CONDITION_KIND.NONE);
    }
}
