import {AdvancedDynamicTexture, TextBlock} from "@babylonjs/gui";
import {fullscreen_ui} from "../utils/debug.js";

export const GAME_STATES = {
    LOADING: "LOADING",
    MAIN_MENU: "MAIN_MENU",
    IN_GAME: "IN_GAME",
    PAUSED: "PAUSED",
    GAME_OVER: "GAME_OVER",
}

export let CURRENT_GAME_STATE = GAME_STATES.IN_GAME;

export const setGameState = (newGameState) => {
    CURRENT_GAME_STATE = newGameState;
}

export const stateLogicTick = (scene) => {
    if(CURRENT_GAME_STATE === GAME_STATES.GAME_OVER){
        let gameOver = new TextBlock();
        gameOver.name = "GameOver";
        gameOver.text = "GAME OVER";
        gameOver.color = "#1A202C";
        gameOver.fontFamily = "JetBrains Mono";
        gameOver.fontSize = 32;
        fullscreen_ui.addControl(gameOver);
    }
}
