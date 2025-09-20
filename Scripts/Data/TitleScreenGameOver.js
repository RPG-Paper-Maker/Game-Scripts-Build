/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { ALIGN, Paths, Platform, SONG_KIND, TITLE_SETTING_KIND, Utils } from '../Common/index.js';
import { Graphic, Manager, Scene } from '../index.js';
import { GameOverCommand, PlaySong, TitleCommand } from '../Model/index.js';
/**
 * All the title screen and game over data.
 */
export class TitlescreenGameover {
    /** Get title screen command graphics. */
    static getTitleCommandsNames() {
        return this.titleCommands.map((cmd) => {
            const text = new Graphic.Text(cmd.name(), { align: ALIGN.CENTER });
            text.datas = cmd;
            return text;
        });
    }
    /** Get title screen command actions. */
    static getTitleCommandsActions() {
        return this.titleCommands.map((cmd) => cmd.getAction());
    }
    /** Get title screen setting command graphics. */
    static getTitleSettingsCommandsContent() {
        return this.titleSettings.map((id) => new Graphic.Setting(id));
    }
    /** Get title screen setting command actions. */
    static getTitleSettingsCommandsActions() {
        return this.titleSettings.map((id) => this.getTitleSettingsCommandsAction(id));
    }
    /** Get action for a specific title setting. */
    static getTitleSettingsCommandsAction(id) {
        switch (id) {
            case TITLE_SETTING_KIND.KEYBOARD_ASSIGNMENT:
                return this.keyboardAssignment;
            case TITLE_SETTING_KIND.LANGUAGE:
                return this.language;
        }
    }
    /** Setting action: open keyboard assignment. */
    static keyboardAssignment() {
        Manager.Stack.push(new Scene.KeyboardAssign());
        return true;
    }
    /** Setting action: open language selection. */
    static language() {
        Manager.Stack.push(new Scene.ChangeLanguage());
        return true;
    }
    /** Get game over command graphics. */
    static getGameOverCommandsNames() {
        return this.gameOverCommands.map((cmd) => {
            const text = new Graphic.Text(cmd.name(), { align: ALIGN.CENTER });
            text.datas = cmd;
            return text;
        });
    }
    /** Get game over command actions. */
    static getGameOverCommandsActions() {
        return this.gameOverCommands.map((cmd) => cmd.getAction());
    }
    /** Read the JSON file associated with title screen and game over. */
    static async read() {
        const json = (await Platform.parseFileJSON(Paths.FILE_TITLE_SCREEN_GAME_OVER));
        // Title screen
        this.isTitleBackgroundImage = Utils.valueOrDefault(json.itbi, true);
        this.titleBackgroundImageID = Utils.valueOrDefault(json.tb, 1);
        this.titleBackgroundVideoID = Utils.valueOrDefault(json.tbv, 1);
        this.titleMusic = new PlaySong(SONG_KIND.MUSIC, json.tm);
        this.titleCommands = Utils.readJSONList(json.tc, TitleCommand);
        this.titleSettings = [];
        for (const obj of json.ts) {
            if (Utils.valueOrDefault(obj.checked, true)) {
                this.titleSettings.push(obj.id ?? 0);
            }
        }
        // Game over
        this.isGameOverBackgroundImage = Utils.valueOrDefault(json.isGameOverBackgroundImage, true);
        this.gameOverBackgroundImageID = Utils.valueOrDefault(json.gameOverBackgroundImage, 1);
        this.gameOverBackgroundVideoID = Utils.valueOrDefault(json.gameOverBackgroundVideo, 1);
        this.gameOverMusic = new PlaySong(SONG_KIND.MUSIC, json.gameOverMusic);
        this.gameOverCommands = Utils.readJSONList(json.gameOverCommands, GameOverCommand);
    }
}
