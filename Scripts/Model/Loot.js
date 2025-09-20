/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Mathf } from '../Common/index.js';
import { Item } from '../Core/index.js';
import { Base } from './Base.js';
import { DynamicValue } from './DynamicValue.js';
/**
 * Represents a loot entry in the game.
 * Loot defines which item can drop, how many, its probability, and
 * at which levels it is available.
 */
export class Loot extends Base {
    constructor(json) {
        super(json);
    }
    /**
     * Checks if this loot is available for a given level.
     * @param level - The level to check against.
     * @returns True if the loot is available, false otherwise.
     */
    isAvailable(level) {
        return level >= this.initial.getValue() && level <= this.final.getValue();
    }
    /**
     * Computes the loot dropped at a specific level.
     * Uses probability and count to decide how many items drop.
     * @param level - The current level.
     * @returns The resulting Item if at least one drops, otherwise null.
     */
    currentLoot(level) {
        if (!this.isAvailable(level)) {
            return null;
        }
        const proba = this.probability.getValue();
        const totalNumber = this.number.getValue();
        let count = 0;
        for (let i = 0; i < totalNumber; i++) {
            if (Mathf.random(0, 100) <= proba) {
                count++;
            }
        }
        return count > 0 ? new Item(this.kind, this.lootID.getValue(), count) : null;
    }
    /**
     *  Read the JSON associated to the loot.
     */
    read(json) {
        this.kind = json.k;
        this.lootID = new DynamicValue(json.lid);
        this.number = new DynamicValue(json.n);
        this.probability = new DynamicValue(json.p);
        this.initial = new DynamicValue(json.i);
        this.final = new DynamicValue(json.f);
    }
}
