/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { ITEM_KIND } from '../Common/index.js';
import { Data } from '../index.js';
import { CommonSkillItem } from './CommonSkillItem.js';
/**
 * Represents an armor item in the game.
 */
export class Armor extends CommonSkillItem {
    /**
     * Gets the armor type (as defined in battle system data).
     * @returns The corresponding {@link WeaponArmorKind}.
     */
    getType() {
        return Data.BattleSystems.getArmorKind(this.type);
    }
    /**
     * Gets the item kind for this armor.
     * @returns {@link ITEM_KIND.ARMOR}.
     */
    getKind() {
        return ITEM_KIND.ARMOR;
    }
}
