/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Tree } from '../Core/index.js';
import { EventCommand, Manager } from '../index.js';
import { Base } from './Base.js';
/**
 * A reaction to an event.
 */
export class Reaction extends Base {
    constructor(json) {
        super(json);
    }
    /**
     * Get the first node command of the reaction.
     */
    getFirstCommand() {
        return this.commands.root.firstChild;
    }
    /**
     * Read the JSON associated to the reaction.
     */
    read(json) {
        this.labels = [];
        this.idEvent = json.id;
        this.blockingHero = json.bh;
        this.commands = new Tree('root');
        this.readChildrenJSON(json.c, this.commands.root);
    }
    /**
     * Recursively read the JSON children associated to the reaction.
     */
    readChildrenJSON(jsonCommands, parent) {
        let showText = null;
        for (const jsonCommand of jsonCommands) {
            const command = Manager.Events.getEventCommand(jsonCommand);
            // Comment
            if (command instanceof EventCommand.Comment) {
                continue;
            }
            // Add node
            const node = parent.add(command);
            // If text before choice, make a link
            if (command instanceof EventCommand.ShowText) {
                showText = command;
            }
            else if (command instanceof EventCommand.DisplayChoice || command instanceof EventCommand.InputNumber) {
                command.setShowText(showText);
                showText = null;
            }
            else if (command instanceof EventCommand.Label) {
                this.labels.push([command.name, node]);
                showText = null;
            }
            else {
                showText = null;
            }
            if (jsonCommand.children) {
                this.readChildrenJSON(jsonCommand.children, node);
            }
        }
    }
}
