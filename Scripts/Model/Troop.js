/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Utils } from '../Common/index.js';
import { Base } from './Base.js';
import { TroopMonster } from './TroopMonster.js';
import { TroopReaction } from './TroopReaction.js';
/**
 * A troop definition in the game, containing monsters and reactions.
 */
export class Troop extends Base {
    constructor(json) {
        super(json);
    }
    /**
     * Read JSON into this troop.
     */
    read(json) {
        this.list = Utils.readJSONList(json.l, TroopMonster);
        this.reactions = Utils.readJSONList(json.reactions, TroopReaction);
    }
}
