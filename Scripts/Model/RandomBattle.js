/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Utils } from '../Common/index.js';
import { Game } from '../Core/index.js';
import { Base } from './Base.js';
import { DynamicValue } from './DynamicValue.js';
/**
 * Represents a random battle of the game.
 */
export class RandomBattle extends Base {
    constructor(json) {
        super(json);
    }
    /**
     * Update the current priority value.
     */
    updateCurrentPriority() {
        this.currentPriority = this.priority.getValue();
    }
    /**
     * Update the current number of steps for this random battle.
     */
    updateCurrentNumberSteps() {
        if (this.isEntireMap) {
            this.currentNumberSteps++;
        }
        else {
            for (const terrain of this.terrains) {
                if (Game.current.hero.terrain === terrain.getValue()) {
                    this.currentNumberSteps++;
                    break;
                }
            }
        }
    }
    /**
     * Reset the current number of steps.
     */
    resetCurrentNumberSteps() {
        this.currentNumberSteps = 0;
    }
    /**
     * Initialize this random battle from JSON data.
     */
    read(json) {
        this.troopID = DynamicValue.readOrDefaultDatabase(json.troopID);
        this.priority = DynamicValue.readOrDefaultNumber(json.priority, 10);
        this.isEntireMap = Utils.valueOrDefault(json.isEntireMap, true);
        this.terrains = this.isEntireMap
            ? []
            : Utils.readJSONList(json.terrains, (obj) => DynamicValue.readOrDefaultNumber(obj.value));
        this.resetCurrentNumberSteps();
    }
}
