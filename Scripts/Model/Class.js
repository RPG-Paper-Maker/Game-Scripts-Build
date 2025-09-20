/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Utils } from '../Common/index.js';
import { Skill } from '../Core/index.js';
import { Characteristic } from './Characteristic.js';
import { ClassSkill } from './ClassSkill.js';
import { Localization } from './Localization.js';
import { StatisticProgression } from './StatisticProgression.js';
/**
 *  Represents a class (job) of a hero in the game.
 */
export class Class extends Localization {
    constructor(json) {
        super(json);
    }
    /** Get a property, prioritizing the upClass value if defined. */
    getProperty(prop, upClass) {
        return upClass[prop] === -1 ? this[prop] : upClass[prop];
    }
    /** Merge the experience table with an upClass. */
    getExperienceTable(upClass) {
        return { ...this.experienceTable, ...upClass.experienceTable };
    }
    /** Combine characteristics with those of an upClass. */
    getCharacteristics(upClass) {
        return this.characteristics.concat(upClass.characteristics);
    }
    /** Combine statistics progression with those of an upClass, replacing duplicates by ID. */
    getStatisticsProgression(upClass) {
        const list = [...this.statisticsProgression];
        for (const upStat of upClass.statisticsProgression) {
            const index = list.findIndex((s) => s.id === upStat.id);
            if (index !== -1) {
                list[index] = upStat;
            }
            else {
                list.push(upStat);
            }
        }
        return list;
    }
    /** Get all skills up to a certain level. */
    getSkills(upClass, level) {
        return this.getSkillsWithoutDuplicate(upClass)
            .filter((s) => s.level <= level)
            .map((s) => new Skill(s.id));
    }
    /** Get skills learned exactly at a specific level. */
    getLearnedSkills(upClass, level) {
        return this.getSkillsWithoutDuplicate(upClass)
            .filter((s) => s.level === level)
            .map((s) => new Skill(s.id));
    }
    /** Merge skills with an upClass, replacing duplicates by ID. */
    getSkillsWithoutDuplicate(upClass) {
        const skills = [...this.skills];
        for (const upSkill of upClass.skills) {
            const index = skills.findIndex((s) => s.id === upSkill.id);
            if (index !== -1) {
                skills[index] = upSkill;
            }
            else {
                skills.push(upSkill);
            }
        }
        return skills;
    }
    /** Read the JSON data for the class. */
    read(json) {
        super.read(json);
        this.id = json.id;
        this.initialLevel = Utils.valueOrDefault(json.iniL, -1);
        this.finalLevel = Utils.valueOrDefault(json.mxL, -1);
        this.experienceBase = Utils.valueOrDefault(json.eB, -1);
        this.experienceInflation = Utils.valueOrDefault(json.eI, -1);
        this.experienceTable = {};
        if (json.eT) {
            for (const entry of json.eT) {
                this.experienceTable[entry.k] = entry.v;
            }
        }
        this.characteristics = Utils.readJSONList(json.characteristics, Characteristic);
        this.statisticsProgression = Utils.readJSONList(json.stats, StatisticProgression);
        this.skills = Utils.readJSONList(json.skills, ClassSkill);
    }
}
Class.PROPERTY_FINAL_LEVEL = 'finalLevel';
Class.PROPERTY_EXPERIENCE_BASE = 'experienceBase';
Class.PROPERTY_EXPERIENCE_INFLATION = 'experienceInflation';
