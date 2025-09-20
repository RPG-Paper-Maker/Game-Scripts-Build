/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Paths, Platform, Utils } from '../Common/index.js';
import { Data } from '../index.js';
import { CommonEvent, CommonReaction, MapObject } from '../Model/index.js';
import { Base } from './Base.js';
/**
 * Handles all common events data.
 */
export class CommonEvents {
    /**
     * Get the event system by ID.
     */
    static getEventSystem(id) {
        return Base.get(id, this.eventsSystem, 'event system');
    }
    /**
     * Get the event user by ID.
     */
    static getEventUser(id) {
        return Base.get(id, this.eventsUser, 'event user');
    }
    /**
     * Get the common reaction by ID.
     */
    static getCommonReaction(id) {
        return Base.get(id, this.commonReactions, 'common reaction');
    }
    /**
     * Get the common object by ID.
     */
    static getCommonObject(id) {
        return Base.get(id, this.commonObjects, 'common object');
    }
    /**
     * Reorder the models in the right order for inheritance.
     * @param jsonObject - Current object to analyze
     * @param reorderedList - Accumulator for reordered objects
     * @param jsonObjects - Original list of JSON objects
     */
    static modelReOrder(jsonObject, reorderedList, jsonObjects) {
        if (jsonObject && !Object.prototype.hasOwnProperty.call(jsonObject, Data.CommonEvents.PROPERTY_STOCKED)) {
            // If id = -1, we can add to the list
            const id = jsonObject.hId;
            if (id !== -1) {
                // Search id in the json list
                let inheritedObject;
                for (inheritedObject of jsonObjects) {
                    if (inheritedObject.id === id) {
                        break;
                    }
                }
                // Test inheritance for this object
                this.modelReOrder(inheritedObject, reorderedList, jsonObjects);
            }
            jsonObject.stocked = true;
            reorderedList.push(jsonObject);
        }
    }
    /**
     * Read the JSON file associated to common events.
     */
    static async read() {
        const json = (await Platform.parseFileJSON(Paths.FILE_COMMON_EVENTS));
        this.eventsSystem = Utils.readJSONMap(json.eventsSystem, CommonEvent);
        this.eventsUser = Utils.readJSONMap(json.eventsUser, CommonEvent);
        this.commonReactions = Utils.readJSONMap(json.commonReactors, CommonReaction);
        // Common objects
        /* First, we'll need to reorder the json list according to
        inheritance */
        this.commonObjects = new Map();
        const reorderedList = [];
        for (const jsonObject of json.commonObjects) {
            this.modelReOrder(jsonObject, reorderedList, json.commonObjects);
        }
        // Now, we can create all the models without problem
        this.commonObjects = Utils.readJSONMap(reorderedList, MapObject);
        // Hero object
        this.heroObject = new MapObject(json.ho);
    }
}
CommonEvents.PROPERTY_STOCKED = 'stocked';
