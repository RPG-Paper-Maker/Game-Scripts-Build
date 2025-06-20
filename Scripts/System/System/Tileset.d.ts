import { CollisionSquare } from '../Core/index.js';
import { System } from '../index.js';
import { Base } from './Base.js';
/** @class
 *  A tileset of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - json Json object describing the tileset
 */
declare class Tileset extends Base {
    collisions: CollisionSquare[];
    id: number;
    battleMap: System.DynamicValue;
    picture: System.Picture;
    constructor(json?: Record<string, any>);
    /**
     *  Assign the default members.
     */
    setup(): void;
    /**
     *  Read the JSON associated to the tileset.
     *  @param {Record<string, any>} - json Json object describing the tileset
     */
    read(json: Record<string, any>): void;
    /**
     *  Get the path to the picture tileset.
     *  @returns {string}
     */
    getPath(): string;
}
export { Tileset };
