/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Data, Manager } from "../index.js";
import { Paths, PICTURE_KIND, Platform } from '../Common/index.js';
import { Picture2D } from '../Core/index.js';
import { Picture } from '../Model/index.js';
import { Base } from './Base.js';
/**
 * Handles all picture data.
 */
export class Pictures {
    /**
     * Get a picture by kind and ID.
     */
    static get(kind, id, errorMessage) {
        if (kind === PICTURE_KIND.NONE || id === -1) {
            return new Picture();
        }
        return Base.get(id, this.list.get(kind), `picture ${Picture.pictureKindToString(kind)}`, true, errorMessage);
    }
    /**
     * Get all pictures of a given kind.
     */
    static getListByKind(kind) {
        return this.list.get(kind);
    }
    /**
     * Get a copy of a 2D picture.
     */
    static getPictureCopy(kind, id) {
        const picture = this.get(kind, id);
        return picture?.picture ? picture.picture.createCopy() : new Picture2D();
    }
    /**
     *  Load textures (for characters and battlers).
     */
    static async loadTextures(pictureKind, texturesName) {
        const pictures = this.getListByKind(pictureKind);
        const textures = new Map();
        textures.set(0, Manager.GL.loadTextureEmpty());
        for (const [id, picture] of pictures.entries()) {
            if (picture) {
                const path = picture.getPath();
                textures.set(id, path ? await Manager.GL.loadTexture(path) : Manager.GL.loadTextureEmpty());
            }
            else {
                textures.set(id, Manager.GL.loadTextureEmpty());
            }
        }
        this[texturesName] = textures;
    }
    static async ensureTextures() {
        if (!this.texturesCharacters) {
            await this.loadTextures(PICTURE_KIND.CHARACTERS, this.PROPERTY_TEXTURES_CHARACTERS);
        }
        if (!this.texturesBattlers) {
            await this.loadTextures(PICTURE_KIND.BATTLERS, this.PROPERTY_TEXTURES_BATTLERS);
        }
    }
    /**
     * Read the JSON file associated with pictures.
     */
    static async readTitleScreen() {
        const windowSkin = Data.Systems.getCurrentWindowSkin();
        const selected = new Map([
            [PICTURE_KIND.WINDOW_SKINS, new Set([windowSkin.pictureID])],
        ]);
        if (Data.TitlescreenGameover.isTitleBackgroundImage) {
            selected.set(PICTURE_KIND.TITLE_SCREEN, new Set([Data.TitlescreenGameover.titleBackgroundImageID]));
        }
        await this.readSelected(selected);
    }
    /** Read all pictures, including assets deferred until the game starts. */
    static async read() {
        await this.readSelected();
    }
    /** Read only the requested pictures, or every picture when no selection is supplied. */
    static async readSelected(selected) {
        const json = (await Platform.parseFileJSON(Paths.FILE_PICTURES));
        this.list = new Map();
        for (const jsonHash of json.list) {
            const k = jsonHash.k;
            const jsonList = jsonHash.v;
            const list = new Map();
            for (const jsonPicture of jsonList) {
                const id = jsonPicture.id ?? 0;
                if (id === 0 || id === -1) {
                    continue;
                }
                if (selected && !selected.get(k)?.has(id)) {
                    continue;
                }
                const picture = new Picture(jsonPicture);
                picture.kind = k;
                await picture.checkBase64();
                if (k !== PICTURE_KIND.NONE) {
                    await picture.load();
                    if (k === PICTURE_KIND.BARS) {
                        picture.checkBarBorder();
                    }
                }
                list.set(id, picture);
            }
            this.list.set(k, list);
        }
    }
}
Pictures.PROPERTY_TEXTURES_CHARACTERS = 'texturesCharacters';
Pictures.PROPERTY_TEXTURES_BATTLERS = 'texturesBattlers';
