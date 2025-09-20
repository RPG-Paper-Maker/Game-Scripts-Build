/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
/**
 * Abstract superclass that defines the structure for all Model classes.
 * Model classes are responsible for reading and representing game data
 * stored in JSON format. This base class enforces the implementation
 * of a `read` method to populate the instance with JSON data.
 */
export class Base {
    /**
     * Creates an instance of a Model class.
     * If JSON data is provided, it automatically calls {@link Base.read}.
     * @param json - Optional JSON object used to initialize the class.
     */
    constructor(json) {
        if (json) {
            this.read(json);
        }
    }
}
