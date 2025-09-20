/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from './Base.js';
import { DynamicValue } from './DynamicValue.js';
/**
 * Represents a progression table.
 */
class ProgressionTable extends Base {
    constructor(id, json) {
        super(json);
        this.id = id;
    }
    /** Create a progression table from dynamic values. */
    static create(i, f, equation) {
        const progression = new ProgressionTable();
        progression.initialize(i, f, equation);
        return progression;
    }
    /** Create a progression table from numbers. */
    static createFromNumbers(i, f, equation) {
        return this.create(DynamicValue.createNumber(i), DynamicValue.createNumber(f), equation);
    }
    /** Initialize this progression table. */
    initialize(i, f, equation) {
        this.initialValue = i;
        this.finalValue = f;
        this.equation = equation;
        this.table = new Map();
    }
    /**
     * Get progression at a given step.
     * @param current - Current step
     * @param f - Final step
     * @param decimal - Whether to keep decimals
     */
    getProgressionAt(current, f, decimal = false) {
        // Check if specific value
        const cached = this.table.get(current);
        if (cached) {
            return cached;
        }
        // Update change and duration
        this.start = this.initialValue.getValue();
        this.change = this.finalValue.getValue() - this.initialValue.getValue();
        this.duration = f - 1;
        // Check according to equation
        const x = current - 1;
        let result = 0;
        switch (this.equation) {
            case 0:
                result = this.easingLinear(x);
                break;
            case -1:
                result = this.easingQuadraticIn(x);
                break;
            case 1:
                result = this.easingQuadraticOut(x);
                break;
            case -2:
                result = this.easingCubicIn(x);
                break;
            case 2:
                result = this.easingCubicOut(x);
                break;
            case -3:
                result = this.easingQuarticIn(x);
                break;
            case 3:
                result = this.easingQuarticOut(x);
                break;
            case -4:
                result = this.easingQuinticIn(x);
                break;
            case 4:
                result = this.easingQuinticOut(x);
                break;
        }
        return decimal ? result : Math.floor(result);
    }
    /** Easing linear. */
    easingLinear(x) {
        return (this.change * x) / this.duration + this.start;
    }
    /** Easing quadratic in. */
    easingQuadraticIn(x) {
        x /= this.duration;
        return this.change * x * x + this.start;
    }
    /** Easing quadratic out. */
    easingQuadraticOut(x) {
        x /= this.duration;
        return -this.change * x * (x - 2) + this.start;
    }
    /** Easing cubic in. */
    easingCubicIn(x) {
        x /= this.duration;
        return this.change * x * x * x + this.start;
    }
    /** Easing cubic out. */
    easingCubicOut(x) {
        x = x / this.duration - 1;
        return this.change * (x * x * x + 1) + this.start;
    }
    /** Easing quartic in. */
    easingQuarticIn(x) {
        x /= this.duration;
        return this.change * x * x * x * x + this.start;
    }
    /** Easing quartic out. */
    easingQuarticOut(x) {
        x = x / this.duration - 1;
        return -this.change * (x * x * x * x - 1) + this.start;
    }
    /** Easing quintic in. */
    easingQuinticIn(x) {
        x /= this.duration;
        return this.change * x * x * x * x * x + this.start;
    }
    /** Easing quintic out. */
    easingQuinticOut(x) {
        x = x / this.duration - 1;
        return this.change * (x * x * x * x * x + 1) + this.start;
    }
    /** Initialize this table from JSON. */
    read(json) {
        this.initialValue = new DynamicValue(json.i);
        this.finalValue = new DynamicValue(json.f);
        this.equation = json.e;
        this.table = new Map();
        if (json.t) {
            for (const entry of json.t) {
                this.table.set(entry.k, entry.v);
            }
        }
    }
}
export { ProgressionTable };
