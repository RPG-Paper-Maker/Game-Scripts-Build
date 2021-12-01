import { SaveLoadGame } from "./SaveLoadGame.js";
import { WindowBox, WindowChoices } from "../Core/index.js";
/** @class
 *  A scene in the menu for saving a game.
 *  @extends Scene.SaveLoadGame
 */
declare class SaveGame extends SaveLoadGame {
    windowBoxConfirm: WindowBox;
    windowChoicesConfirm: WindowChoices;
    step: number;
    constructor();
    /**
     *  Create scene.
     */
    create(): void;
    /**
     *  Create all the windows in the scene.
     */
    createAllWindows(): void;
    /**
     *  Create the window confirmation.
     */
    createWindowBoxConfirm(): void;
    /**
     *  Create the window information on top.
     */
    createWindowChoicesConfirm(): void;
    /**
     *  Load async stuff.
     *  @async
     */
    load(): Promise<void>;
    /**
     *  Save current game in the selected slot.
     */
    save(): Promise<void>;
    /**
     *  Slot action.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    action(isKey: boolean, options?: {
        key?: number;
        x?: number;
        y?: number;
    }): void;
    /**
     *  Slot move.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    move(isKey: boolean, options?: {
        key?: number;
        x?: number;
        y?: number;
    }): void;
    /**
     *  Handle scene key pressed.
     *   @param {number} key - The key ID
     */
    onKeyPressed(key: number): void;
    /**
     *  @inheritdoc
     */
    onMouseUp(x: number, y: number): void;
    /**
     *  Draw the HUD scene
     */
    drawHUD(): void;
}
export { SaveGame };
