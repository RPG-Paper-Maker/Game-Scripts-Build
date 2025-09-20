/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Data, Scene } from "../index.js";
import { CHARACTER_KIND, CONDITION_HEROES_KIND, Mathf, OPERATION_KIND, Utils } from '../Common/index.js';
import { Player } from '../Core/index.js';
import { Base } from './Base.js';
import { DynamicValue } from './DynamicValue.js';
/**
 * A troop reaction condition definition.
 */
export class TroopReactionConditions extends Base {
    constructor(json) {
        super(json);
    }
    /**
     * Check if the conditions are valid in the current battle context.
     */
    isValid() {
        const sceneBattle = Scene.Map.current;
        if (this.isNumberOfTurn) {
            const plus = this.numberOfTurnPlus.getValue();
            const times = this.numberOfTurnTimes.getValue();
            if (times === 1) {
                if (sceneBattle.turn < plus) {
                    return false;
                }
            }
            else if (Mathf.mod(sceneBattle.turn - plus, times) !== 0) {
                return false;
            }
        }
        if (this.isHeroesMonsters) {
            return Player.applySelection(this.conditionHeroesKind, sceneBattle.players[this.isHeroes ? CHARACTER_KIND.HERO : CHARACTER_KIND.MONSTER], this.heroInstanceID.getValue(), (player) => {
                // Status check
                if (this.isStatusID) {
                    const statusId = this.statusID.getValue();
                    const hasStatus = player.status.some((s) => s.system.id === statusId);
                    if (!hasStatus) {
                        return false;
                    }
                }
                // Statistic check
                if (this.isStatisticID) {
                    const statId = this.statisticID.getValue();
                    const stat = Data.BattleSystems.getStatistic(statId);
                    const statValue = player[stat.abbreviation];
                    const statValueMax = player[stat.getMaxAbbreviation()];
                    if (statValueMax === undefined) {
                        throw new Error(`No max value for stat ${stat.name()}`);
                    }
                    const compareValue = this.statisticCompare.getValue();
                    return Mathf.OPERATORS_COMPARE[this.statisticOPERATION_KIND](this.statisticCompareUnit ? statValue / statValueMax : statValue, this.statisticCompareUnit ? compareValue / 100 : compareValue);
                }
                return true;
            });
        }
        return true;
    }
    /**
     * Read JSON into this troop reaction condition.
     */
    read(json) {
        this.isNumberOfTurn = Utils.valueOrDefault(json.isNumberOfTurn, false);
        this.numberOfTurnPlus = DynamicValue.readOrDefaultNumber(json.numberOfTurnPlus, 1);
        this.numberOfTurnTimes = DynamicValue.readOrDefaultNumber(json.numberOfTurnTimes, 1);
        this.isHeroesMonsters = Utils.valueOrDefault(json.isHeroesMonsters, false);
        this.isHeroes = Utils.valueOrDefault(json.isHeroes, true);
        this.conditionHeroesKind = Utils.valueOrDefault(json.conditionHeroesKind, CONDITION_HEROES_KIND.ALL_THE_HEROES);
        this.heroInstanceID = DynamicValue.readOrDefaultVariable(json.heroInstanceID);
        this.isStatusID = Utils.valueOrDefault(json.isStatusID, false);
        this.statusID = DynamicValue.readOrDefaultDatabase(json.statusID);
        this.isStatisticID = Utils.valueOrDefault(json.isStatisticID, false);
        this.statisticID = DynamicValue.readOrDefaultDatabase(json.statisticID);
        this.statisticOPERATION_KIND = Utils.valueOrDefault(json.statisticOPERATION_KIND, OPERATION_KIND.EQUAL_TO);
        this.statisticCompare = DynamicValue.readOrDefaultNumber(json.statisticCompare);
        this.statisticCompareUnit = Utils.valueOrDefault(json.statisticCompareUnit, true);
    }
}
