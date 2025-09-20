/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Utils } from '../Common/index.js';
import { AnimationFrameEffect } from './AnimationFrameEffect.js';
import { AnimationFrameElement } from './AnimationFrameElement.js';
import { Base } from './Base.js';
/**
 * Represents a single frame in an animation, containing
 * drawable elements and associated effects.
 */
export class AnimationFrame extends Base {
    constructor(json) {
        super(json);
    }
    /**
     * Plays the sound effects associated with this frame,
     * if their conditions are met.
     * @param condition - The current animation effect condition.
     */
    playSounds(condition) {
        for (const effect of this.effects) {
            effect.playSE(condition);
        }
    }
    /**
     * Draws the animation frame elements.
     * @param picture - The picture associated with the animation.
     * @param position - The position on screen for the animation.
     * @param rows - The number of rows in the animation texture.
     * @param cols - The number of columns in the animation texture.
     */
    draw(picture, position, rows, cols) {
        for (const element of this.elements) {
            element?.draw(picture, position, rows, cols);
        }
    }
    /**
     * Reads the JSON data describing the animation frame.
     */
    read(json) {
        this.elements = Utils.readJSONList(json.e, AnimationFrameElement);
        this.effects = Utils.readJSONList(json.ef, AnimationFrameEffect, true);
    }
}
