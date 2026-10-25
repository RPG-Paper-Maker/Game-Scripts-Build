/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Data, Graphic, Manager, Model } from "../index.js";
import { Inputs, Utils } from '../Common/index.js';
import { Base } from './Base.js';
/** @class
 *  An event command for playing a video.
 *  @extends EventCommand.Base
 *  @param {MapObjectCommandType[]} command - Direct JSON command to parse
 */
class PlayAVideo extends Base {
    constructor(command) {
        super();
        this.isWaitEnd = true;
        this.canSkip = false;
        this.isMaintained = false;
        const iterator = {
            i: 0,
        };
        this.operation = command[iterator.i++];
        if (this.operation === 0) {
            this.videoID = command[iterator.i++];
            this.isStart = Utils.numberToBool(command[iterator.i++]);
            if (this.isStart) {
                this.start = Model.DynamicValue.createValueCommand(command, iterator);
            }
            this.isWaitEnd = Utils.numberToBool(command[iterator.i++]);
            if (iterator.i < command.length) {
                this.canSkip = Utils.numberToBool(command[iterator.i++]);
                if (this.canSkip) {
                    this.skipKeyID = Model.DynamicValue.createValueCommand(command, iterator);
                    this.isMaintained = Utils.numberToBool(command[iterator.i++]);
                    if (this.isMaintained) {
                        this.maintainDuration = Model.DynamicValue.createValueCommand(command, iterator);
                    }
                }
            }
        }
        this.parallel = !this.isWaitEnd;
    }
    /**
     *  Initialize the current state.
     *  @returns {PlayAVideoState} The current state
     */
    initialize() {
        const skipGraphic = this.canSkip && this.isMaintained ? new Graphic.SkipHold(this.skipKeyID.getValue()) : null;
        return {
            parallel: this.isWaitEnd,
            started: false,
            finished: false,
            holdElapsed: 0,
            skipKeyMustBeReleased: this.canSkip && this.isSkipKeyHeld(),
            skipGraphic,
        };
    }
    /**
     *  Update and check if the event is finished.
     *  @param {PlayAVideoState} currentState - The current state of the event
     *  @returns {number} The number of node to pass
     */
    update(currentState) {
        if (currentState.parallel) {
            if (!currentState.started) {
                switch (this.operation) {
                    case 0:
                        void Manager.Videos.play(Data.Videos.get(this.videoID).getPath() +
                            (this.isStart ? '#t=' + this.start.getValue() : ''), () => {
                            Manager.Videos.stop();
                            currentState.finished = true;
                        });
                        break;
                    case 1:
                        Manager.Videos.pause();
                        currentState.finished = true;
                        break;
                    case 2:
                        Manager.Videos.stop();
                        currentState.finished = true;
                        break;
                }
                currentState.started = true;
            }
            if (!currentState.finished && this.canSkip) {
                const keyHeld = this.isSkipKeyHeld();
                if (!keyHeld)
                    currentState.skipKeyMustBeReleased = false;
                const skipKeyActive = keyHeld && !currentState.skipKeyMustBeReleased;
                if (this.isMaintained) {
                    const duration = this.maintainDuration.getValue() * 1000;
                    if (skipKeyActive) {
                        currentState.holdElapsed += Manager.Stack.elapsedTime;
                        if (currentState.holdElapsed >= duration) {
                            Manager.Videos.stop();
                            currentState.finished = true;
                        }
                        Manager.Stack.requestPaintHUD = true;
                    }
                    else if (currentState.holdElapsed > 0) {
                        currentState.holdElapsed = 0;
                        Manager.Stack.requestPaintHUD = true;
                    }
                }
                else if (skipKeyActive) {
                    Manager.Videos.stop();
                    currentState.finished = true;
                }
            }
            return currentState.finished ? 1 : 0;
        }
        return 1;
    }
    isSkipKeyHeld() {
        const keyboard = Data.Keyboards.get(this.skipKeyID.getValue(), '');
        for (const pressedKey of Inputs.keysPressed) {
            if (keyboard && Data.Keyboards.isKeyEqual(pressedKey, keyboard))
                return true;
        }
        return false;
    }
    /**
     *  Draw the HUD.
     *  @param {PlayAVideoState} currentState - The current state of the event
     */
    drawHUD(currentState) {
        if (!this.canSkip || !this.isMaintained)
            return;
        currentState.skipGraphic.draw(currentState.holdElapsed, this.maintainDuration.getValue() * 1000);
    }
}
export { PlayAVideo };
