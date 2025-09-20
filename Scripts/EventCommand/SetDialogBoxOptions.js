/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Utils } from '../Common/index.js';
import { Data, Model } from '../index.js';
import { Base } from './Base.js';
/** @class
 *  An event command for setting the dialog box options.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class SetDialogBoxOptions extends Base {
    constructor(command) {
        super();
        const iterator = {
            i: 0,
        };
        if (Utils.numberToBool(command[iterator.i++])) {
            this.windowSkinID = Model.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numberToBool(command[iterator.i++])) {
            this.x = Model.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numberToBool(command[iterator.i++])) {
            this.y = Model.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numberToBool(command[iterator.i++])) {
            this.w = Model.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numberToBool(command[iterator.i++])) {
            this.h = Model.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numberToBool(command[iterator.i++])) {
            this.pLeft = Model.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numberToBool(command[iterator.i++])) {
            this.pTop = Model.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numberToBool(command[iterator.i++])) {
            this.pRight = Model.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numberToBool(command[iterator.i++])) {
            this.pBottom = Model.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numberToBool(command[iterator.i++])) {
            this.fPosAbove = Utils.numberToBool(command[iterator.i++]);
        }
        if (Utils.numberToBool(command[iterator.i++])) {
            this.fX = Model.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numberToBool(command[iterator.i++])) {
            this.fY = Model.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numberToBool(command[iterator.i++])) {
            this.tOutline = !Utils.numberToBool(command[iterator.i++]);
        }
        if (Utils.numberToBool(command[iterator.i++])) {
            this.tcText = Model.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numberToBool(command[iterator.i++])) {
            this.tcOutline = Model.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numberToBool(command[iterator.i++])) {
            this.tcBackground = Model.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numberToBool(command[iterator.i++])) {
            this.tSize = Model.DynamicValue.createValueCommand(command, iterator);
        }
        if (Utils.numberToBool(command[iterator.i++])) {
            this.tFont = Model.DynamicValue.createValueCommand(command, iterator);
        }
    }
    /**
     *  Update and check if the event is finished
     *  @param {Object} currentState - The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
     */
    update(currentState, object, state) {
        if (this.windowSkinID !== undefined) {
            Data.Systems.dbOptions.v_windowSkin = Data.Systems.getWindowSkin(this.windowSkinID.getValue());
        }
        if (this.x !== undefined) {
            Data.Systems.dbOptions.v_x = this.x.getValue();
        }
        if (this.y !== undefined) {
            Data.Systems.dbOptions.v_y = this.y.getValue();
        }
        if (this.w !== undefined) {
            Data.Systems.dbOptions.v_w = this.w.getValue();
        }
        if (this.h !== undefined) {
            Data.Systems.dbOptions.v_h = this.h.getValue();
        }
        if (this.pLeft !== undefined) {
            Data.Systems.dbOptions.v_pLeft = this.pLeft.getValue();
        }
        if (this.pTop !== undefined) {
            Data.Systems.dbOptions.v_pTop = this.pTop.getValue();
        }
        if (this.pRight !== undefined) {
            Data.Systems.dbOptions.v_pRight = this.pRight.getValue();
        }
        if (this.pBottom !== undefined) {
            Data.Systems.dbOptions.v_pBottom = this.pBottom.getValue();
        }
        if (this.fPosAbove !== undefined) {
            Data.Systems.dbOptions.v_fPosAbove = this.fPosAbove;
        }
        if (this.fX !== undefined) {
            Data.Systems.dbOptions.v_fX = this.fX.getValue();
        }
        if (this.fY !== undefined) {
            Data.Systems.dbOptions.v_fY = this.fY.getValue();
        }
        if (this.tOutline !== undefined) {
            Data.Systems.dbOptions.v_tOutline = this.tOutline;
        }
        if (this.tcText !== undefined) {
            Data.Systems.dbOptions.v_tcText = Data.Systems.getColor(this.tcText.getValue());
        }
        if (this.tcOutline !== undefined) {
            Data.Systems.dbOptions.v_tcOutline = Data.Systems.getColor(this.tcOutline.getValue());
        }
        if (this.tcBackground !== undefined) {
            Data.Systems.dbOptions.v_tcBackground = Data.Systems.getColor(this.tcBackground.getValue());
        }
        if (this.tSize !== undefined) {
            Data.Systems.dbOptions.v_tSize = Data.Systems.getFontSize(this.tSize.getValue()).getValue();
        }
        if (this.tFont !== undefined) {
            Data.Systems.dbOptions.v_tFont = Data.Systems.getFontName(this.tFont.getValue()).getName();
        }
        return 1;
    }
}
export { SetDialogBoxOptions };
