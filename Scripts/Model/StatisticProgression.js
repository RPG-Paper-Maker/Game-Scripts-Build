/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Interpreter } from '../Common/index.js';
import { Base } from './Base.js';
import { Class } from './Class.js';
import { DynamicValue } from './DynamicValue.js';
import { ProgressionTable } from './ProgressionTable.js';
/**
 * Represents a statistic progression for a class or player.
 */
export class StatisticProgression extends Base {
    constructor(json) {
        super(json);
    }
    /**
     * Gets the progression value at a specific level.
     * @param level - The level to get the value for
     * @param user - The player using this statistic
     * @param maxLevel - Optional maximum level (defaults to the class final level)
     * @returns The value of the statistic at the specified level
     */
    getValueAtLevel(level, user, maxLevel) {
        return this.isFix
            ? this.table.getProgressionAt(level, maxLevel === undefined
                ? user.system.getProperty(Class.PROPERTY_FINAL_LEVEL, user.changedClass)
                : maxLevel)
            : Interpreter.evaluate(this.formula.getValue(), { user: user });
    }
    /**
     * Reads the JSON data to initialize this statistic progression.
     */
    read(json) {
        this.id = json.id;
        this.maxValue = new DynamicValue(json.m);
        this.isFix = json.if;
        if (this.isFix) {
            this.table = new ProgressionTable(undefined, json.t);
            this.random = new DynamicValue(json.r);
        }
        else {
            this.formula = new DynamicValue(json.f);
        }
    }
}
