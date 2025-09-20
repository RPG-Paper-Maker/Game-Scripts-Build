/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Data } from '../index.js';
import { Base } from './Base.js';
import { Parameter } from './Parameter.js';
import { Reaction } from './Reaction.js';
/**
 * An event that an object can react to.
 */
export class Event extends Base {
    constructor(json) {
        super(json);
    }
    /**
     * Check if this event is equal to another.
     */
    isEqual(event) {
        if (this.isSystem !== event.isSystem || this.idEvent !== event.idEvent) {
            return false;
        }
        for (const [id, parameter] of this.parameters.entries()) {
            if (!parameter.isEqual(event.parameters.get(id))) {
                return false;
            }
        }
        return true;
    }
    /**
     * Add reactions to the event.
     */
    addReactions(reactions) {
        for (const [idState, reaction] of reactions) {
            this.reactions.set(idState, reaction);
        }
    }
    /**
     * Read the JSON associated to the event.
     */
    read(json) {
        this.isSystem = json.sys;
        this.idEvent = json.id;
        // Parameters
        this.parameters = Parameter.readParametersWithDefault(json, (this.isSystem
            ? Data.CommonEvents.getEventSystem(this.idEvent)
            : Data.CommonEvents.getEventUser(this.idEvent)).parameters);
        // Reactions
        const jsonReactions = json.r;
        this.reactions = new Map();
        for (const idState in json.r) {
            const reaction = new Reaction(jsonReactions[idState]);
            reaction.event = this;
            this.reactions.set(Number(idState), reaction);
        }
    }
}
