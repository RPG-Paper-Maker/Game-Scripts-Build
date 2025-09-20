/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Localization } from './Localization.js';
/**
 * A weapon/armor kind in the game.
 */
export class WeaponArmorKind extends Localization {
    constructor(json) {
        super(json);
    }
    /**
     * Read JSON into this weapon/armor kind.
     */
    read(json) {
        super.read(json);
        this.equipments = json.equipment;
        this.equipments.unshift(false);
    }
}
