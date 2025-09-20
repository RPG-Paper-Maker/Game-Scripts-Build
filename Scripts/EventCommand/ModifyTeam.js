/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { CHARACTER_KIND } from '../Common/index.js';
import { Game } from '../Core/index.js';
import { Model, Scene } from '../index.js';
import { Base } from './Base.js';
/** @class
 *  An event command for modifying team.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class ModifyTeam extends Base {
    constructor(command) {
        super();
        const iterator = {
            i: 0,
        };
        this.kind = command[iterator.i++];
        switch (this.kind) {
            case 0: // Create new instance
                this.instanceLevel = Model.DynamicValue.createValueCommand(command, iterator);
                this.instanceTeam = command[iterator.i++];
                this.stockVariableID = Model.DynamicValue.createValueCommand(command, iterator);
                this.instanceKind = command[iterator.i++];
                this.instanceID = Model.DynamicValue.createValueCommand(command, iterator);
                break;
            case 1: // Add enemy
                this.enemyInstanceID = Model.DynamicValue.createValueCommand(command, iterator);
                this.enemyTeam = command[iterator.i++];
                break;
            case 2: // Modify (move/remove)
                this.modifyKind = command[iterator.i++];
                this.modifyInstanceID = Model.DynamicValue.createValueCommand(command, iterator);
                this.modifyTeam = command[iterator.i++];
                break;
        }
    }
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
     */
    update(currentState, object, state) {
        switch (this.kind) {
            case 0: // Create new instance
                Game.current.instanciateTeam(this.instanceTeam, this.instanceKind, this.instanceID.getValue(), this.instanceLevel.getValue(), this.stockVariableID.getValue(true));
                break;
            case 1: {
                // Add enemy
                if (!Scene.Map.current.isBattleMap) {
                    return;
                }
                const id = this.enemyInstanceID.getValue();
                let player = null;
                for (const battler of Scene.Map.current.battlers[CHARACTER_KIND.MONSTER]) {
                    if (battler.player.instid === id) {
                        player = battler.player;
                        break;
                    }
                }
                if (player !== null) {
                    player.kind = CHARACTER_KIND.HERO;
                    Game.current.getTeam(this.enemyTeam).push(player);
                }
                break;
            }
            case 2: {
                // Modify (move/remove)
                const groups = Game.current.getGroups();
                let selectedGroup = null;
                const id = this.modifyInstanceID.getValue();
                let player;
                // Find group and player associated to instance ID
                for (const group of groups) {
                    for (player of group) {
                        if (player.instid === id) {
                            selectedGroup = group;
                            break;
                        }
                    }
                    if (selectedGroup !== null) {
                        break;
                    }
                }
                if (selectedGroup !== null) {
                    selectedGroup.splice(selectedGroup.indexOf(player), 1);
                    if (this.modifyKind === 0) {
                        // If moving
                        groups[this.modifyTeam].push(player);
                    }
                }
                break;
            }
        }
        return 1;
    }
}
export { ModifyTeam };
