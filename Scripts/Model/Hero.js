/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Utils } from '../Common/index.js';
import { Data } from '../index.js';
import { Class } from './Class.js';
import { Localization } from './Localization.js';
/**
 * A hero of the game.
 */
export class Hero extends Localization {
    constructor(json) {
        super(json);
    }
    /**
     * Check if this hero is a monster.
     */
    isMonster() {
        return false;
    }
    /**
     * Get a property from class (or changedClass) considering inheritance.
     */
    getProperty(prop, changedClass) {
        return (changedClass ?? this.class).getProperty(prop, this.classInherit);
    }
    /**
     * Get the experience table.
     */
    getExperienceTable(changedClass) {
        return (changedClass ?? this.class).getExperienceTable(this.classInherit);
    }
    /**
     * Get the characteristics.
     */
    getCharacteristics(changedClass) {
        return (changedClass ?? this.class).getCharacteristics(this.classInherit);
    }
    /**
     * Get the statistics progression.
     */
    getStatisticsProgression(changedClass) {
        return (changedClass ?? this.class).getStatisticsProgression(this.classInherit);
    }
    /**
     * Get the skills available at a given level.
     */
    getSkills(level, changedClass) {
        return (changedClass ?? this.class).getSkills(this.classInherit, level);
    }
    /**
     * Get the learned skills at a given level.
     */
    getLearnedSkills(level, changedClass) {
        return (changedClass ?? this.class).getLearnedSkills(this.classInherit, level);
    }
    /**
     * Create the experience list according to base and inflation.
     */
    createExpList(changedClass) {
        const finalLevel = this.getProperty(Class.PROPERTY_FINAL_LEVEL, changedClass);
        const experienceBase = this.getProperty(Class.PROPERTY_EXPERIENCE_BASE, changedClass);
        const experienceInflation = this.getProperty(Class.PROPERTY_EXPERIENCE_INFLATION, changedClass);
        const experienceTable = this.getExperienceTable(changedClass);
        const expList = new Array(finalLevel + 1);
        const pow = 2.4 + experienceInflation / 100;
        expList[1] = 0;
        for (let i = 2; i <= finalLevel; i++) {
            expList[i] =
                expList[i - 1] +
                    (experienceTable[i - 1]
                        ? experienceTable[i - 1]
                        : Math.floor(experienceBase * (Math.pow(i + 3, pow) / Math.pow(5, pow))));
        }
        return expList;
    }
    /**
     * Read the JSON associated to the hero.
     */
    read(json) {
        super.read(json);
        this.class = Data.Classes.get(json.class, `Could not find the class in ${this.isMonster() ? 'monster' : 'hero'} ${Utils.getIDName(json.id, this.name())}, please check your Data manager and add a correct class.`);
        this.idBattler = Utils.valueOrDefault(json.bid, -1);
        this.idFaceset = Utils.valueOrDefault(json.fid, -1);
        this.indexXFaceset = Utils.valueOrDefault(json.indexXFaceset, 0);
        this.indexYFaceset = Utils.valueOrDefault(json.indexYFaceset, 0);
        this.classInherit = new Class(json.ci);
        this.description = new Localization(json.description);
    }
}
