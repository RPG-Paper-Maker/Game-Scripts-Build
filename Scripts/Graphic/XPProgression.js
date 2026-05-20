/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Graphic } from "../index.js";
import { ScreenResolution } from '../Common/index.js';
import { Game } from '../Core/index.js';
import { Base } from './Base.js';
/** @class
 *  The graphic displaying all the progression for each character.
 *  @extends Graphic.Base
 */
class XPProgression extends Base {
    constructor() {
        super();
        const l = Game.current.teamHeroes.length;
        this.graphicCharacters = new Array(l);
        for (let i = 0; i < l; i++) {
            this.graphicCharacters[i] = new Graphic.Player(Game.current.teamHeroes[i]);
        }
    }
    /**
     *  Update graphics experience.
     */
    updateExperience() {
        for (const graphic of this.graphicCharacters) {
            graphic.updateExperience();
        }
    }
    /**
     *  Get the content height in logical pixels.
     *  @returns {number}
     */
    getHeight() {
        const l = this.graphicCharacters.length;
        if (l === 0)
            return 0;
        return (l - 1) * 90 + this.graphicCharacters[0].getChoiceHeight();
    }
    /**
     *  Drawing the progression.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawChoice(x, y, w, h) {
        this.draw(x, y, w, h);
    }
    /**
     *  Drawing the progression.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    draw(x, y, w, h) {
        for (let i = 0, l = this.graphicCharacters.length; i < l; i++) {
            this.graphicCharacters[i].drawChoice(x, y + ScreenResolution.getScreenY(i * 90), w, ScreenResolution.getScreenY(85));
        }
    }
}
export { XPProgression };
