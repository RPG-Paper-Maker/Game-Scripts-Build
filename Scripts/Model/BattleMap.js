/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Position } from '../Core/index.js';
import { Base } from './Base.js';
/**
 * Represents a battle map in the game.
 * A battle map stores the map ID and a position where the battle takes place.
 */
export class BattleMap extends Base {
    constructor(json) {
        super(json);
    }
    /**
     * Creates a new {@link BattleMap} instance.
     * @param idMap - The map ID.
     * @param position - The battle start position.
     * @returns A new battle map instance.
     */
    static create(idMap, position) {
        const map = new BattleMap();
        map.idMap = idMap;
        map.position = position;
        return map;
    }
    /**
     * Reads the JSON data describing the battle map.
     */
    read(json) {
        this.idMap = json.idm;
        this.position = Position.createFromArray(json.p);
    }
}
