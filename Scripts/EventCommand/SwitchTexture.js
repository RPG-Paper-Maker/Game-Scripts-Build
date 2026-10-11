/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Data, Model, Scene } from "../index.js";
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
            let changed = false;
            const switchPicture = (textures, id, pictureID, defaultPictureID) => {
                if ((textures[id] ?? defaultPictureID) !== pictureID) {
                    changed = true;
                }
                textures[id] = pictureID;
            };
            if (this.isTilesetID) {
                const id = this.tilesetID.getValue();
                switchPicture(Game.current.textures.tilesets, id, this.tilesetPictureID.getValue(), Data.Tilesets.get(id)?.picture?.id);
            }
            if (this.isAutotileID) {
                const id = this.autotileID.getValue();
                switchPicture(Game.current.textures.autotiles, id, this.autotilePictureID.getValue(), Data.SpecialElements.getAutotile(id)?.pictureID);
            }
            if (this.isWallID) {
                const id = this.wallID.getValue();
                switchPicture(Game.current.textures.walls, id, this.wallPictureID.getValue(), Data.SpecialElements.getWall(id)?.pictureID);
            }
            if (this.isObject3DID) {
                const id = this.object3DID.getValue();
                switchPicture(Game.current.textures.objects3D, id, this.object3DPictureID.getValue(), Data.SpecialElements.getObject3D(id)?.pictureID);
            }
            if (this.isMountainID) {
                const id = this.mountainID.getValue();
                switchPicture(Game.current.textures.mountains, id, this.mountainPictureID.getValue(), Data.SpecialElements.getMountain(id)?.pictureID);
            }
            if (changed) {
                Scene.Map.current.loading = true;
                (async () => {
                    await Scene.Map.current.reloadTextures();
                    currentState.loaded = true;
                })();
            }
            else {
                currentState.loaded = true;
            }
        }
        return currentState.loaded ? 1 : 0;
    }
}
export { SwitchTexture };
