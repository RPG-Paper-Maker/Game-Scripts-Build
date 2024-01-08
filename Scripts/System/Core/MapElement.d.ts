import { Position } from './Position.js';
import { CollisionSquare } from './CollisionSquare.js';
import { Vector3 } from './Vector3.js';
interface StructMapElementCollision {
    b?: number[];
    p?: Position;
    l?: Vector3;
    c?: Vector3;
    cs?: CollisionSquare;
    w?: number;
    h?: number;
    d?: number;
    rw?: number;
    rh?: number;
    m?: number;
    t?: MapElement;
    k?: boolean;
    left?: boolean;
    right?: boolean;
    top?: boolean;
    bot?: boolean;
    a?: number;
    id?: number;
    cl?: boolean;
    cr?: [number, number, number];
}
/** @class
 *  An element in the map.
 */
declare class MapElement {
    static readonly COEF_TEX = 0.2;
    xOffset: number;
    yOffset: number;
    zOffset: number;
    front: boolean;
    constructor();
    /**
     *  Read the JSON associated to the map element.
     *  @param {Record<string, any>} json - Json object describing the map element
     */
    read(json: Record<string, any>): void;
}
export { StructMapElementCollision, MapElement };
