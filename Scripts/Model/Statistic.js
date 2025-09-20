/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Utils } from '../Common/index.js';
import { Localization } from './Localization.js';
/**
 * A statistic of the game.
 */
export class Statistic extends Localization {
    constructor(json) {
        super(json);
        this.suffixName = '';
    }
    /**
     * Create an element resistance statistic.
     */
    static createElementRes(id) {
        const stat = new Statistic();
        stat.suffixName = ' res.';
        stat.abbreviation = `elres${id}`;
        stat.isFix = true;
        stat.isRes = true;
        return stat;
    }
    /**
     * Create an element resistance percentage statistic.
     */
    static createElementResPercent(id, name) {
        const stat = new Statistic();
        stat.suffixName = `${name} res.(%)`;
        stat.abbreviation = `elresp${id}`;
        stat.isFix = true;
        stat.isRes = true;
        return stat;
    }
    /**
     * Get the localized name with suffix.
     */
    name() {
        return super.name() + this.suffixName;
    }
    /**
     *  Get the max abbreviation.
     */
    getMaxAbbreviation() {
        return `max${this.abbreviation}`;
    }
    /**
     *  Get the before abbreviation.
     */
    getBeforeAbbreviation() {
        return `before${this.abbreviation}`;
    }
    /**
     *  Get the bonus abbreviation.
     */
    getBonusAbbreviation() {
        return `bonus${this.abbreviation}`;
    }
    /**
     *  Get the added abbreviation.
     */
    getAddedAbbreviation() {
        return `added${this.abbreviation}`;
    }
    /**
     *  Get the "next" abbreviation depending on if it's fixed.
     */
    getAbbreviationNext() {
        return this.isFix ? this.abbreviation : this.getMaxAbbreviation();
    }
    /**
     * Read the JSON data into this statistic.
     */
    read(json) {
        super.read(json);
        this.abbreviation = json.abr;
        this.isFix = json.fix;
        this.pictureBarID = Utils.valueOrDefault(json.pid, -1);
    }
}
