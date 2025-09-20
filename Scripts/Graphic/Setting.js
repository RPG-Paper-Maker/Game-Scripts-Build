/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { ALIGN, TITLE_SETTING_KIND } from '../Common/index.js';
import { Data, Graphic } from '../index.js';
import { Base } from './Base.js';
/** @class
 *  A class for all settings to display in screen.
 *  @extends Graphic.Base
 *  @param {number} id -
 */
class Setting extends Base {
    constructor(id) {
        super();
        let textLeft, textInformation;
        switch (id) {
            case TITLE_SETTING_KIND.KEYBOARD_ASSIGNMENT:
                textLeft = Data.Languages.extras.keyboardAssignment.name();
                textInformation = Data.Languages.extras.keyboardAssignmentDescription.name();
                this.graphicRight = new Graphic.Text('...', { align: ALIGN.CENTER });
                break;
            case TITLE_SETTING_KIND.LANGUAGE:
                textLeft = Data.Languages.extras.language.name();
                textInformation = Data.Languages.extras.languageDescription.name();
                this.graphicRight = new Graphic.Text('...', { align: ALIGN.CENTER });
                break;
        }
        this.graphicTextLeft = new Graphic.Text(textLeft);
        this.graphicTextInformation = new Graphic.Text(textInformation, { align: ALIGN.CENTER });
    }
    /**
     *  Drawing the choice.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawChoice(x, y, w, h) {
        this.graphicTextLeft.draw(x, y, w, h);
        this.graphicRight.draw(x + w / 2, y, w / 2, h);
    }
    /**
     *  Drawing the settings informations.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    draw(x, y, w, h) {
        this.graphicTextInformation.draw(x, y, w, h);
    }
}
export { Setting };
