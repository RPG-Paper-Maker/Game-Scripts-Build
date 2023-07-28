import { Base } from './Base.js';
import { System } from '../index.js';
import { MapObject } from '../Core/index.js';
/** @class
 *  An event command for modifying a currency value.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
declare class ModifyCurrency extends Base {
    currencyID: System.DynamicValue;
    operation: number;
    value: System.DynamicValue;
    constructor(command: any[]);
    /**
     *  Update and check if the event is finished.
    *   @param {Record<string, any>} - currentState The current state of the event
    *   @param {MapObject} object - The current object reacting
    *   @param {number} state - The state ID
    *   @returns {number} The number of node to pass
    */
    update(currentState: Record<string, any>, object: MapObject, state: number): number;
}
export { ModifyCurrency };
