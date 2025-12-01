/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { PICTURE_KIND } from '../Common/index.js';
import { Game } from '../Core/index.js';
import { Data } from '../index.js';
import { Base } from './Base.js';
import { DynamicValue } from './DynamicValue.js';
/**
 * A tileset of the game.
 */
export class Tileset extends Base {
    constructor(json) {
        super(json);
        this.collisions = null;
    }
    /**
     * Get the path to the picture tileset.
     */
    getPath() {
        const newID = Game.current.textures.tilesets[this.id];
        const picture = newID === undefined ? this.picture : Data.Pictures.get(PICTURE_KIND.TILESETS, newID);
        return picture ? picture.getPath() : null;
    }
    /**
     * Read JSON into this tileset.
     */
    read(json) {
        this.id = json.id;
        this.picture = Data.Pictures.get(PICTURE_KIND.TILESETS, json.pic ?? -1);
        this.battleMap = DynamicValue.readOrDefaultDatabase(json.bm, 1);
    }
}
