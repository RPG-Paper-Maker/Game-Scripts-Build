/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Model, Scene } from "../index.js";
import { Utils } from '../Common/index.js';
import { Game } from '../Core/index.js';
import { Base } from './Base.js';
/** @class
 *  An event command for switching texture.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class SwitchTexture extends Base {
    constructor(command) {
        super();
        const iterator = {
            i: 0,
        };
        this.isTilesetID = Utils.numberToBool(command[iterator.i++]);
        if (this.isTilesetID) {
            this.tilesetID = Model.DynamicValue.createValueCommand(command, iterator);
            this.tilesetPictureID = Model.DynamicValue.createValueCommand(command, iterator);
            iterator.i++;
        }
        this.isAutotileID = Utils.numberToBool(command[iterator.i++]);
        if (this.isAutotileID) {
            this.autotileID = Model.DynamicValue.createValueCommand(command, iterator);
            this.autotilePictureID = Model.DynamicValue.createValueCommand(command, iterator);
            iterator.i++;
        }
        this.isWallID = Utils.numberToBool(command[iterator.i++]);
        if (this.isWallID) {
            this.wallID = Model.DynamicValue.createValueCommand(command, iterator);
            this.wallPictureID = Model.DynamicValue.createValueCommand(command, iterator);
            iterator.i++;
        }
        this.isObject3DID = Utils.numberToBool(command[iterator.i++]);
        if (this.isObject3DID) {
            this.object3DID = Model.DynamicValue.createValueCommand(command, iterator);
            this.object3DPictureID = Model.DynamicValue.createValueCommand(command, iterator);
            iterator.i++;
        }
        this.isMountainID = Utils.numberToBool(command[iterator.i++]);
        if (this.isMountainID) {
            this.mountainID = Model.DynamicValue.createValueCommand(command, iterator);
            this.mountainPictureID = Model.DynamicValue.createValueCommand(command, iterator);
            iterator.i++;
        }
    }
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize() {
        return {
            loading: false,
            loaded: false,
        };
    }
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
     */
    update(currentState, object, state) {
        if (!currentState.loading) {
            currentState.loading = true;
            if (this.isTilesetID) {
                Game.current.textures.tilesets[this.tilesetID.getValue()] =
                    this.tilesetPictureID.getValue();
            }
            if (this.isAutotileID) {
                Game.current.textures.autotiles[this.autotileID.getValue()] =
                    this.autotilePictureID.getValue();
            }
            if (this.isWallID) {
                Game.current.textures.walls[this.wallID.getValue()] = this.wallPictureID.getValue();
            }
            if (this.isObject3DID) {
                Game.current.textures.objects3D[this.object3DID.getValue()] =
                    this.object3DPictureID.getValue();
            }
            if (this.isMountainID) {
                Game.current.textures.mountains[this.mountainID.getValue()] =
                    this.mountainPictureID.getValue();
            }
            //Scene.Map.current.close();
            Scene.Map.current.loading = true;
            (async () => {
                await Scene.Map.current.reloadTextures();
                currentState.loaded = true;
            })();
        }
        return currentState.loaded ? 1 : 0;
    }
}
export { SwitchTexture };
