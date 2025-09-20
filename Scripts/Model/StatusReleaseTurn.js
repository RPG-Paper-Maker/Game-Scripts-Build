/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { OPERATION_KIND, Utils } from '../Common/index.js';
import { Base } from './Base.js';
import { DynamicValue } from './DynamicValue.js';
/**
 * A possible status release turn condition for a hero.
 */
export class StatusReleaseTurn extends Base {
    constructor(json) {
        super(json);
    }
    /**
     * Read JSON into this status release turn.
     */
    read(json) {
        this.operationTurnKind = Utils.valueOrDefault(json.operationTurnKind, OPERATION_KIND.GREATER_THAN_OR_EQUAL_TO);
        this.turn = DynamicValue.readOrDefaultNumber(json.turn, 1);
        this.chance = DynamicValue.readOrDefaultNumberDouble(json.chance);
    }
}
