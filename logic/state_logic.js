import {TextBlock} from "@babylonjs/gui";
import {createBox, randomIntFromInterval} from "../utils/debug.js";
import {ActionManager, Color3, ExecuteCodeAction, PointerEventTypes, Vector3} from "@babylonjs/core";
import {addWheat} from "./player_logic.js";
import {fullscreen_ui} from "./ui_logic.js";

// Used for react component cleanup, not related to the game //
let localIntervals = [];

//region Game States and Statuses
export const GAME_STATES = {
    LOADING: "LOADING",
    MAIN_MENU: "MAIN_MENU",
    IN_GAME: "IN_GAME",
    PAUSED: "PAUSED",
    GAME_OVER: "GAME_OVER",
}
export let CURRENT_GAME_STATE = GAME_STATES.IN_GAME;
export let HAS_WHEAT_DROP_STARTED = false;
//endregion

//region Game State Functions
export const setGameState = (newGameState) => {
    CURRENT_GAME_STATE = newGameState;
}

export const collectWheat = (wheat) => {
    addWheat(1);
    wheat.dispose();
}

export const startWheatDrops = (scene) => {
    let wheatDropId = null;

    const dropWheat = () => {
        let x = randomIntFromInterval(-2, 2);
        let y = randomIntFromInterval(-2, 2);
        let wheat = createBox(scene, x, y, 16, new Color3(1, 0.8, 0.2), "wheat");
        wheat.scaling = new Vector3(0.2, 1, 0.2);

        wheat.actionManager = new ActionManager(scene);
        wheat.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPickTrigger,
                (evt) => {
                    collectWheat(wheat);
                }
            )
        );

        let wheatDropper = setInterval(() => {
            // Make wheat fall and check if it hits the ground //
            if (wheat.position.y <= 2) {
                wheat.dispose();
            } else {
                wheat.position.y -= 0.5;
            }
        }, 500);
        localIntervals.push(wheatDropper);
    }


    wheatDropId = setInterval(() => {
        dropWheat();
    }, 5000);

    return wheatDropId;
}
//endregion

//region Lifecycle
export const initStateLogic = (scene) => {}

export const stateLogicTick = (scene) => {
    if (CURRENT_GAME_STATE === GAME_STATES.GAME_OVER) {
        let gameOver = new TextBlock();
        gameOver.name = "GameOver";
        gameOver.text = "GAME OVER";
        gameOver.color = "#1A202C";
        gameOver.fontFamily = "JetBrains Mono";
        gameOver.fontSize = 32;
        fullscreen_ui.addControl(gameOver);
    } else if (CURRENT_GAME_STATE === GAME_STATES.IN_GAME) {
        if (!HAS_WHEAT_DROP_STARTED) {
            let wheatDropId = startWheatDrops(scene);
            localIntervals.push(wheatDropId);
            HAS_WHEAT_DROP_STARTED = true;
        }
    }
}

export const stateLogicCleanup = () => {
    localIntervals.forEach((interval) => {
        clearInterval(interval);
    });
    localIntervals = [];
}
//endregion
