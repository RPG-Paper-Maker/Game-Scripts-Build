/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { CHARACTER_KIND, CHARACTERISTIC_KIND, CONDITION_HEROES_KIND, INCREASE_DECREASE_KIND, Interpreter, ITEM_KIND, Mathf, Platform, Utils, } from '../Common/index.js';
import { Data, Graphic, Model } from '../index.js';
import { Item } from './Item.js';
import { Skill } from './Skill.js';
import { Status } from './Status.js';
/** @class
 *  A character in the team/hidden/reserve.
 *  @param {CHARACTER_KIND} [kind=undefined] - The kind of the character (hero or monster)
 *  @param {number} [id=undefined] - The ID of the character
 *  @param {number} [instanceID=undefined] - The instance id of the character
 *  @param {Skill[]} [skills=undefined] - List of all the learned skills
 *  @param {Record<string, any>} - [json=undefined] Json object describing the items
 */
class Player {
    constructor(kind, id, instanceID, skills, status, name, json) {
        this.battlerID = null;
        this.facesetID = null;
        this.facesetIndexX = null;
        this.facesetIndexY = null;
        if (kind !== undefined) {
            this.kind = kind;
            this.id = id;
            this.instid = instanceID;
            this.system = this.getSystem();
            this.name = name === undefined ? this.system.name() : name;
            // Skills
            this.skills = [];
            let i, l;
            for (i = 0, l = skills.length; i < l; i++) {
                this.skills[i] = new Skill(skills[i].id);
            }
            // Equip
            l = Data.BattleSystems.maxEquipmentID;
            this.equip = new Array(l + 1);
            for (i = 1, l = Data.BattleSystems.maxEquipmentID; i <= l; i++) {
                this.equip[i] = null;
            }
            // Status
            this.status = [];
            let element;
            for (i = 0, l = status.length; i < l; i++) {
                element = status[i];
                this.status[i] = new Status(element.id, element.turn);
            }
            // Elements
            this.updateElements();
            // Experience list
            this.editedExpList = {};
            this.levelingUp = false;
            this.testedLevelUp = true;
            // Read if possible
            if (json) {
                this.read(json);
            }
            else {
                this.expList = this.system.createExpList(undefined);
            }
        }
    }
    /**
     *  Get the max size of equipment kind names.
     *  @static
     *  @returns {number}
     */
    static getEquipmentLength() {
        // Adding equipments
        let maxLength = 0;
        let graphic;
        for (let i = 0, l = Data.BattleSystems.equipmentsIDs.length - 1; i < l; i++) {
            graphic = new Graphic.Text(Data.BattleSystems.getEquipment(Data.BattleSystems.equipmentsIDs[i + 1]).name());
            graphic.updateContextFont();
            maxLength = Math.max(Platform.ctx.measureText(graphic.text).width, maxLength);
        }
        return maxLength;
    }
    /**
     *  Get the max size of equipment kind names.
     *  @static
     *  @param {number[]} values - The values
     *  @returns {GamePlayer}
     */
    static getTemporaryPlayer(values) {
        const player = new Player();
        const statistics = Data.BattleSystems.statisticsIDs;
        for (let i = 0, l = statistics.length; i < l; i++) {
            player.initStatValue(Data.BattleSystems.getStatistic(statistics[i]), values ? values[statistics[i]] : 0);
        }
        return player;
    }
    /**
     *  Apply callback with all the heroes.
     *  @param {Player[]} tab - The heroes list
     *  @param {Function} callback - The callback
     *  @returns {boolean}
     */
    static allTheHeroes(tab, callback) {
        for (let i = 0, l = tab.length; i < l; i++) {
            if (!callback.call(this, tab[i])) {
                return false;
            }
        }
        return true;
    }
    /**
     *  Apply callback with none of the heroes.
     *  @param {Player[]} tab - The heroes list
     *  @param {Function} callback - The callback
     *  @returns {boolean}
     */
    static noneOfTheHeroes(tab, callback) {
        for (let i = 0, l = tab.length; i < l; i++) {
            if (callback.call(this, tab[i])) {
                return false;
            }
        }
        return true;
    }
    /**
     *  Apply callback with at least one hero.
     *  @param {Player[]} tab - The heroes list
     *  @param {Function} callback - The callback
     *  @returns {boolean}
     */
    static atLeastOneHero(tab, callback) {
        for (let i = 0, l = tab.length; i < l; i++) {
            if (callback.call(this, tab[i])) {
                return true;
            }
        }
        return false;
    }
    /**
     *  Apply callback with the hero with instance ID.
     *  @param {Player[]} tab - The heroes list
     *  @param {number} id - The hero instance id
     *  @param {Function} callback - The callback
     *  @returns {boolean}
     */
    static theHeroeWithInstanceID(tab, id, callback) {
        let hero;
        for (let i = 0, l = tab.length; i < l; i++) {
            hero = tab[i];
            if (hero.instid === id && !callback.call(this, hero)) {
                return false;
            }
        }
        return true;
    }
    /**
     *  Apply callback according to heroes selection.
     *  @param {Player[]} tab - The heroes list
     *  @param {Function} callback - The callback
     *  @returns {boolean}
     */
    static applySelection(selectionKind, tab, instanceID, callback) {
        switch (selectionKind) {
            case CONDITION_HEROES_KIND.ALL_THE_HEROES:
                return Player.allTheHeroes(tab, callback);
            case CONDITION_HEROES_KIND.NONE_OF_THE_HEROES:
                return Player.noneOfTheHeroes(tab, callback);
            case CONDITION_HEROES_KIND.AT_LEAST_ONE_HERO:
                return Player.atLeastOneHero(tab, callback);
            case CONDITION_HEROES_KIND.THE_HERO_WITH_INSTANCE_ID:
                return Player.theHeroeWithInstanceID(tab, instanceID, callback);
        }
    }
    /**
     *  Get the player informations Model.
     *  @returns {System.Hero}
     */
    getSystem() {
        switch (this.kind) {
            case CHARACTER_KIND.HERO:
                return Data.Heroes.get(this.id);
            case CHARACTER_KIND.MONSTER:
                return Data.Monsters.get(this.id);
        }
    }
    /**
     *  Get a compressed object for saving the character in a file.
     *  @returns {Record<string, any>}
     */
    getSaveCharacter() {
        // Status
        const statusList = [];
        let i, l, status;
        for (i = 0, l = this.status.length; i < l; i++) {
            status = this.status[i];
            statusList[i] = {
                id: status.system.id,
                turn: status.turn,
            };
        }
        return {
            kind: this.kind,
            id: this.id,
            name: this.name,
            instid: this.instid,
            sk: this.skills,
            status: statusList,
            stats: this.getSaveStat(),
            equip: this.getSaveEquip(),
            exp: this.editedExpList,
            class: this.changedClass ? this.changedClass.id : undefined,
            battler: this.battlerID,
            face: this.facesetID,
            faceX: this.facesetIndexX,
            faceY: this.facesetIndexY,
        };
    }
    /**
     *  Get the statistics for save character.
     *  @returns {number[]}
     */
    getSaveStat() {
        const l = Data.BattleSystems.statisticsIDs.length;
        const list = new Array(l);
        let statistic;
        for (let i = 0; i < l; i++) {
            const id = Data.BattleSystems.statisticsIDs[i];
            statistic = Data.BattleSystems.getStatistic(id);
            list[id] = statistic.isFix
                ? [
                    this[statistic.abbreviation],
                    this[statistic.getBonusAbbreviation()],
                    this[statistic.getAddedAbbreviation()],
                ]
                : [
                    this[statistic.abbreviation],
                    this[statistic.getBonusAbbreviation()],
                    this[statistic.getMaxAbbreviation()],
                    this[statistic.getAddedAbbreviation()],
                ];
        }
        return list;
    }
    /**
     *  Get the equips for save character.
     *  @returns {number[][]}
     */
    getSaveEquip() {
        const l = this.equip.length;
        const list = new Array(l);
        for (let i = 1; i < l; i++) {
            if (this.equip[i] !== null) {
                list[i] = [this.equip[i].kind, this.equip[i].system.id, this.equip[i].nb];
            }
        }
        return list;
    }
    /**
     *  Check if the character is dead.
     *  @returns {boolean}
     */
    isDead() {
        return Interpreter.evaluate(Data.BattleSystems.formulaIsDead.getValue(), { user: this });
    }
    /**
     *  Instanciate a character in a particular level.
     *  @param {number} level - The level of the new character
     */
    instanciate(level) {
        // Skills
        this.skills = this.system.getSkills(level, this.changedClass);
        // Begin equipment / elements
        const characteristics = this.system.getCharacteristics(this.changedClass);
        this.elements = [];
        let i, l, characteristic, kind, itemID, item;
        for (i = 0, l = characteristics.length; i < l; i++) {
            characteristic = characteristics[i];
            if (characteristic.kind === CHARACTERISTIC_KIND.BEGIN_EQUIPMENT) {
                kind = characteristic.isBeginWeapon ? ITEM_KIND.WEAPON : ITEM_KIND.ARMOR;
                itemID = characteristic.beginWeaponArmorID.getValue();
                item = Item.findItem(kind, itemID);
                if (item) {
                    item.nb++;
                }
                else {
                    item = new Item(kind, itemID, 0);
                }
                this.equip[characteristic.beginEquipmentID.getValue()] = item;
            }
            else if (characteristic.kind === CHARACTERISTIC_KIND.ELEMENT) {
                this.elements.push(characteristic.elementID);
            }
        }
        // Stats
        const statistics = Data.BattleSystems.statisticsIDs;
        const statisticsProgression = this.system.getStatisticsProgression(this.changedClass);
        const nonFixStatistics = [];
        for (i = 0, l = statistics.length; i < l; i++) {
            this[Data.BattleSystems.getStatistic(statistics[i]).getBeforeAbbreviation()] = undefined;
        }
        let j, m, statistic, statisticProgression;
        for (i = 0, l = statistics.length; i < l; i++) {
            const id = statistics[i];
            statistic = Data.BattleSystems.getStatistic(id);
            // Default value
            this.initStatValue(statistic, 0);
            this[statistic.getBonusAbbreviation()] = 0;
            this[statistic.getAddedAbbreviation()] = 0;
            if (id === Data.BattleSystems.idLevelStatistic) {
                // Level
                this[statistic.abbreviation] = level;
            }
            else if (id === Data.BattleSystems.idExpStatistic) {
                // Experience
                this[statistic.abbreviation] = this.expList[level];
                this[statistic.getMaxAbbreviation()] = this.expList[level + 1];
            }
            else {
                // Other stats
                for (j = 0, m = statisticsProgression.length; j < m; j++) {
                    statisticProgression = statisticsProgression[j];
                    if (statisticProgression.id === id) {
                        if (!statisticProgression.isFix) {
                            nonFixStatistics.push(statisticProgression);
                        }
                        else {
                            this.initStatValue(statistic, statisticProgression.getValueAtLevel(level, this));
                        }
                        break;
                    }
                }
            }
        }
        // Update formulas statistics
        for (i = 0, l = nonFixStatistics.length; i < l; i++) {
            for (j = 0; j < l; j++) {
                statisticProgression = nonFixStatistics[j];
                this.initStatValue(Data.BattleSystems.getStatistic(statisticProgression.id), statisticProgression.getValueAtLevel(level, this));
            }
        }
        this.updateAllStatsValues();
    }
    /**
     *  Get the stats thanks to equipments.
     *  @param {System.CommonSkillItem} item - The System item
     *  @param {number} equipmentID - The equipment ID
     *  @returns {number[][]}
     */
    getEquipmentStatsAndBonus(item, equipmentID) {
        const statistics = Data.BattleSystems.statisticsIDs;
        let l = Data.BattleSystems.maxStatisticID;
        const list = new Array(l + 1);
        const bonus = new Array(l + 1);
        const added = new Array(l + 1);
        const res = {
            statusRes: [],
            experienceGain: [],
            currencyGain: [],
            skillCostRes: [],
        };
        let i;
        for (i = 1; i < l + 1; i++) {
            list[i] = null;
            bonus[i] = null;
            added[i] = null;
        }
        // Equipment
        let j, m, characteristics, statistic;
        for (j = 1, m = this.equip.length; j < m; j++) {
            if (j === equipmentID) {
                if (!item) {
                    continue;
                }
                characteristics = item.characteristics;
            }
            else {
                if (this.equip[j] === null) {
                    continue;
                }
                characteristics = this.equip[j].system.characteristics;
            }
            if (characteristics) {
                this.updateCharacteristics(characteristics, list, bonus, res);
            }
        }
        // Status
        for (j = 0, m = this.status.length; j < m; j++) {
            characteristics = this.status[j].system.characteristics;
            if (characteristics) {
                this.updateCharacteristics(characteristics, list, bonus, res);
            }
        }
        // Class and hero characteristics
        this.updateCharacteristics(this.system.getCharacteristics(this.changedClass), list, bonus, res);
        // Same values for not changed stats and added stats
        let id;
        for (i = 0, l = statistics.length; i < l; i++) {
            id = statistics[i];
            statistic = Data.BattleSystems.getStatistic(id);
            if (list[id] === null) {
                list[id] = this[statistic.getAbbreviationNext()];
            }
            added[id] = this[statistic.getAddedAbbreviation()];
            list[id] += added[id];
        }
        // Update formulas statistics
        const statisticsProgression = this.system.getStatisticsProgression(this.changedClass);
        const previewPlayer = Player.getTemporaryPlayer(list);
        let statisticProgression;
        for (i = 0, l = statisticsProgression.length; i < l; i++) {
            for (j = 0; j < l; j++) {
                statisticProgression = statisticsProgression[j];
                list[statisticProgression.id] =
                    statisticProgression.getValueAtLevel(this.getCurrentLevel(), previewPlayer, this.system.getProperty(Model.Class.PROPERTY_FINAL_LEVEL, this.changedClass)) +
                        bonus[statisticProgression.id] +
                        added[statisticProgression.id];
                previewPlayer.initStatValue(Data.BattleSystems.getStatistic(statisticProgression.id), list[statisticProgression.id]);
            }
        }
        return [list, bonus, res];
    }
    /**
     *  Update stats according to charactersitics.
     *  @param {number[]} characteristics - The characteristics list
     *  @param {number[]} list - The stats list
     *  @param {number[]} bonus - The bonus list
     */
    updateCharacteristics(characteristics, list, bonus, res) {
        let characteristic, statistic, base;
        for (let i = 0, l = characteristics.length; i < l; i++) {
            characteristic = characteristics[i];
            if (characteristic.kind === CHARACTERISTIC_KIND.INCREASE_DECREASE) {
                switch (characteristic.increaseDecreaseKind) {
                    case INCREASE_DECREASE_KIND.STAT_VALUE:
                    case INCREASE_DECREASE_KIND.ELEMENT_RES:
                        const result = characteristic.getNewStatValue(this);
                        if (result !== null) {
                            if (list[result[0]] === null) {
                                statistic = Data.BattleSystems.getStatistic(result[0]);
                                base = this[statistic.getAbbreviationNext()] - this[statistic.getBonusAbbreviation()];
                                list[result[0]] = characteristic.operation ? 0 : base;
                                bonus[result[0]] = characteristic.operation ? -base : 0;
                            }
                            list[result[0]] += result[1];
                            bonus[result[0]] += result[1];
                        }
                        break;
                    default:
                        characteristic.setIncreaseDecreaseValues(res);
                        break;
                }
            }
            else if (characteristic.kind === CHARACTERISTIC_KIND.SCRIPT) {
                characteristic.executeScript(this);
            }
        }
    }
    /**
     *  Update stats with equipment stats
     *  @param {number[]} list - The stats list
     *  @param {number[]} bonus - The bonus list
     */
    updateEquipmentStats(list, bonus, res) {
        if (!list || !bonus || !res) {
            const result = this.getEquipmentStatsAndBonus();
            list = result[0];
            bonus = result[1];
            res = result[2];
        }
        const statistics = Data.BattleSystems.statisticsIDs;
        let statistic, value;
        for (let i = 0, l = statistics.length; i < l; i++) {
            const id = statistics[i];
            statistic = Data.BattleSystems.getStatistic(id);
            value = list[id];
            if (statistic.isFix) {
                this[statistic.abbreviation] = value;
            }
            else {
                this[statistic.getMaxAbbreviation()] = value;
                if (this[statistic.abbreviation] > this[statistic.getMaxAbbreviation()]) {
                    this[statistic.abbreviation] = this[statistic.getMaxAbbreviation()];
                }
            }
            this[statistic.getBonusAbbreviation()] = bonus[id];
        }
        this.statusRes = res.statusRes;
        this.experienceGain = res.experienceGain;
        this.currencyGain = res.currencyGain;
        this.skillCostRes = res.skillCostRes;
    }
    /**
     *  Initialize stat value.
     *  @param {System.Statistic} statistic - The statistic
     *  @param {number} bonus - The value
     */
    initStatValue(statistic, value) {
        this[statistic.abbreviation] = value;
        if (!statistic.isFix) {
            this[statistic.getMaxAbbreviation()] = value;
        }
    }
    /** Update stats value.
     *  @param {System.Statistic} statistic - The statistic
     *  @param {number} bonus - The value
     */
    updateStatValue(statistic, value) {
        const abr = statistic.isFix ? statistic.abbreviation : statistic.getMaxAbbreviation();
        this[statistic.getBeforeAbbreviation()] = this[abr];
        this[abr] = value;
        this[statistic.getBonusAbbreviation()] = 0;
    }
    /**
     *  Update all the stats values.
     */
    updateAllStatsValues() {
        // Fix values : equipment influence etc
        const level = this.getCurrentLevel();
        const statistics = Data.BattleSystems.statisticsIDs;
        const statisticsProgression = this.system.getStatisticsProgression(this.changedClass);
        const nonFixStatistics = [];
        let i, l;
        for (i = 0, l = statistics.length; i < l; i++) {
            this[Data.BattleSystems.getStatistic(statistics[i]).getBeforeAbbreviation()] = undefined;
        }
        let j, m, statistic, statisticProgression;
        for (i = 0, l = statistics.length; i < l; i++) {
            const id = statistics[i];
            statistic = Data.BattleSystems.getStatistic(id);
            if (id !== Data.BattleSystems.idLevelStatistic && id !== Data.BattleSystems.idExpStatistic) {
                for (j = 0, m = statisticsProgression.length; j < m; j++) {
                    statisticProgression = statisticsProgression[j];
                    if (statisticProgression.id === id) {
                        if (!statisticProgression.isFix) {
                            nonFixStatistics.push(statisticProgression);
                        }
                        else {
                            this.updateStatValue(statistic, statisticProgression.getValueAtLevel(level, this));
                        }
                        break;
                    }
                }
            }
        }
        // Update formulas statistics
        for (i = 0, l = nonFixStatistics.length; i < l; i++) {
            for (j = 0; j < l; j++) {
                statisticProgression = nonFixStatistics[j];
                statistic = Data.BattleSystems.getStatistic(statisticProgression.id);
                this.updateStatValue(statistic, statisticProgression.getValueAtLevel(level, this));
            }
        }
        // Update equipment stats + characteristics
        this.statusRes = [];
        this.updateEquipmentStats();
    }
    /**
     *  Get the bar abbreviation.
     *  @param {System.Statistic} stat - The statistic
     *  @returns {string}
     */
    getBarAbbreviation(stat) {
        return this[stat.abbreviation] + ' / ' + this[stat.getMaxAbbreviation()];
    }
    /**
     *  Read the JSON associated to the character and items.
     *  @param {Record<string, any>} - json Json object describing the items
     */
    read(json) {
        // Stats
        const jsonStats = json.stats;
        let i, l, statistic, value;
        for (i = 0, l = Data.BattleSystems.statisticsIDs.length; i < l; i++) {
            const id = Data.BattleSystems.statisticsIDs[i];
            statistic = Data.BattleSystems.getStatistic(id);
            value = jsonStats[id];
            if (value) {
                this[statistic.abbreviation] = value[0];
                this[statistic.getBonusAbbreviation()] = value[1];
                if (!statistic.isFix) {
                    this[statistic.getMaxAbbreviation()] = value[2];
                    this[statistic.getAddedAbbreviation()] = value[3];
                }
                else {
                    this[statistic.getAddedAbbreviation()] = value[2];
                }
            }
        }
        // Equip
        l = Data.BattleSystems.maxEquipmentID;
        this.equip = new Array(l + 1);
        let equip, item;
        for (i = 1; i <= l; i++) {
            equip = json.equip[i];
            if (equip) {
                item = Item.findItem(equip[0], equip[1]);
                if (item === null) {
                    item = new Item(equip[0], equip[1], equip[2]);
                }
            }
            else {
                item = null;
            }
            this.equip[i] = item;
        }
        // Exp list
        this.changedClass = json.class ? Data.Classes.get(json.class) : undefined;
        this.expList = this.system.createExpList(this.changedClass);
        for (const i in json.exp) {
            this.expList[i] = json.exp[i];
        }
        // Faceset and battler
        this.facesetID = Utils.valueOrDefault(json.face, null);
        this.facesetIndexX = Utils.valueOrDefault(json.faceX, null);
        this.facesetIndexY = Utils.valueOrDefault(json.faceY, null);
        this.battlerID = Utils.valueOrDefault(json.battler, null);
        this.updateAllStatsValues();
    }
    /**
     *  Get the current level.
     *  @returns {number}
     */
    getCurrentLevel() {
        return this[Data.BattleSystems.getLevelStatistic().abbreviation];
    }
    /**
     *  Apply level up.
     */
    levelUp() {
        // Change lvl stat
        this[Data.BattleSystems.getLevelStatistic().abbreviation]++;
        // Update statistics
        this.updateAllStatsValues();
        // Update skills learned
        this.learnSkills();
    }
    /**
     *  Learn new skills (on level up).
     */
    learnSkills() {
        const newSkills = this.system.getLearnedSkills(this[Data.BattleSystems.getLevelStatistic().abbreviation], this.changedClass);
        // If already added, remove
        for (const skill of newSkills) {
            this.removeSkill(skill.id);
        }
        this.skills = this.skills.concat(newSkills);
    }
    /**
     *  Get the experience reward.
     *  @returns {number}
     */
    getRewardExperience() {
        return this.system.getRewardExperience(this.getCurrentLevel());
    }
    /**
     *  Get the currencies reward.
     *  @returns {Record<string, any>}
     */
    getRewardCurrencies() {
        return this.system.getRewardCurrencies(this.getCurrentLevel());
    }
    /**
     *  Get the loots reward.
     *  @returns {Record<string, Item>[]}
     */
    getRewardLoots() {
        return this.system.getRewardLoots(this.getCurrentLevel());
    }
    /**
     *  Update remaining xp according to full time.
     *  @param {number} fullTime - Full time in milliseconds
     */
    updateRemainingXP(fullTime) {
        if (this.getCurrentLevel() < this.expList.length - 1) {
            const current = this[Data.BattleSystems.getExpStatistic().abbreviation];
            const max = this[Data.BattleSystems.getExpStatistic().getMaxAbbreviation()];
            const xpForLvl = max - current;
            const dif = this.totalRemainingXP - xpForLvl;
            this.remainingXP = dif > 0 ? xpForLvl : this.totalRemainingXP;
            this.totalRemainingXP -= this.remainingXP;
            this.totalTimeXP = Math.floor((this.remainingXP / (max - this.expList[this.getCurrentLevel()])) * fullTime);
        }
        else {
            this.remainingXP = 0;
            this.totalRemainingXP = 0;
            this.totalTimeXP = 0;
        }
        this.timeXP = new Date().getTime();
        this.obtainedXP = 0;
    }
    /**
     *  Update obtained experience.
     */
    updateObtainedExperience() {
        const xpAbbreviation = Data.BattleSystems.getExpStatistic().abbreviation;
        const tick = new Date().getTime() - this.timeXP;
        if (tick >= this.totalTimeXP) {
            this[xpAbbreviation] = this[xpAbbreviation] + this.remainingXP - this.obtainedXP;
            this.remainingXP = 0;
            this.obtainedXP = 0;
        }
        else {
            const xp = Math.floor((tick / this.totalTimeXP) * this.remainingXP) - this.obtainedXP;
            this.obtainedXP += xp;
            this[xpAbbreviation] += xp;
        }
        this.testedLevelUp = false;
    }
    /**
     *  Update experience and check if leveling up.
     *  @returns {boolean}
     */
    updateExperience() {
        const xpAbbreviation = Data.BattleSystems.getExpStatistic().abbreviation;
        const maxXPAbbreviation = Data.BattleSystems.getExpStatistic().getMaxAbbreviation();
        const maxXP = this[maxXPAbbreviation];
        this.updateObtainedExperience();
        this.testedLevelUp = true;
        const dif = this[xpAbbreviation] - maxXP;
        if (dif >= 0) {
            const newMaxXP = this.expList[this.getCurrentLevel() + 2];
            let leveledUp = false;
            if (newMaxXP) {
                // Go to next level
                this[maxXPAbbreviation] = newMaxXP;
                this.levelUp();
                leveledUp = true;
            }
            else if (this.getCurrentLevel() < this.expList.length - 1) {
                this.levelUp();
                leveledUp = true;
            }
            this[xpAbbreviation] = maxXP;
            this.remainingXP = 0;
            this.obtainedXP = 0;
            return leveledUp;
        }
        return false;
    }
    /**
     *  Pass the progressive experience and directly update experience.
     */
    passExperience() {
        this.timeXP = this.totalTimeXP;
    }
    /**
     *  Pause experience (when leveling up).
     */
    pauseExperience() {
        this.totalTimeXP -= new Date().getTime() - this.timeXP;
        this.remainingXP -= this.obtainedXP;
        this.obtainedXP = 0;
    }
    /**
     *  Unpause experience.
     */
    unpauseExperience() {
        this.timeXP = new Date().getTime();
    }
    /**
     *  Check if experience is updated.
     *  @returns {boolean}
     */
    isExperienceUpdated() {
        return this.testedLevelUp && this.totalRemainingXP === 0 && this.remainingXP === 0;
    }
    /**
     *  Synchronize experience if level was manually updated with a command.
     */
    synchronizeExperience() {
        const statistic = Data.BattleSystems.getExpStatistic();
        const level = this.getCurrentLevel();
        this[statistic.abbreviation] = this.expList[level];
        this[statistic.getMaxAbbreviation()] = this.expList[level + 1];
    }
    /**
     *  Synchronize level if experience was manually updated with a command.
     */
    synchronizeLevel() {
        const expStatistic = Data.BattleSystems.getExpStatistic();
        const exp = this[expStatistic.abbreviation];
        let finalLevel = this.expList.length - 1;
        for (; finalLevel >= 1; finalLevel--) {
            if (exp >= this.expList[finalLevel]) {
                break;
            }
        }
        this[expStatistic.getMaxAbbreviation()] = this.expList[finalLevel + 1];
        while (this.getCurrentLevel() < finalLevel) {
            this.levelUp();
        }
    }
    /**
     *  Check if player has status with ID.
     *  @param {number} id
     *  @returns {boolean}
     */
    hasStatus(id) {
        for (const status of this.status) {
            if (status.id === id) {
                return true;
            }
        }
        return false;
    }
    /**
     *  Get the first status to display according to priority.
     *  @returns {Core.Status[]}
     */
    getFirstStatus() {
        const statusList = [];
        let status;
        for (let c = 0, i = 0; i < Player.MAX_STATUS_DISPLAY_TOP; i++) {
            status = this.status[i];
            if (status) {
                if (status.system.pictureID !== -1) {
                    c++;
                    statusList.push(status);
                }
            }
            else {
                break;
            }
        }
        return statusList;
    }
    /**
     *  Add a new status and check if already in.
     *  @param {number} id - The status id to add
     *  @returns {Core.Status}
     */
    addStatus(id) {
        const status = new Status(id);
        const priority = status.system.priority.getValue();
        let i, s, p;
        for (i = this.status.length - 1; i >= 0; i--) {
            s = this.status[i];
            // If same id, don't add
            if (s.system.id === id) {
                return null;
            }
        }
        for (i = this.status.length - 1; i >= 0; i--) {
            // Add according to priority
            p = s.system.priority.getValue();
            if (p <= priority) {
                break;
            }
        }
        this.status.splice(i < 0 ? 0 : 0, 0, status);
        this.updateAllStatsValues();
        return status;
    }
    /**
     *  Remove the status.
     *  @param {number} id - The status id to remove
     *  @returns {Core.Status}
     */
    removeStatus(id) {
        let i, s;
        for (i = this.status.length - 1; i >= 0; i--) {
            s = this.status[i];
            // If same id, remove
            if (s.system.id === id) {
                this.status.splice(i, 1);
                this.updateAllStatsValues();
                return s;
            }
        }
        return null;
    }
    /**
     *  Remove the status with release at end battle option.
     */
    removeEndBattleStatus() {
        let test = false;
        let s;
        for (let i = this.status.length - 1; i >= 0; i--) {
            s = this.status[i];
            if (s.system.isReleaseAtEndBattle) {
                this.status.splice(i, 1);
                test = true;
            }
        }
        // If at least one removed, update stats
        if (test) {
            this.updateAllStatsValues();
        }
    }
    /**
     *  Remove the status with release after attacked option.
     */
    removeAfterAttackedStatus(battler) {
        let test = false;
        let s;
        for (let i = this.status.length - 1; i >= 0; i--) {
            s = this.status[i];
            if (s.system.isReleaseAfterAttacked &&
                Mathf.randomPercentTest(s.system.chanceReleaseAfterAttacked.getValue())) {
                s = this.status[0];
                this.status.splice(i, 1);
                battler.updateStatusStep();
                battler.updateAnimationStatus(s);
                test = true;
            }
        }
        if (test) {
            this.updateAllStatsValues();
        }
    }
    /**
     *  Remove the status with release at start turn option.
     */
    removeStartTurnStatus(listStill) {
        const listHealed = [];
        let test = false;
        let j, m, s, release, testRelease;
        for (let i = this.status.length - 1; i >= 0; i--) {
            s = this.status[i];
            testRelease = false;
            if (s.system.isReleaseStartTurn) {
                testRelease = false;
                for (j = 0, m = s.system.releaseStartTurn.length; j < m; j++) {
                    release = s.system.releaseStartTurn[j];
                    if (Mathf.OPERATORS_COMPARE[release.operationTurnKind](s.turn, release.turn.getValue()) &&
                        Mathf.randomPercentTest(release.chance.getValue())) {
                        this.status.splice(i, 1);
                        listHealed.push(s);
                        test = true;
                        testRelease = true;
                        break;
                    }
                }
            }
            if (!testRelease) {
                listStill.push(s);
            }
        }
        if (test) {
            this.updateAllStatsValues();
        }
        return listHealed;
    }
    /**
     *  Update each status turn.
     */
    updateStatusTurn() {
        for (let i = this.status.length - 1; i >= 0; i--) {
            this.status[i].turn++;
        }
    }
    /**
     *  Get the best weapon armor to replace for shops.
     *  @param {System.CommonSkillItem}
     *  @returns {[number, number, number[][]]}
     */
    getBestWeaponArmorToReplace(weaponArmor) {
        const equipments = weaponArmor.getType().equipments;
        const baseResult = this.getEquipmentStatsAndBonus();
        let baseBonus = 0;
        let id;
        for (id in baseResult[1]) {
            baseBonus += baseResult[1][id] === null ? 0 : baseResult[1][id];
        }
        let totalBonus = 0, bestResult, result, bestBonus, bestEquipmentID;
        for (let equipmentID = equipments.length - 1; equipmentID >= 1; equipmentID--) {
            if (equipments[equipmentID]) {
                result = this.getEquipmentStatsAndBonus(weaponArmor, equipmentID);
                totalBonus = 0;
                for (id in baseResult[1]) {
                    totalBonus += result[1][id] === null ? 0 : result[1][id];
                }
                if (bestBonus === undefined || bestBonus < totalBonus) {
                    bestBonus = totalBonus;
                    bestResult = result;
                    bestEquipmentID = equipmentID;
                }
            }
        }
        return [bestBonus - baseBonus, bestEquipmentID, bestResult];
    }
    /**
     *  Add a skill id if not existing yet.
     *  @param {number} id
     */
    addSkill(id) {
        const index = Utils.indexOfProp(this.skills, 'id', id);
        if (index === -1) {
            this.skills.push(new Skill(id));
        }
    }
    /**
     *  Remove a skill id if existing.
     *  @param {number} id
     */
    removeSkill(id) {
        const index = Utils.indexOfProp(this.skills, 'id', id);
        if (index !== -1) {
            this.skills.splice(index, 1);
        }
    }
    /**
     *  Get characteristics.
     *  @returns {System.Characteristic[]}
     */
    getCharacteristics() {
        let characteristics = this.system.getCharacteristics(this.changedClass);
        // Also add weapons and armors
        for (const equipment of this.equip) {
            if (equipment) {
                characteristics = characteristics.concat(equipment.system.characteristics);
            }
        }
        return characteristics;
    }
    /**
     *  Get player class (depends on if it was changed).
     *  @returns {System.Characteristic[]}
     */
    getClass() {
        return Utils.valueOrDefault(this.changedClass, this.system.class);
    }
    /**
     *  Update the elements list according to characteristics.
     */
    updateElements() {
        this.elements = [];
        const characteristics = this.system.getCharacteristics(this.changedClass);
        for (const characteristic of characteristics) {
            if (characteristic.kind === CHARACTERISTIC_KIND.ELEMENT) {
                this.elements.push(characteristic.elementID);
            }
        }
    }
    /**
     *  Get battler ID from system, or another if modified with change graphics.
     *  @returns {number}
     */
    getBattlerID() {
        return this.battlerID === null ? this.system.idBattler : this.battlerID;
    }
    /**
     *  Get faceset ID from system, or another if modified with change graphics.
     *  @returns {number}
     */
    getFacesetID() {
        return this.facesetID === null ? this.system.idFaceset : this.facesetID;
    }
    /**
     *  Get faceset index x from system, or another if modified with change graphics.
     *  @returns {number}
     */
    getFacesetIndexX() {
        return this.facesetIndexX === null ? this.system.indexXFaceset : this.facesetIndexX;
    }
    /**
     *  Get faceset index y from system, or another if modified with change graphics.
     *  @returns {number}
     */
    getFacesetIndexY() {
        return this.facesetIndexY === null ? this.system.indexYFaceset : this.facesetIndexY;
    }
    /**
     *  Check if player can equip this weapon or armor.
     *  @param {Core.Item} weaponArmor
     *  @returns {boolean}
     */
    canEquipWeaponArmor(weaponArmor) {
        const characteristics = this.getCharacteristics();
        for (const characteristic of characteristics) {
            if (characteristic.kind === CHARACTERISTIC_KIND.ALLOW_FORBID_CHANGE &&
                ((weaponArmor.kind === ITEM_KIND.WEAPON &&
                    characteristic.isAllowEquipWeapon &&
                    weaponArmor.system.type === characteristic.equipWeaponTypeID.getValue()) ||
                    (weaponArmor.kind === ITEM_KIND.ARMOR &&
                        !characteristic.isAllowEquipWeapon &&
                        weaponArmor.system.type === characteristic.equipArmorTypeID.getValue())) &&
                !characteristic.isAllowEquip) {
                return false;
            }
            if (characteristic.kind === CHARACTERISTIC_KIND.ALLOW_FORBID_CHANGE &&
                !characteristic.isAllowChangeEquipment) {
                const type = weaponArmor.kind === ITEM_KIND.WEAPON
                    ? Data.BattleSystems.getWeaponKind(weaponArmor.system.type)
                    : Data.BattleSystems.getArmorKind(weaponArmor.system.type);
                if (type.equipments[characteristic.changeEquipmentID.getValue()]) {
                    return false;
                }
            }
        }
        return true;
    }
}
Player.MAX_STATUS_DISPLAY_TOP = 3;
export { Player };
