import {Rectangle, TextBlock} from "@babylonjs/gui";
import {createBox, randomIntFromInterval} from "../utils/debug.js";
import {ActionManager, Color3, ExecuteCodeAction, KeyboardEventTypes, Vector3} from "@babylonjs/core";
import {addWheat} from "./player_logic.js";
import {addControlToUi, addTextToUi, fullscreen_ui} from "./ui_logic.js";
import {startBackgroundMusic, stopBackgroundMusic} from "./sound_logic.js";

// Used for react component cleanup, not related to the game //
let localIntervals = [];

//region Local Variables
let ticker = 0;
let wheats = [];
//endregion

//region Game States and Statuses
export const GAME_STATES = {
    LOADING: "LOADING",
    MAIN_MENU: "MAIN_MENU",
    IN_GAME: "IN_GAME",
    PAUSED: "PAUSED",
    GAME_OVER: "GAME_OVER",
}
export let CURRENT_GAME_STATE = GAME_STATES.IN_GAME;
export let CURRENT_WAVE = 0;
export let HAS_WHEAT_DROP_STARTED = false;
//endregion

//region Game State Functions
export const setGameState = (newGameState) => {
    CURRENT_GAME_STATE = newGameState;
}

export const endGame = () => {
    CURRENT_GAME_STATE = GAME_STATES.GAME_OVER;

    stopBackgroundMusic();

    addTextToUi("GameOver", "GAME OVER", "#1A202C", 32, "JetBrains Mono");
}

export const pauseGame = () => {
    CURRENT_GAME_STATE = GAME_STATES.PAUSED;

    stopBackgroundMusic();

    let gamePaused = new TextBlock();
    gamePaused.name = "GamePaused";
    gamePaused.text = "GAME PAUSED";
    gamePaused.color = "#1A202C";
    gamePaused.fontFamily = "JetBrains Mono";
    gamePaused.fontSize = 32;
    fullscreen_ui.addControl(gamePaused);
}

export const unpauseGame = () => {
    CURRENT_GAME_STATE = GAME_STATES.IN_GAME;

    startBackgroundMusic();

    fullscreen_ui.getControlByName("GamePaused").dispose();
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

        wheats.push(wheat);

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
                addWheat(1);
                wheat.dispose(false, true);
                wheats.splice(wheats.indexOf(wheat), 1);
                clearInterval(wheatDropper);
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
export const initStateLogic = (scene) => {
    // Wave Display UI //
    let waveProgress = new Rectangle();
    waveProgress.name = "WaveProgress";
    waveProgress.width = 0;
    waveProgress.height = "10px";
    waveProgress.color = "black";
    waveProgress.background = "red";
    waveProgress.thickness = 1;
    waveProgress.top = "50%";
    addControlToUi(waveProgress);

    scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
            case KeyboardEventTypes.KEYDOWN:
                if (kbInfo.event.code === "Space") {
                    if (CURRENT_GAME_STATE === GAME_STATES.IN_GAME) {
                        pauseGame();
                        console.log("Pausing Game...");
                    } else if (CURRENT_GAME_STATE === GAME_STATES.PAUSED) {
                        unpauseGame();
                        console.log("Resuming Game...");
                    }
                }
                break;
        }
    });
}

export const stateLogicTick = (scene) => {
}

export const stateLogicCleanup = () => {
    localIntervals.forEach((interval) => {
        clearInterval(interval);
    });

    wheats.forEach((wheat) => {
        wheat.dispose(false, true);
    });

    wheats = [];
    localIntervals = [];
}
//endregion
