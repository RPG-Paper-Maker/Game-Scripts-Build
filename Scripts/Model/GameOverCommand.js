/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Manager, Model } from "../index.js";
import { GAME_OVER_COMMAND_KIND, Interpreter, Platform, Utils } from '../Common/index.js';
import { Game } from '../Core/index.js';
import { Localization } from './Localization.js';
/**
 * A game over command of the game.
 */
export class GameOverCommand extends Localization {
    constructor(json) {
        super(json);
    }
    /**
     * Get the action function according to kind.
     */
    getAction() {
        switch (this.kind) {
            case GAME_OVER_COMMAND_KIND.CONTINUE:
                return this.continue;
            case GAME_OVER_COMMAND_KIND.TITLE_SCREEN:
                return this.titleScreen;
            case GAME_OVER_COMMAND_KIND.EXIT:
                return this.exit;
            case GAME_OVER_COMMAND_KIND.SCRIPT:
                return this.executeScript;
        }
    }
    /**
     * Callback function for continuing the game (load last save).
     */
    continue() {
        if (Game.current.slot === -1) {
            // No save slot → start new game
            Model.TitleCommand.startNewGame();
        }
        else {
            // Resume from the last save slot
            Manager.Stack.top.continue().catch(console.error);
        }
        return true;
    }
    /**
     * Callback function for going back to title screen.
     */
    titleScreen() {
        Manager.Stack.popAll();
        Manager.Stack.pushTitleScreen();
        return true;
    }
    /**
     * Callback function for closing the window.
     */
    exit() {
        Platform.quit();
        return true;
    }
    /**
     * Callback function for executing a custom script.
     */
    executeScript() {
        Interpreter.evaluate(this.script, { addReturn: false });
        return true;
    }
    /**
     * Read the JSON associated to the game over command.
     */
    read(json) {
        super.read(json);
        this.kind = Utils.valueOrDefault(json.k, GAME_OVER_COMMAND_KIND.CONTINUE);
        this.script = Utils.valueOrDefault(json.s, '');
    }
}
