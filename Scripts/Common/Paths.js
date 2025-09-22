/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Platform } from './Platform.js';
/**
 * Centralized registry of engine-relative file and directory paths.
 *
 * All paths are built relative to {@link Platform.ROOT_DIRECTORY}, unless
 * otherwise noted. This class is static-only.
 */
export class Paths {
}
// -------------------------------------------------------------------------
// Generic
// -------------------------------------------------------------------------
/** Prefix for `file://` URLs (used in desktop contexts). */
Paths.FILES = 'file:///';
/** Root test folder. */
Paths.TEST = Platform.ROOT_DIRECTORY + 'Test/';
/** Test configuration JSON. */
Paths.FILE_TEST = Paths.TEST + 'test.json';
/** Protection flag file. */
Paths.FILE_PROTECT = Platform.ROOT_DIRECTORY + '.protect';
// -------------------------------------------------------------------------
// Data JSON files
// -------------------------------------------------------------------------
Paths.FILE_MAPS = Platform.ROOT_DIRECTORY + 'Maps/';
Paths.FILE_MAP_INFOS = '/infos.json';
Paths.FILE_PICTURES = Platform.ROOT_DIRECTORY + 'pictures.json';
Paths.FILE_VIDEOS = Platform.ROOT_DIRECTORY + 'videos.json';
Paths.FILE_FONTS = Platform.ROOT_DIRECTORY + 'fonts.json';
Paths.FILE_SONGS = Platform.ROOT_DIRECTORY + 'songs.json';
Paths.FILE_SHAPES = Platform.ROOT_DIRECTORY + 'shapes.json';
Paths.FILE_COMMON_EVENTS = Platform.ROOT_DIRECTORY + 'commonEvents.json';
Paths.FILE_ITEMS = Platform.ROOT_DIRECTORY + 'items.json';
Paths.FILE_SKILLS = Platform.ROOT_DIRECTORY + 'skills.json';
Paths.FILE_WEAPONS = Platform.ROOT_DIRECTORY + 'weapons.json';
Paths.FILE_ARMORS = Platform.ROOT_DIRECTORY + 'armors.json';
Paths.FILE_HEROES = Platform.ROOT_DIRECTORY + 'heroes.json';
Paths.FILE_MONSTERS = Platform.ROOT_DIRECTORY + 'monsters.json';
Paths.FILE_TROOPS = Platform.ROOT_DIRECTORY + 'troops.json';
Paths.FILE_BATTLE_SYSTEM = Platform.ROOT_DIRECTORY + 'battleSystem.json';
Paths.FILE_TITLE_SCREEN_GAME_OVER = Platform.ROOT_DIRECTORY + 'titlescreenGameover.json';
Paths.FILE_KEYBOARD = Platform.ROOT_DIRECTORY + 'keyboard.json';
Paths.FILE_SYSTEM = Platform.ROOT_DIRECTORY + 'system.json';
Paths.FILE_CLASSES = Platform.ROOT_DIRECTORY + 'classes.json';
Paths.FILE_TILESETS = Platform.ROOT_DIRECTORY + 'tilesets.json';
Paths.FILE_SPECIAL_ELEMENTS = Platform.ROOT_DIRECTORY + 'specialElements.json';
Paths.FILE_VARIABLES = Platform.ROOT_DIRECTORY + 'variables.json';
Paths.FILE_SETTINGS = Platform.ROOT_DIRECTORY + 'settings.json';
Paths.FILE_DLCS = Platform.ROOT_DIRECTORY + 'dlcs.json';
Paths.FILE_ANIMATIONS = Platform.ROOT_DIRECTORY + 'animations.json';
Paths.FILE_STATUS = Platform.ROOT_DIRECTORY + 'status.json';
Paths.FILE_SCRIPTS = Platform.ROOT_DIRECTORY + 'scripts.json';
Paths.FILE_LANGS = Platform.ROOT_DIRECTORY + 'langs.json';
// -------------------------------------------------------------------------
// Asset folders
// -------------------------------------------------------------------------
// Media types
Paths.PICTURES = 'Images';
Paths.VIDEOS = 'Videos';
Paths.FONTS = 'Fonts';
Paths.SONGS = 'Songs/';
Paths.SHAPES = 'Shapes/';
// HUD and UI
Paths.HUD = Paths.PICTURES + '/HUD/';
Paths.TEXTURES2D = Paths.PICTURES + '/Textures2D/';
Paths.BARS = Paths.HUD + 'Bars';
Paths.FACESETS = Paths.HUD + 'Facesets';
Paths.ICONS = Paths.HUD + 'Icons';
Paths.WINDOW_SKINS = Paths.HUD + 'WindowSkins';
Paths.TITLE_SCREEN = Paths.HUD + 'TitleScreen';
Paths.GAME_OVER = Paths.HUD + 'GameOver';
Paths.HUD_PICTURES = Paths.HUD + 'Pictures';
Paths.ANIMATIONS = Paths.HUD + 'Animations';
// Textures
Paths.AUTOTILES = Paths.TEXTURES2D + 'Autotiles';
Paths.CHARACTERS = Paths.TEXTURES2D + 'Characters';
Paths.TILESETS = Paths.TEXTURES2D + 'Tilesets';
Paths.WALLS = Paths.TEXTURES2D + 'Walls';
Paths.BATTLERS = Paths.TEXTURES2D + 'Battlers';
Paths.OBJECTS_3D = Paths.TEXTURES2D + 'Objects3D';
Paths.MOUNTAINS = Paths.TEXTURES2D + 'Mountains';
Paths.SKYBOXES = Paths.TEXTURES2D + 'SkyBoxes';
Paths.PARTICLES = Paths.TEXTURES2D + 'Particles';
// Audio
Paths.MUSICS = Paths.SONGS + 'Musics';
Paths.BACKGROUND_SOUNDS = Paths.SONGS + 'BackgroundSounds';
Paths.SOUNDS = Paths.SONGS + 'Sounds';
Paths.MUSIC_EFFECTS = Paths.SONGS + 'MusicEffects';
// Shapes
Paths.OBJ = Paths.SHAPES + 'OBJ';
Paths.MTL = Paths.SHAPES + 'MTL';
Paths.OBJ_COLLISIONS = Paths.SHAPES + 'Collisions';
// -------------------------------------------------------------------------
// Scripts, plugins, shaders, saves
// -------------------------------------------------------------------------
/** Base path for game scripts (adjusted for web builds). */
Paths.SCRIPTS = (Platform.WEB_DEV && !Platform.IS_DESKTOP
    ? '.' + window.location.pathname
    : Platform.IS_DESKTOP
        ? ''
        : Platform.ROOT_DIRECTORY) + 'Scripts/';
Paths.PLUGINS = Platform.ROOT_DIRECTORY + 'Plugins/';
Paths.SHADERS = Paths.SCRIPTS + 'Shaders/';
Paths.SAVES = Platform.ROOT_DIRECTORY + 'Saves';
Paths.FILE_PLUGIN_CODE = 'code.js';
Paths.FILE_PLUGIN_DETAILS = 'details.json';
