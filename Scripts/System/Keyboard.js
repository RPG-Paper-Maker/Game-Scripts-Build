/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Translatable } from './Translatable.js';
/** @class
 *  A key shortcut of the game.
 *  @extends {System.Translatable}
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  keyboard
 */
class Keyboard extends Translatable {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the keyboard.
     *  @param {Record<string, any>} - json Json object describing the keyboard
     */
    read(json) {
        super.read(json);
        this.id = json.id;
        this.sc = json.sc;
    }
    /**
     *  Get the string representation of the keyboard.
     *  @returns {string}
     */
    toString() {
        return this.sc
            .map((shortcut) => shortcut
            .map((sc) => {
            switch (sc) {
                case 'ArrowUp':
                    return '↑';
                case 'ArrowDown':
                    return '↓';
                case 'ArrowLeft':
                    return '←';
                case 'ArrowRight':
                    return '→';
                case 'Control':
                    return 'Ctrl';
                default:
                    return sc;
            }
        })
            .join(' + '))
            .join(' | ')
            .toUpperCase();
    }
}
export { Keyboard };
