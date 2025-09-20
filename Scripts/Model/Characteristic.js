/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { CHARACTERISTIC_KIND, INCREASE_DECREASE_KIND, Interpreter, Utils } from '../Common/index.js';
import { Player } from '../Core/index.js';
import { Data, Model, Scene } from '../index.js';
import { Base } from './Base.js';
import { DynamicValue } from './DynamicValue.js';
/**
 * Represents a characteristic of a common skill item.
 */
export class Characteristic extends Base {
    constructor(json) {
        super(json);
    }
    /**
     * Get the new stat value of a player with this characteristic bonus.
     * @param gamePlayer - The player to apply the characteristic to.
     * @returns A tuple [statisticID, value] or null if not applicable.
     */
    getNewStatValue(gamePlayer) {
        switch (this.kind) {
            case CHARACTERISTIC_KIND.INCREASE_DECREASE:
                switch (this.increaseDecreaseKind) {
                    case INCREASE_DECREASE_KIND.STAT_VALUE: {
                        const statID = this.statisticValueID.getValue();
                        const stat = Data.BattleSystems.getStatistic(statID);
                        let value = this.value.getValue() * (this.isIncreaseDecrease ? 1 : -1);
                        const baseStatValue = gamePlayer[stat.getAbbreviationNext()] - gamePlayer[stat.getBonusAbbreviation()];
                        if (this.operation) {
                            // *
                            value = this.unit
                                ? baseStatValue * Math.round((baseStatValue * value) / 100)
                                : baseStatValue * value; // % / Fix
                        }
                        else {
                            // +
                            value = this.unit ? Math.round((baseStatValue * value) / 100) : value; // % / Fix
                        }
                        return [statID, value];
                    }
                    case INCREASE_DECREASE_KIND.ELEMENT_RES: {
                        const statID = this.unit
                            ? Data.BattleSystems.getStatisticElementPercent(this.elementResID.getValue())
                            : Data.BattleSystems.getStatisticElement(this.elementResID.getValue());
                        const stat = Data.BattleSystems.getStatistic(statID);
                        let value = this.value.getValue() * (this.isIncreaseDecrease ? 1 : -1);
                        if (this.operation) {
                            // *
                            value *= gamePlayer[stat.getAbbreviationNext()] - gamePlayer[stat.getBonusAbbreviation()];
                        }
                        return [statID, value];
                    }
                    default:
                        return null;
                }
            default:
                return null;
        }
    }
    /**
     * Apply increase/decrease values to a specific resistance.
     * @param res - The resistance object to modify.
     */
    setIncreaseDecreaseValues(res) {
        let propName = '';
        let id = 0;
        switch (this.increaseDecreaseKind) {
            case INCREASE_DECREASE_KIND.STATUS_RES:
                propName = 'statusRes';
                id = this.statusResID.getValue();
                break;
            case INCREASE_DECREASE_KIND.EXPERIENCE_GAIN:
                propName = 'experienceGain';
                id = 0;
                break;
            case INCREASE_DECREASE_KIND.CURRENCY_GAIN:
                propName = 'currencyGain';
                id = this.currencyGainID.getValue();
                break;
            case INCREASE_DECREASE_KIND.SKILL_COST:
                propName = 'skillCostRes';
                id = this.isAllSkillCost ? -1 : this.skillCostID.getValue();
                break;
        }
        if (!res[propName][id]) {
            res[propName][id] = {
                multiplication: 1,
                addition: 0,
            };
        }
        const value = this.value.getValue();
        if (this.operation) {
            // * (multiplication)
            const v = this.unit ? value / 100 : value;
            res[propName][id].multiplication *= this.isIncreaseDecrease ? v : 1 / v; // % / Fix
        }
        else {
            // + (addition)
            res[propName][id].addition += this.isIncreaseDecrease ? value : -value; // % / Fix
        }
    }
    /**
     * Execute the characteristic's script.
     * @param user - The player executing the script.
     */
    executeScript(user) {
        Interpreter.evaluate(this.script.getValue(), { user, addReturn: false });
    }
    /**
     * Get the string representation of the characteristic.
     */
    toString() {
        const user = Scene.Map.current.user?.player ?? Player.getTemporaryPlayer();
        const target = Player.getTemporaryPlayer();
        let result = '';
        switch (this.kind) {
            case CHARACTERISTIC_KIND.INCREASE_DECREASE: {
                switch (this.increaseDecreaseKind) {
                    case INCREASE_DECREASE_KIND.STAT_VALUE:
                        result += Data.BattleSystems.getStatistic(Interpreter.evaluate(this.statisticValueID.getValue(), {
                            user,
                            target,
                        })).name();
                        break;
                    case INCREASE_DECREASE_KIND.ELEMENT_RES:
                        result +=
                            Data.BattleSystems.getElement(this.elementResID.getValue()).name() + ' res.';
                        break;
                    case INCREASE_DECREASE_KIND.STATUS_RES:
                        result += Data.Status.get(this.statusResID.getValue()).name() + ' res.';
                        break;
                    case INCREASE_DECREASE_KIND.EXPERIENCE_GAIN:
                        result += Data.BattleSystems.getExpStatistic().name() + ' gain';
                        break;
                    case INCREASE_DECREASE_KIND.CURRENCY_GAIN:
                        result += Data.Systems.getCurrency(this.currencyGainID.getValue()).name() + ' gain';
                        break;
                    case INCREASE_DECREASE_KIND.SKILL_COST:
                        if (this.isAllSkillCost) {
                            result += 'All skills cost';
                        }
                        else {
                            result += Data.Skills.get(this.skillCostID.getValue()).name() + ' skill cost';
                        }
                        break;
                    case INCREASE_DECREASE_KIND.VARIABLE:
                        result += Data.Variables.get(this.variableID);
                        break;
                }
                result += ' ';
                let sign = this.isIncreaseDecrease ? 1 : -1;
                const value = this.value.getValue();
                sign *= Math.sign(value);
                if (this.operation) {
                    result += 'x';
                    if (sign === -1) {
                        result += '/';
                    }
                }
                else {
                    if (sign === 1) {
                        result += '+';
                    }
                    else if (sign === -1) {
                        result += '-';
                    }
                }
                result += Math.abs(value);
                if (this.unit) {
                    result += '%';
                }
                break;
            }
            default:
                break;
        }
        return result;
    }
    /**
     * Read the JSON associated to the characteristic.
     */
    read(json) {
        this.kind = Utils.valueOrDefault(json.k, CHARACTERISTIC_KIND.INCREASE_DECREASE);
        switch (this.kind) {
            case CHARACTERISTIC_KIND.INCREASE_DECREASE:
                this.isIncreaseDecrease = Utils.valueOrDefault(json.iid, true);
                this.increaseDecreaseKind = Utils.valueOrDefault(json.idk, INCREASE_DECREASE_KIND.STAT_VALUE);
                switch (this.increaseDecreaseKind) {
                    case INCREASE_DECREASE_KIND.STAT_VALUE:
                        this.statisticValueID = DynamicValue.readOrDefaultDatabase(json.svid);
                        break;
                    case INCREASE_DECREASE_KIND.ELEMENT_RES:
                        this.elementResID = DynamicValue.readOrDefaultDatabase(json.erid);
                        break;
                    case INCREASE_DECREASE_KIND.STATUS_RES:
                        this.statusResID = DynamicValue.readOrDefaultDatabase(json.strid);
                        break;
                    case INCREASE_DECREASE_KIND.CURRENCY_GAIN:
                        this.currencyGainID = DynamicValue.readOrDefaultDatabase(json.cgid);
                        break;
                    case INCREASE_DECREASE_KIND.SKILL_COST:
                        this.skillCostID = DynamicValue.readOrDefaultDatabase(json.scid);
                        this.isAllSkillCost = Utils.valueOrDefault(json.iasc, true);
                        break;
                    case INCREASE_DECREASE_KIND.VARIABLE:
                        this.variableID = Utils.valueOrDefault(json.vid, 1);
                        break;
                }
                this.operation = Utils.valueOrDefault(json.o, true);
                this.value = DynamicValue.readOrDefaultNumber(json.v);
                this.unit = Utils.valueOrDefault(json.u, true);
                break;
            case CHARACTERISTIC_KIND.SCRIPT:
                this.script = DynamicValue.readOrDefaultMessage(json.s);
                break;
            case CHARACTERISTIC_KIND.ALLOW_FORBID_EQUIP:
                this.isAllowEquip = Utils.valueOrDefault(json.iae, true);
                this.isAllowEquipWeapon = Utils.valueOrDefault(json.iaew, true);
                this.equipWeaponTypeID = DynamicValue.readOrDefaultDatabase(json.ewtid);
                this.equipArmorTypeID = DynamicValue.readOrDefaultDatabase(json.eatid);
                break;
            case CHARACTERISTIC_KIND.ALLOW_FORBID_CHANGE:
                this.isAllowChangeEquipment = Utils.valueOrDefault(json.iace, true);
                this.changeEquipmentID = DynamicValue.readOrDefaultDatabase(json.ceid);
                break;
            case CHARACTERISTIC_KIND.BEGIN_EQUIPMENT:
                this.beginEquipmentID = DynamicValue.readOrDefaultDatabase(json.beid);
                this.isBeginWeapon = Utils.valueOrDefault(json.ibw, true);
                this.beginWeaponArmorID = DynamicValue.readOrDefaultDatabase(json.bwaid);
                break;
            case CHARACTERISTIC_KIND.ELEMENT:
                this.elementID = Model.DynamicValue.readOrDefaultDatabase(json.eid);
                break;
        }
    }
}
