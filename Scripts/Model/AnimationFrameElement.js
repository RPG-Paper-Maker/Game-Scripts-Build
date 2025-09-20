/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Utils } from '../Common/index.js';
import { Base } from './Base.js';
/**
 * Represents a single element (sprite) of an animation frame.
 * Each element defines its own position, texture region, transformations
 * (zoom, angle, flip), and opacity.
 */
class AnimationFrameElement extends Base {
    constructor(json) {
        super(json);
    }
    /**
     * Draws the animation frame element on the screen.
     * @param picture - The picture resource used for the animation.
     * @param position - The position on screen where the element is drawn.
     * @param rows - Total number of rows in the animation texture.
     * @param cols - Total number of columns in the animation texture.
     */
    draw(picture, position, rows, cols) {
        picture.zoom = this.zoom;
        picture.opacity = this.opacity;
        picture.angle = this.angle;
        picture.centered = true;
        picture.reverse = this.flip;
        const w = picture.oW / cols;
        const h = picture.oH / rows;
        picture.draw({
            x: position.x + this.x,
            y: position.y + this.y,
            w: w * this.zoom,
            h: h * this.zoom,
            sx: w * this.texCol,
            sy: h * this.texRow,
            sw: w,
            sh: h,
        });
    }
    /**
     * Reads the JSON data associated with this frame element.
     */
    read(json) {
        this.x = Utils.valueOrDefault(json.x, 0);
        this.y = Utils.valueOrDefault(json.y, 0);
        this.texRow = Utils.valueOrDefault(json.tr, 0);
        this.texCol = Utils.valueOrDefault(json.tc, 0);
        this.zoom = Utils.valueOrDefault(json.z, 100) / 100;
        this.angle = Utils.valueOrDefault(json.a, 0);
        this.flip = Utils.valueOrDefault(json.fv, false);
        this.opacity = Utils.valueOrDefault(json.o, 100) / 100;
    }
}
export { AnimationFrameElement };
