/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
/** @class
 *  An event command representing one of the choice.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class Choice extends Base {
    constructor(command) {
        super();
        this.index = command[0];
        this.isDirectNode = true;
        this.parallel = false;
    }
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
     */
    update(currentState, object, state) {
        return -1;
    }
    /**
     *  Returns the number of node to pass.
     *  @returns {number}
     */
    goToNextCommand() {
        return 1;
    }
}
export { Choice };
