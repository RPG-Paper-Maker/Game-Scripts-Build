/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { TROOP_REACTION_FREQUENCY_KIND, Utils } from '../Common/index.js';
import { Reaction } from './Reaction.js';
import { TroopReactionConditions } from './TroopReactionConditions.js';
/**
 * A troop reaction definition with conditions and frequency.
 */
export class TroopReaction extends Reaction {
    constructor(json) {
        super(json);
    }
    /**
     * Read JSON into this troop reaction.
     */
    read(json) {
        super.read(json);
        this.id = json.id;
        this.conditions = new TroopReactionConditions(json.conditions);
        this.frequency = Utils.valueOrDefault(json.frequency, TROOP_REACTION_FREQUENCY_KIND.ONE_TIME);
    }
}
