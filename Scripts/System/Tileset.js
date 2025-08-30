/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Enum, Utils } from '../Common/index.js';
import { Game } from '../Core/index.js';
import { Datas, System } from '../index.js';
import { Base } from './Base.js';
var PictureKind = Enum.PictureKind;
/** @class
 *  A tileset of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - json Json object describing the tileset
 */
class Tileset extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Assign the default members.
     */
    setup() {
        this.collisions = null;
    }
    /**
     *  Read the JSON associated to the tileset.
     *  @param {Record<string, any>} - json Json object describing the tileset
     */
    read(json) {
        this.id = json.id;
        this.picture = Datas.Pictures.get(PictureKind.Tilesets, json.pic);
        this.battleMap = System.DynamicValue.readOrDefaultDatabase(json.bm, 1);
    }
    /**
     *  Get the path to the picture tileset.
     *  @returns {string}
     */
    getPath() {
        let newID = Game.current.textures.tilesets[this.id];
        let picture = Utils.isUndefined(newID) ? this.picture : Datas.Pictures.get(Enum.PictureKind.Tilesets, newID);
        return picture ? picture.getPath() : null;
    }
}
export { Tileset };
