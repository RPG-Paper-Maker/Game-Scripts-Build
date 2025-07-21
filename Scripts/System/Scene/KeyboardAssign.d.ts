import { Picture2D, WindowBox, WindowChoices } from '../Core/index.js';
import { Base } from './Base.js';
/** @class
 *  A scene for the keyboard assign setting.
 *  @extends Scene.Base
 */
declare class KeyboardAssign extends Base {
    static WINDOW_PRESS_WIDTH: number;
    static WINDOW_PRESS_HEIGHT: number;
    static MAX_WAIT_TIME_FIRST: number;
    static MAX_WAIT_TIME: number;
    pictureBackground: Picture2D;
    windowKeyboard: WindowBox;
    windowInformations: WindowBox;
    windowChoicesMain: WindowChoices;
    windowPress: WindowBox;
    showPress: boolean;
    currentSC: string[][];
    keysPressed: string[];
    compareWait: number;
    waitTime: number;
    originalSC: string[][];
    nextOR: boolean;
    constructor();
    /**
     *  Load async stuff.
     */
    load(): Promise<void>;
    /**
     *  Update the key.
     */
    updateKey(): boolean;
    /**
     *  Cancel the scene.
     */
    cancel(): void;
    /**
     *  Move keyboard assign.
     */
    move(): void;
    /**
     *  Update the scene.
     */
    update(): void;
    /**
     *  Handle scene key pressed.
     *  @param {number} key - The key ID
     */
    onKeyPressed(key: string): void;
    /**
     *  Handle scene key released.
     *  @param {number} key - The key ID
     */
    onKeyReleased(key: string): void;
    /**
     *  Handle scene pressed and repeat key.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(key: string): boolean;
    /**
     *  @inheritdoc
     */
    onMouseMove(x: number, y: number): void;
    /**
     *  @inheritdoc
     */
    onMouseUp(x: number, y: number): void;
    /**
     *  Draw the HUD scene
     */
    drawHUD(): void;
}
export { KeyboardAssign };
