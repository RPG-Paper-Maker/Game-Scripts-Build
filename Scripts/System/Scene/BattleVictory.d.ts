import { Scene } from "../index.js";
declare class BattleVictory {
    battle: Scene.Battle;
    constructor(battle: Scene.Battle);
    /**
     *  Initialize step.
     */
    initialize(): void;
    /**
     *  Prepare the rewards (xp, currencies, loots).
     */
    prepareRewards(): void;
    /**
     *  Update the team progression xp.
     */
    updateTeamXP(): void;
    /**
     *  Pause the team progression xp.
     */
    pauseTeamXP(): void;
    /**
     *  Unpause the team progression xp.
     */
    unpauseTeamXP(): void;
    /**
     *  Play map music.
     */
    playMapMusic(): void;
    /**
     *  Prepare the end transition.
     */
    prepareEndTransition(): void;
    /**
     *  A scene action.
     *  @param {boolean} isKey
     *  @param {{ key?: string, x?: number, y?: number }} [options={}]
     */
    action(isKey: boolean, options?: {
        key?: string;
        x?: number;
        y?: number;
    }): void;
    /**
     *  Update the battle.
     */
    update(): void;
    /**
     *  Handle key pressed.
     *  @param {number} key - The key ID
     */
    onKeyPressedStep(key: string): void;
    /**
     *  Handle key released.
     *  @param {number} key - The key ID
     */
    onKeyReleasedStep(key: string): void;
    /**
     *  Handle key repeat pressed.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedRepeatStep(key: string): boolean;
    /**
     *  Handle key pressed and repeat.
     *  @param {number} key - The key ID
     */
    onKeyPressedAndRepeatStep(key: string): boolean;
    /**
     *  @inheritdoc
     */
    onMouseUpStep(x: number, y: number): void;
    /**
     *  Draw the battle HUD.
     */
    drawHUDStep(): void;
}
export { BattleVictory };
