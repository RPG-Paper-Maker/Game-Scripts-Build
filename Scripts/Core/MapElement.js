/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Utils } from '../Common/index.js';
/**
 * An element in the map.
 */
export class MapElement {
    constructor() {
        this.xOffset = 0;
        this.yOffset = 0;
        this.zOffset = 0;
        this.front = false;
    }
    /**
     * Read the JSON associated to the map element.
     */
    read(json) {
        this.xOffset = Utils.valueOrDefault(json.xOff, 0);
        this.yOffset = Utils.valueOrDefault(json.yOff, 0);
        this.zOffset = Utils.valueOrDefault(json.zOff, 0);
    }
}
MapElement.COEF_TEX = 0.2;
