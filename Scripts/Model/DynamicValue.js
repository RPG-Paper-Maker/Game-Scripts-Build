/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import * as THREE from 'three';
import { DYNAMIC_VALUE_KIND, PICTURE_KIND, Platform, SONG_KIND, Utils } from '../Common/index.js';
import { Game, ReactionInterpreter } from '../Core/index.js';
import { Data } from '../index.js';
import { Base } from './Base.js';
/**
 * A dynamic value (variable, parameter, constant, etc.).
 */
export class DynamicValue extends Base {
    constructor(json) {
        super(json);
    }
    /** Create a new value from kind and value. */
    static create(k = DYNAMIC_VALUE_KIND.NONE, v = 0) {
        const modelValue = new DynamicValue();
        modelValue.kind = k;
        switch (k) {
            case DYNAMIC_VALUE_KIND.NONE:
                modelValue.value = null;
                break;
            case DYNAMIC_VALUE_KIND.MESSAGE:
                modelValue.value = String(v);
                break;
            case DYNAMIC_VALUE_KIND.SWITCH:
                modelValue.value = v === 1 ? true : v === 0 ? false : v;
                break;
            default:
                modelValue.value = v;
                break;
        }
        return modelValue;
    }
    /** Create a new value from a command and iterator. */
    static createValueCommand(command, iterator) {
        const k = command[iterator.i++];
        const v = command[iterator.i++];
        return DynamicValue.create(k, v);
    }
    /**
     *  Create a none value.
     */
    static createNone() {
        return DynamicValue.create(DYNAMIC_VALUE_KIND.NONE, null);
    }
    /**
     *  Create a new value number.
     */
    static createNumber(n) {
        return DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, n);
    }
    /**
     *  Create a new value message.
     */
    static createMessage(m) {
        return DynamicValue.create(DYNAMIC_VALUE_KIND.MESSAGE, m);
    }
    /**
     *  Create a new value decimal number.
     */
    static createNumberDouble(n) {
        return DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DOUBLE, n);
    }
    /**
     *  Create a new value keyBoard.
     */
    static createKeyBoard(k) {
        return DynamicValue.create(DYNAMIC_VALUE_KIND.KEYBOARD, k);
    }
    /**
     *  Create a new value switch.
     */
    static createSwitch(b) {
        return DynamicValue.create(DYNAMIC_VALUE_KIND.SWITCH, Utils.boolToNumber(b));
    }
    /**
     *  Create a new value variable.
     */
    static createVariable(id) {
        return DynamicValue.create(DYNAMIC_VALUE_KIND.VARIABLE, id);
    }
    /**
     *  Create a new value parameter.
     */
    static createParameter(id) {
        return DynamicValue.create(DYNAMIC_VALUE_KIND.PARAMETER, id);
    }
    /**
     *  Create a new value property.
     */
    static createProperty(id) {
        return DynamicValue.create(DYNAMIC_VALUE_KIND.PROPERTY, id);
    }
    /** Map parameters so they get resolved values instead of references. */
    static mapWithParametersProperties(parameters) {
        return parameters.map((value) => {
            return value.kind === DYNAMIC_VALUE_KIND.PARAMETER || DYNAMIC_VALUE_KIND.PROPERTY
                ? DynamicValue.create(DYNAMIC_VALUE_KIND.UNKNOWN, value.getValue())
                : value;
        });
    }
    /**
     *  Try to read a variable value, if not possible put default value.
     */
    static readOrDefaultVariable(json) {
        return json === undefined ? DynamicValue.createVariable(1) : DynamicValue.readFromJSON(json);
    }
    /**
     *  Try to read a number value, if not possible put default value.
     */
    static readOrDefaultNumber(json, n = 0) {
        return json === undefined ? DynamicValue.createNumber(n) : DynamicValue.readFromJSON(json);
    }
    /**
     *  Try to read a double number value, if not possible put default value.
     */
    static readOrDefaultNumberDouble(json, n = 0) {
        return json === undefined ? DynamicValue.createNumberDouble(n) : DynamicValue.readFromJSON(json);
    }
    /**
     *  Try to read a database value, if not possible put default value.
     */
    static readOrDefaultDatabase(json, id = 1) {
        return json === undefined
            ? DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, id)
            : DynamicValue.readFromJSON(json);
    }
    /**
     *  Try to read a message value, if not possible put default value.
     */
    static readOrDefaultMessage(json, m = '') {
        return json === undefined
            ? DynamicValue.create(DYNAMIC_VALUE_KIND.MESSAGE, m)
            : DynamicValue.readFromJSON(json);
    }
    /**
     *  Try to read a switch value, if not possible put default value.
     */
    static readOrDefaultSwitch(json, s = true) {
        return json === undefined ? DynamicValue.createSwitch(s) : DynamicValue.readFromJSON(json);
    }
    /**
     *  Try to read a value, if not possible put none value.
     */
    static readOrNone(json) {
        return json === undefined ? DynamicValue.createNone() : DynamicValue.readFromJSON(json);
    }
    /**
     *  Read a value of any kind and return it.
     */
    static readFromJSON(json) {
        const value = new DynamicValue();
        value.read(json);
        return value;
    }
    /**
     *  Get the value.
     */
    getValue(forceVariable = false, deep = false) {
        switch (this.kind) {
            case DYNAMIC_VALUE_KIND.VARIABLE:
                if (!Game.current) {
                    Platform.showErrorMessage('Trying to access a variable value without any game loaded.');
                }
                return forceVariable ? this.value : Game.current.getVariable(this.value);
            case DYNAMIC_VALUE_KIND.PARAMETER:
                return ReactionInterpreter.currentParameters.get(this.value).getValue();
            case DYNAMIC_VALUE_KIND.PROPERTY:
                return ReactionInterpreter.currentObject.properties[this.value];
            case DYNAMIC_VALUE_KIND.CLASS:
                return Data.Classes.get(this.value);
            case DYNAMIC_VALUE_KIND.HERO:
                return Data.Heroes.get(this.value);
            case DYNAMIC_VALUE_KIND.MONSTER:
                return Data.Monsters.get(this.value);
            case DYNAMIC_VALUE_KIND.TROOP:
                return Data.Troops.get(this.value);
            case DYNAMIC_VALUE_KIND.ITEM:
                return Data.Items.get(this.value);
            case DYNAMIC_VALUE_KIND.WEAPON:
                return Data.Weapons.get(this.value);
            case DYNAMIC_VALUE_KIND.ARMOR:
                return Data.Armors.get(this.value);
            case DYNAMIC_VALUE_KIND.SKILL:
                return Data.Skills.get(this.value);
            case DYNAMIC_VALUE_KIND.ANIMATION:
                return Data.Animations.get(this.value);
            case DYNAMIC_VALUE_KIND.STATUS:
                return Data.Status.get(this.value);
            case DYNAMIC_VALUE_KIND.TILESET:
                return Data.Tilesets.get(this.value);
            case DYNAMIC_VALUE_KIND.FONT_SIZE:
                return Data.Systems.getFontSize(this.value);
            case DYNAMIC_VALUE_KIND.FONT_NAME:
                return Data.Systems.getFontName(this.value);
            case DYNAMIC_VALUE_KIND.COLOR:
                return Data.Systems.getColor(this.value);
            case DYNAMIC_VALUE_KIND.WINDOW_SKIN:
                return Data.Systems.getWindowSkin(this.value);
            case DYNAMIC_VALUE_KIND.CURRENCY:
                return Data.Systems.getCurrency(this.value);
            case DYNAMIC_VALUE_KIND.SPEED:
                return Data.Systems.getSpeed(this.value);
            case DYNAMIC_VALUE_KIND.DETECTION:
                return Data.Systems.getDetection(this.value);
            case DYNAMIC_VALUE_KIND.CAMERA_PROPERTY:
                return Data.Systems.getCameraProperties(this.value);
            case DYNAMIC_VALUE_KIND.FREQUENCY:
                return Data.Systems.getFrequency(this.value);
            case DYNAMIC_VALUE_KIND.SKYBOX:
                return Data.Systems.getSkybox(this.value);
            case DYNAMIC_VALUE_KIND.BATTLE_MAP:
                return Data.BattleSystems.getBattleMap(this.value);
            case DYNAMIC_VALUE_KIND.ELEMENT:
                return Data.BattleSystems.getElement(this.value);
            case DYNAMIC_VALUE_KIND.COMMON_STATISTIC:
                return Data.BattleSystems.getStatistic(this.value);
            case DYNAMIC_VALUE_KIND.WEAPONS_KIND:
                return Data.BattleSystems.getWeaponKind(this.value);
            case DYNAMIC_VALUE_KIND.ARMORS_KIND:
                return Data.BattleSystems.getArmorKind(this.value);
            case DYNAMIC_VALUE_KIND.COMMON_BATTLE_COMMAND:
                return Data.BattleSystems.getBattleCommand(this.value);
            case DYNAMIC_VALUE_KIND.COMMON_EQUIPMENT:
                return Data.BattleSystems.getEquipment(this.value);
            case DYNAMIC_VALUE_KIND.EVENT:
                return Data.CommonEvents.getEventUser(this.value);
            case DYNAMIC_VALUE_KIND.STATE:
                return this.value;
            case DYNAMIC_VALUE_KIND.COMMON_REACTION:
                return Data.CommonEvents.getCommonReaction(this.value);
            case DYNAMIC_VALUE_KIND.MODEL:
                return Data.CommonEvents.getCommonObject(this.value);
            case DYNAMIC_VALUE_KIND.CUSTOM_STRUCTURE:
                if (deep) {
                    const obj = {};
                    for (const k in this.customStructure) {
                        obj[k] = this.customStructure[k].getValue(forceVariable, true);
                    }
                    return obj;
                }
                return this.customStructure;
            case DYNAMIC_VALUE_KIND.CUSTOM_LIST:
                if (deep) {
                    return this.customList.map((v) => v.getValue(forceVariable, true));
                }
                return this.customList;
            case DYNAMIC_VALUE_KIND.VECTOR2:
                return new THREE.Vector2(this.x.getValue(), this.y.getValue());
            case DYNAMIC_VALUE_KIND.VECTOR3:
                return new THREE.Vector3(this.x.getValue(), this.y.getValue(), this.z.getValue());
            case DYNAMIC_VALUE_KIND.BARS:
                return Data.Pictures.get(PICTURE_KIND.BARS, this.value);
            case DYNAMIC_VALUE_KIND.ICONS:
                return Data.Pictures.get(PICTURE_KIND.ICONS, this.value);
            case DYNAMIC_VALUE_KIND.AUTOTILES:
                return Data.Pictures.get(PICTURE_KIND.AUTOTILES, this.value);
            case DYNAMIC_VALUE_KIND.CHARACTERS:
                return Data.Pictures.get(PICTURE_KIND.CHARACTERS, this.value);
            case DYNAMIC_VALUE_KIND.MOUNTAINS:
                return Data.Pictures.get(PICTURE_KIND.MOUNTAINS, this.value);
            case DYNAMIC_VALUE_KIND.TILESETS:
                return Data.Pictures.get(PICTURE_KIND.TILESETS, this.value);
            case DYNAMIC_VALUE_KIND.WALLS:
                return Data.Pictures.get(PICTURE_KIND.WALLS, this.value);
            case DYNAMIC_VALUE_KIND.BATTLERS:
                return Data.Pictures.get(PICTURE_KIND.BATTLERS, this.value);
            case DYNAMIC_VALUE_KIND.FACESETS:
                return Data.Pictures.get(PICTURE_KIND.FACESETS, this.value);
            case DYNAMIC_VALUE_KIND.WINDOW_SKINS:
                return Data.Pictures.get(PICTURE_KIND.WINDOW_SKINS, this.value);
            case DYNAMIC_VALUE_KIND.TITLE_SCREEN:
                return Data.Pictures.get(PICTURE_KIND.TITLE_SCREEN, this.value);
            case DYNAMIC_VALUE_KIND.OBJECT_3D:
                return Data.Pictures.get(PICTURE_KIND.OBJECTS_3D, this.value);
            case DYNAMIC_VALUE_KIND.PICTURES:
                return Data.Pictures.get(PICTURE_KIND.PICTURES, this.value);
            case DYNAMIC_VALUE_KIND.ANIMATIONS:
                return Data.Pictures.get(PICTURE_KIND.ANIMATIONS, this.value);
            case DYNAMIC_VALUE_KIND.SKYBOXES:
                return Data.Pictures.get(PICTURE_KIND.SKYBOXES, this.value);
            case DYNAMIC_VALUE_KIND.MUSIC:
                return Data.Songs.get(SONG_KIND.MUSIC, this.value);
            case DYNAMIC_VALUE_KIND.BACKGROUND_SOUND:
                return Data.Songs.get(SONG_KIND.BACKGROUND_SOUND, this.value);
            case DYNAMIC_VALUE_KIND.SOUND:
                return Data.Songs.get(SONG_KIND.SOUND, this.value);
            case DYNAMIC_VALUE_KIND.MUSIC_EFFECT:
                return Data.Songs.get(SONG_KIND.MUSIC_EFFECT, this.value);
            default:
                return this.value;
        }
    }
    /** Check if a value is equal to another one. */
    isEqual(value) {
        // If keyBoard
        if (this.kind === DYNAMIC_VALUE_KIND.KEYBOARD && value.kind !== DYNAMIC_VALUE_KIND.KEYBOARD) {
            return Data.Keyboards.isKeyEqual(value.value, Data.Keyboards.get(this.value));
        }
        else if (value.kind === DYNAMIC_VALUE_KIND.KEYBOARD && this.kind !== DYNAMIC_VALUE_KIND.KEYBOARD) {
            return Data.Keyboards.isKeyEqual(this.value, Data.Keyboards.get(value.value));
        }
        else if (this.kind === DYNAMIC_VALUE_KIND.ANYTHING || value.kind === DYNAMIC_VALUE_KIND.ANYTHING) {
            return true;
        }
        // If any other value, compare the direct values
        return this.getValue() === value.getValue();
    }
    /** Create a copy of the value. */
    createCopy() {
        return DynamicValue.create(this.kind, this.value);
    }
    /** Read the JSON. */
    read(json) {
        this.kind = json.k;
        this.value = json.v;
        switch (this.kind) {
            case DYNAMIC_VALUE_KIND.CUSTOM_STRUCTURE:
                this.customStructure = {};
                for (const { name, value } of Utils.valueOrDefault(json.customStructure?.properties, [])) {
                    this.customStructure[name] = DynamicValue.readOrDefaultNumber(value);
                }
                break;
            case DYNAMIC_VALUE_KIND.CUSTOM_LIST:
                this.customList = Utils.readJSONList(json.customList.list, (jsonParameter) => DynamicValue.readOrDefaultNumber(jsonParameter.value));
                break;
            case DYNAMIC_VALUE_KIND.VECTOR2:
                this.x = DynamicValue.readFromJSON(json.x);
                this.y = DynamicValue.readFromJSON(json.y);
                break;
            case DYNAMIC_VALUE_KIND.VECTOR3:
                this.x = DynamicValue.readFromJSON(json.x);
                this.y = DynamicValue.readFromJSON(json.y);
                this.z = DynamicValue.readFromJSON(json.z);
                break;
            default:
                break;
        }
    }
    /** Convert to JSON. */
    toJson() {
        return { k: this.kind, v: this.value };
    }
}
