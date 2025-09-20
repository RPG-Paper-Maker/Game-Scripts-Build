/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Utils } from '../Common/index.js';
import { Class } from './Class.js';
import { Hero } from './Hero.js';
import { Loot } from './Loot.js';
import { MonsterAction } from './MonsterAction.js';
import { ProgressionTable } from './ProgressionTable.js';
/**
 * Represents a monster of the game.
 */
export class Monster extends Hero {
    constructor(json) {
        super(json);
    }
    /**
     * Check if this hero is a monster.
     */
    isMonster() {
        return true;
    }
    /**
     * Get the experience reward at a given level.
     */
    getRewardExperience(level) {
        return this.rewards.xp.getProgressionAt(level, this.getProperty(Class.PROPERTY_FINAL_LEVEL));
    }
    /**
     * Get the currencies reward at a given level.
     */
    getRewardCurrencies(level) {
        const currencies = new Map();
        for (const progression of this.rewards.currencies) {
            currencies.set(progression.id, progression.getProgressionAt(level, this.getProperty(Class.PROPERTY_FINAL_LEVEL, undefined)));
        }
        return currencies;
    }
    /**
     * Get the loots reward at a given level.
     */
    getRewardLoots(level) {
        const list = [new Map(), new Map(), new Map()];
        for (const loot of this.rewards.loots) {
            const item = loot.currentLoot(level);
            if (item !== null) {
                const loots = list[item.kind];
                const existingLoot = loots.get(item.system.id);
                if (existingLoot) {
                    existingLoot.nb += item.nb;
                }
                else {
                    loots.set(item.system.id, item);
                }
            }
        }
        return list;
    }
    /**
     * Initialize this monster from JSON data.
     */
    read(json) {
        super.read(json);
        this.rewards = {};
        // Experience
        this.rewards.xp = new ProgressionTable(this.getProperty(Class.PROPERTY_FINAL_LEVEL), json.xp);
        // Currencies
        this.rewards.currencies = json.cur.map((hash) => new ProgressionTable(hash.k, hash.v));
        // Loots
        this.rewards.loots = Utils.readJSONList(json.loots, Loot);
        // Actions
        this.actions = Utils.readJSONList(json.a, (jsonAction) => {
            const action = new MonsterAction(jsonAction);
            action.monster = this;
            return action;
        });
    }
}
