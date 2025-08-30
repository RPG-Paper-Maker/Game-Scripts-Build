/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Utils } from '../Common/index.js';
/** @class
 *  An element in the map.
 */
class MapElement {
    constructor() {
        this.xOffset = 0;
        this.yOffset = 0;
        this.zOffset = 0;
    }
    /**
     *  Read the JSON associated to the map element.
     *  @param {Record<string, any>} json - Json object describing the map element
     */
    read(json) {
        this.xOffset = Utils.defaultValue(json.xOff, 0);
        this.yOffset = Utils.defaultValue(json.yOff, 0);
        this.zOffset = Utils.defaultValue(json.zOff, 0);
    }
}
MapElement.COEF_TEX = 0.2;
export { MapElement };
