/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { PICTURE_KIND } from '../Common/index.js';
import { Data } from '../index.js';
import { Land } from './Land.js';
/**
 * An autotile element on the map grid.
 */
export class Autotile extends Land {
    constructor(json) {
        super();
        if (json) {
            this.read(json);
        }
    }
    /**
     * Update the geometry for this autotile and optionally generate collision data.
     * @param geometry - The custom geometry instance to update with vertices, indices and UVs.
     * @param texture - The texture bundle providing offsets and atlas management.
     * @param position - The autotile’s position in the map grid.
     * @param width - The total texture width (in pixels).
     * @param height - The total texture height (in pixels).
     * @param pictureID - The picture resource ID for this autotile.
     * @param count - The current face count used for indexing.
     * @returns A {@link StructMapElementCollision} describing collision data, or `null` if no collision applies.
     */
    updateGeometryAutotile(geometry, texture, position, width, height, pictureID, count) {
        const autotile = Data.SpecialElements.getAutotile(this.autotileID);
        const picture = autotile ? Data.Pictures.get(PICTURE_KIND.AUTOTILES, pictureID) : null;
        return super.updateGeometryLand(geometry, picture ? picture.getCollisionAtIndex(Land.prototype.getIndex.call(this, picture.width)) : null, position, width, height, ((this.tileID % 64) * Data.Systems.SQUARE_SIZE) / width, ((Math.floor(this.tileID / 64) + 10 * texture.getOffset(pictureID, this.texture)) *
            Data.Systems.SQUARE_SIZE) /
            height, Data.Systems.SQUARE_SIZE / width, Data.Systems.SQUARE_SIZE / height, count);
    }
    /**
     * Read and initialize this autotile from JSON data.
     */
    read(json) {
        super.read(json);
        this.autotileID = json.id;
        this.tileID = json.tid;
    }
}
