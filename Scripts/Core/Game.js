/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import * as THREE from 'three';
import { CHARACTER_KIND, GROUP_KIND, Paths, Platform, Utils } from '../Common/index.js';
import { Data, Manager, Model, Scene } from '../index.js';
import { Chrono } from './Chrono.js';
import { Item } from './Item.js';
import { MapObject } from './MapObject.js';
import { Player } from './Player.js';
/** @class
 *  All the global informations of a particular game.
 *  @param {number} slot - The number of the slot to load
 */
class Game {
    constructor(slot = -1) {
        this.chronometers = [];
        this.previousWeatherOptions = null;
        this.currentWeatherOptions = null;
        this.slot = slot;
        this.hero = new MapObject(Data.Systems.modelHero.system, Data.Systems.modelHero.position.clone(), true);
        this.battleMusic = Data.BattleSystems.battleMusic;
        this.victoryMusic = Data.BattleSystems.battleVictory;
        this.textures = {};
        this.textures.tilesets = {};
        this.textures.autotiles = {};
        this.textures.walls = {};
        this.textures.objects3D = {};
        this.textures.mountains = {};
        this.isEmpty = true;
    }
    /**
     *  Get the hero in a tab with instance ID.
     *  @static
     *  @param {Player[]} tab - The heroes tab
     *  @param {number} id - The instance ID
     *  @returns {GamePlayer}
     */
    static getHeroInstanceInTab(tab, id) {
        let hero;
        for (let i = 0, l = tab.length; i < l; i++) {
            hero = tab[i];
            if (hero.instid === id) {
                return hero;
            }
        }
        return null;
    }
    /**
     *  Load the game file.
     *  @async
     */
    async load() {
        const path = this.getPathSave();
        const json = (await Platform.loadSave(this.slot, path));
        if (json === null) {
            return;
        }
        this.playTime = new Chrono(json.t);
        this.charactersInstances = json.inst;
        this.variables = Utils.arrayToMap(json.vars);
        this.shops = json.shops;
        this.steps = Utils.valueOrDefault(json.steps, 0);
        this.saves = Utils.valueOrDefault(json.saves, 0);
        this.battles = Utils.valueOrDefault(json.battles, 0);
        this.chronometers = Utils.valueOrDefault(json.chronos, []).map((chrono) => {
            return new Chrono(chrono.t, chrono.id, true, chrono.d);
        });
        // Items
        this.items = Utils.readJSONList(json.itm, (element) => new Item(element.kind, element.id, element.nb));
        // Currencies
        this.currencies = Utils.arrayToMap(json.cur, true);
        this.currenciesEarned = Utils.arrayToMap(json.cure, true);
        this.currenciesUsed = Utils.arrayToMap(json.curu, true);
        // Heroes
        this.teamHeroes = Utils.readJSONList(json.th, (element) => new Player(element.kind, element.id, element.instid, element.sk, element.status, element.name, element));
        this.reserveHeroes = Utils.readJSONList(json.sh, (element) => new Player(element.kind, element.id, element.instid, element.sk, element.status, element.name, element));
        this.hiddenHeroes = Utils.readJSONList(json.hh, (element) => new Player(element.kind, element.id, element.instid, element.sk, element.status, element.name, element));
        // Map infos
        this.currentMapID = json.currentMapId;
        const positionHero = json.heroPosition;
        this.hero.position.set(positionHero[0], positionHero[1], positionHero[2]);
        this.heroStates = json.heroStates;
        this.heroProperties = json.heroProp;
        this.heroStatesOptions = json.heroStatesOpts;
        this.startupStates = json.startS;
        this.startupProperties = json.startP;
        this.mapsProperties = Utils.valueOrDefault(json.mapsP, {});
        this.mapsData = json.mapsData;
        if (json.textures) {
            this.textures = json.textures;
        }
        this.isEmpty = false;
    }
    /**
     *  Save a game file.
     *  @async
     */
    async save(slot) {
        if (slot !== undefined) {
            this.slot = slot;
        }
        let l = this.teamHeroes.length;
        const teamHeroes = new Array(l);
        let i;
        for (i = 0; i < l; i++) {
            teamHeroes[i] = this.teamHeroes[i].getSaveCharacter();
        }
        l = this.reserveHeroes.length;
        const reserveHeroes = new Array(l);
        for (i = 0; i < l; i++) {
            reserveHeroes[i] = this.reserveHeroes[i].getSaveCharacter();
        }
        l = this.hiddenHeroes.length;
        const hiddenHeroes = new Array(l);
        for (i = 0; i < l; i++) {
            hiddenHeroes[i] = this.hiddenHeroes[i].getSaveCharacter();
        }
        l = this.items.length;
        const items = new Array(l);
        for (i = 0; i < l; i++) {
            items[i] = this.items[i].getSave();
        }
        this.saves++;
        await Platform.registerSave(slot, this.getPathSave(slot), {
            t: this.playTime.time,
            th: teamHeroes,
            sh: reserveHeroes,
            hh: hiddenHeroes,
            itm: items,
            cur: Utils.mapToArray(this.currencies),
            cure: Utils.mapToArray(this.currenciesEarned),
            curu: Utils.mapToArray(this.currenciesUsed),
            inst: this.charactersInstances,
            vars: Utils.mapToArray(this.variables),
            currentMapId: this.currentMapID,
            heroPosition: [this.hero.position.x, this.hero.position.y, this.hero.position.z],
            heroStates: this.heroStates,
            heroProp: this.heroProperties,
            heroStatesOpts: this.heroStatesOptions,
            startS: this.startupStates,
            startP: this.startupProperties,
            mapsP: this.mapsProperties,
            shops: this.shops,
            steps: this.steps,
            saves: this.saves,
            battles: this.battles,
            chronos: this.chronometers.map((chrono) => {
                return {
                    t: chrono.time,
                    id: chrono.id,
                    d: chrono.graphic !== null,
                };
            }),
            textures: this.textures,
            mapsData: this.getCompressedMapsData(),
        });
    }
    /**
     *  Load the positions that were kept (keep position option).
     */
    async loadPositions() {
        let i, l, jp, j, k, w, h, id, objPortion, inf, datas, map, objectMap, movedObjects, objectMapMinMout;
        objectMap = objectMap = async (t) => {
            const obj = (await MapObject.searchOutMap(t[0])).object;
            obj.position = new THREE.Vector3(t[1], t[2], t[3]);
            obj.previousPosition = obj.position;
            return obj;
        };
        for (id in this.mapsData) {
            l = this.mapsData[id].length;
            map = null;
            // First initialize all moved objects
            movedObjects = [];
            objPortion = new Array(l);
            for (i = 0; i < l; i++) {
                objPortion[i] = new Array(2);
                for (jp = 0; jp < 2; jp++) {
                    h = this.mapsData[id][i][jp].length;
                    objPortion[i][jp] = new Array(h);
                    for (j = jp === 0 ? 1 : 0; j < h; j++) {
                        w = this.mapsData[id][i][jp][j].length;
                        objPortion[i][jp][j] = new Array(w);
                        for (k = 0; k < w; k++) {
                            inf = {};
                            datas = this.mapsData[id][i][jp][j][k];
                            if (datas) {
                                if (datas.m && datas.m.length) {
                                    if (!map) {
                                        map = new Scene.Map(parseInt(id), false, true);
                                        Scene.Map.current = map;
                                        await map.readMapProperties();
                                    }
                                    datas.m = await Promise.all(datas.m.map(objectMap));
                                    movedObjects = movedObjects.concat(datas.m);
                                }
                            }
                        }
                    }
                }
            }
            // Associate min and mout
            objectMapMinMout = (i) => {
                return movedObjects[Utils.indexOfProp(movedObjects, 'id', i)];
            };
            for (i = 0; i < l; i++) {
                objPortion[i] = new Array(2);
                for (jp = 0; jp < 2; jp++) {
                    h = this.mapsData[id][i][jp].length;
                    objPortion[i][jp] = new Array(h);
                    for (j = jp === 0 ? 1 : 0; j < h; j++) {
                        w = this.mapsData[id][i][jp][j].length;
                        objPortion[i][jp][j] = new Array(w);
                        for (k = 0; k < w; k++) {
                            inf = {};
                            datas = this.mapsData[id][i][jp][j][k];
                            if (datas) {
                                if (datas.min && datas.min.length) {
                                    datas.min = datas.min.map(objectMapMinMout);
                                }
                                if (datas.mout && datas.mout.length) {
                                    datas.mout = datas.mout.map(objectMapMinMout);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    /**
     *  Get a compressed version of mapsData (don't retain meshs).
     *  @returns {Object}
     */
    getCompressedMapsData() {
        const obj = {};
        let i, l, jp, j, k, w, h, id, objPortion, inf, datas, o, tab;
        for (id in this.mapsData) {
            l = this.mapsData[id].length;
            objPortion = new Array(l);
            for (i = 0; i < l; i++) {
                objPortion[i] = new Array(2);
                for (jp = 0; jp < 2; jp++) {
                    h = this.mapsData[id][i][jp].length;
                    objPortion[i][jp] = new Array(h);
                    for (j = jp === 0 ? 1 : 0; j < h; j++) {
                        w = this.mapsData[id][i][jp][j].length;
                        objPortion[i][jp][j] = new Array(w);
                        for (k = 0; k < w; k++) {
                            inf = {};
                            datas = this.mapsData[id][i][jp][j][k];
                            if (datas) {
                                if (datas.min && datas.min.length) {
                                    tab = [];
                                    for (o of datas.min) {
                                        if (o.currentStateInstance && o.currentStateInstance.keepPosition) {
                                            tab.push(o.system.id);
                                        }
                                    }
                                    if (tab.length) {
                                        inf.min = tab;
                                    }
                                }
                                if (datas.mout && datas.mout.length) {
                                    tab = [];
                                    for (o of datas.mout) {
                                        if (o.currentStateInstance && o.currentStateInstance.keepPosition) {
                                            tab.push(o.system.id);
                                        }
                                    }
                                    if (tab.length) {
                                        inf.mout = tab;
                                    }
                                }
                                if (datas.m && datas.m.length) {
                                    tab = [];
                                    for (o of datas.m) {
                                        if (o.currentStateInstance && o.currentStateInstance.keepPosition) {
                                            tab.push([o.system.id, o.position.x, o.position.y, o.position.z]);
                                        }
                                    }
                                    if (tab.length) {
                                        inf.m = tab;
                                    }
                                }
                                if (datas.si && datas.si.length) {
                                    inf.si = datas.si;
                                }
                                if (datas.s && datas.s.length) {
                                    inf.s = datas.s;
                                }
                                if (datas.pi && datas.pi.length) {
                                    inf.pi = datas.pi;
                                }
                                if (datas.p && datas.p.length) {
                                    inf.p = datas.p;
                                }
                                if (datas.soi && datas.soi.length) {
                                    inf.soi = datas.soi;
                                }
                                if (datas.so && datas.so.length) {
                                    inf.so = datas.so;
                                }
                            }
                            objPortion[i][jp][j][k] = datas ? inf : null;
                        }
                    }
                }
            }
            obj[id] = objPortion;
        }
        return obj;
    }
    /**
     *  Initialize a default game
     */
    initializeDefault() {
        this.teamHeroes = [];
        this.reserveHeroes = [];
        this.hiddenHeroes = [];
        this.items = [];
        this.currencies = Data.Systems.getDefaultCurrencies();
        this.currenciesEarned = Data.Systems.getDefaultCurrencies();
        this.currenciesUsed = Data.Systems.getDefaultCurrencies();
        this.charactersInstances = 0;
        this.initializeVariables();
        this.currentMapID = Data.Systems.ID_MAP_START_HERO;
        this.heroStates = [1];
        this.heroProperties = [];
        this.heroStatesOptions = [];
        this.startupStates = {};
        this.startupProperties = {};
        this.mapsProperties = {};
        for (const member of Data.Systems.initialPartyMembers) {
            this.instanciateTeam(member.teamKind, member.characterKind, member.heroID.getValue(), member.level.getValue(), member.variableInstanceID.getValue(true));
        }
        this.mapsData = {};
        this.hero.initializeProperties();
        this.playTime = new Chrono(0);
        this.shops = {};
        this.steps = 0;
        this.saves = 0;
        this.battles = 0;
        this.isEmpty = false;
    }
    /**
     *  Initialize the default variables.
     */
    initializeVariables() {
        this.variables = new Map(Data.Variables.names.keys().map((id) => [id, 0]));
    }
    /**
     *  Instanciate a new character in a group in the game.
     *  @param {GROUP_KIND} groupKind - In which group we should instanciate
     *  @param {CHARACTER_KIND} type - The type of character to instanciate
     *  @param {number} id - The ID of the character to instanciate
     *  @param {number} level - The player level
     *  @param {number} stockID - The ID of the variable where we will stock the
     *  instantiate ID
     *  @returns {Player}
     */
    instanciateTeam(groupKind, type, id, level, stockID) {
        // Stock the instanciation id in a variable
        this.variables.set(stockID, this.charactersInstances);
        // Adding the instanciated character in the right group
        const player = new Player(type, id, this.charactersInstances++, [], []);
        player.instanciate(level);
        this.getTeam(groupKind).push(player);
        return player;
    }
    /**
     *  Get the teams list in a list.
     *  @returns {Player[][]}
     */
    getGroups() {
        return [this.teamHeroes, this.reserveHeroes, this.hiddenHeroes];
    }
    /**
     *  Get the path save according to slot.
     *  @param {number} [slot=undefined]
     *  @returns {string}
     */
    getPathSave(slot) {
        return Paths.SAVES + '/' + (slot === undefined ? this.slot : slot) + '.json';
    }
    /**
     *  Get the variable by ID.
     *  @param {number} id
     *  @returns {any}
     */
    getVariable(id) {
        return Data.Base.get(id, this.variables, 'variable');
    }
    /**
     *  Get the currency by ID.
     *  @param {number} id
     *  @returns {any}
     */
    getCurrency(id) {
        return Data.Base.get(id, this.currencies, 'currency');
    }
    setCurrency(id, value) {
        const before = this.getCurrency(id) ?? 0;
        this.currencies.set(id, value);
        const dif = Math.abs(value - before);
        if (value > before) {
            Game.current.currenciesEarned.set(id, Game.current.currenciesEarned.get(id) + dif);
        }
        else {
            Game.current.currenciesUsed.set(id, Game.current.currenciesUsed.get(id) + dif);
        }
    }
    addCurrency(id, value) {
        this.currencies.set(id, this.getCurrency(id) + value);
    }
    /**
     *  Get the currency earned by ID.
     *  @param {number} id
     *  @returns {any}
     */
    getCurrencyEarned(id) {
        return Data.Base.get(id, this.currenciesEarned, 'currency earned');
    }
    /**
     *  Get the currency used by ID.
     *  @param {number} id
     *  @returns {any}
     */
    getCurrencyUsed(id) {
        return Data.Base.get(id, this.currenciesUsed, 'currency used');
    }
    /**
     *  Get the hero with instance ID.
     *  @param {number} id - The instance ID
     *  @returns {Player}
     */
    getHeroByInstanceID(id) {
        let hero = Game.getHeroInstanceInTab(this.teamHeroes, id);
        if (hero !== null) {
            return hero;
        }
        hero = Game.getHeroInstanceInTab(this.reserveHeroes, id);
        if (hero !== null) {
            return hero;
        }
        hero = Game.getHeroInstanceInTab(this.hiddenHeroes, id);
        if (hero !== null) {
            return hero;
        }
        if (Scene.Map.current.isBattleMap) {
            return Game.getHeroInstanceInTab(Scene.Map.current.players[CHARACTER_KIND.MONSTER], id);
        }
        return null;
    }
    /**
     *  Use an item and remove it from inventory.
     *  @param {Item} item - The item
     */
    useItem(item) {
        if (!item.use()) {
            this.items.splice(this.items.indexOf(item), 1);
        }
    }
    /**
     *  Get the team according to group kind.
     *  @param {GROUP_KIND} kind - The group kind
     *  @returns {Player[]}
     */
    getTeam(kind) {
        switch (kind) {
            case GROUP_KIND.TEAM:
                return this.teamHeroes;
            case GROUP_KIND.RESERVE:
                return this.reserveHeroes;
            case GROUP_KIND.HIDDEN:
                return this.hiddenHeroes;
            case GROUP_KIND.TROOP:
                return Scene.Map.current.players[CHARACTER_KIND.MONSTER];
        }
    }
    /**
     *  Get the portions datas according to id and position.
     *  @param {number} id - The map id
     *  @param {Portion} portion - The portion
     *  @returns {Record<string, any>}
     */
    getPortionData(id, portion) {
        return this.getPortionPosData(id, portion.x, portion.y, portion.z);
    }
    /**
     *  Get the portions datas according to id and position.
     *  @param {number} id - The map id
     *  @param {number} i
     *  @param {number} j
     *  @param {number} k
     *  @returns {Record<string, any>}
     */
    getPortionPosData(id, i, j, k) {
        let datas = this.mapsData[id];
        if (datas === undefined) {
            return {};
        }
        datas = datas[i];
        if (datas === undefined) {
            return {};
        }
        datas = datas[j < 0 ? 0 : 1];
        if (datas === undefined) {
            return {};
        }
        datas = datas[Math.abs(j)];
        if (datas === undefined) {
            return {};
        }
        datas = datas[k];
        if (datas === undefined) {
            return {};
        }
        return datas;
    }
    /**
     *  Get a chrono ID.
     *  @returns {number}
     */
    getNewChronoID() {
        let id = 0;
        let test = false;
        let chrono;
        while (!test) {
            test = true;
            for (chrono of this.chronometers) {
                if (chrono.id === id) {
                    id++;
                    test = false;
                    break;
                }
            }
        }
        return id;
    }
    /**
     *  Update.
     */
    update() {
        this.playTime.update();
        for (const chrono of this.chronometers) {
            if (chrono.update()) {
                Manager.Events.sendEvent(null, 0, 1, true, 2, Utils.arrayToMap([Model.DynamicValue.createNumber(chrono.id)]), true, false);
            }
        }
    }
    /**
     *  Draw the HUD.
     */
    drawHUD() {
        for (const chrono of this.chronometers) {
            chrono.drawHUD();
        }
    }
}
Game.current = null;
export { Game };
