/*!
RPG Paper Maker Copyright (C) 2017-2026 Wano

RPG Paper Maker engine is under proprietary license.
This source code is also copyrighted.

Use Commercial edition for commercial use of your games.
See RPG Paper Maker EULA here:
http://rpg-paper-maker.com/index.php/eula.

Original TypeScript sources are available in the src folder next to this file.
*/
import{IO}from"../main.js";var _Platform,firstError=!0,Platform=class Platform{static setWindowTitle(title){window.ipcRenderer.send(`change-window-title`,title)}static setWindowSize(w,h,fullscreen){window.ipcRenderer.send(`change-window-size`,w,h,fullscreen)}static quit(){window.close()}static async fileExists(path){return IO.fileExists(path)}static async loadFile(path,forcePath=!1){return forcePath&&(path=Platform.ROOT_DIRECTORY+`/`+path),IO.openFile(path)}static async parseFileJSON(path){return IO.parseFileJSON(path)}static async loadSave(_slot,path){return await IO.fileExists(path)?Platform.parseFileJSON(path):null}static async registerSave(_slot,path,json){await IO.saveFile(path,json)}static async writeFile(path,json){await IO.saveFile(path,json)}static showError(e){Platform.showErrorMessage(`${e.message}\n${e.stack}`,!1)}static showErrorMessage(msg,displayDialog=!0){if(firstError)throw firstError=!1,window.ipcRenderer.send(`window-error`,msg),displayDialog&&window.ipcRenderer.send(`dialog-error-message`,msg),Error(msg)}static isModeTestNormal(){return!0}};_Platform=Platform,_Platform.ROOT_DIRECTORY=`./build/`,_Platform.IS_DESKTOP=!0,_Platform.WEB_DEV=!1,_Platform.MODE_TEST=void 0,_Platform.MODE_TEST_BATTLE_TROOP=`battleTroop`,_Platform.MODE_TEST_SHOW_TEXT_PREVIEW=`showTextPreview`,_Platform.screenWidth=window.screen.width,_Platform.screenHeight=window.screen.height,_Platform.canvas3D=document.getElementById(`three-d`),_Platform.canvasHUD=document.getElementById(`hud`),_Platform.canvasHUDBelow=document.getElementById(`hud-below`),_Platform.canvasVideos=document.getElementById(`video-container`),_Platform.canvasRendering=document.getElementById(`rendering`),_Platform.ctx=_Platform.canvasHUD.getContext(`2d`,{willReadFrequently:!0}),_Platform.ctxBelow=_Platform.canvasHUDBelow.getContext(`2d`,{willReadFrequently:!0}),_Platform.ctxr=_Platform.canvasRendering.getContext(`2d`,{willReadFrequently:!0});export{Platform};
//# sourceMappingURL=Platform.js.map