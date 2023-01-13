/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
class ArrayUtils {
    constructor() {
        throw new Error("This is a static class!");
    }
    static removeAt(array, index) {
        array.splice(index, 1);
    }
    static removeElement(array, value) {
        this.removeAt(array, array.indexOf(value));
    }
}
export { ArrayUtils };
