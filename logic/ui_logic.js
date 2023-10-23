import {AdvancedDynamicTexture, TextBlock} from "@babylonjs/gui";
import {PLAYER_WHEAT} from "./player_logic.js";

export let fullscreen_ui = null;

//region Functions
export const addToUi = (control) => {
    fullscreen_ui.addControl(control);
}
//endregion

//region Lifecycle
export const initUiLogic = (scene) => {
    fullscreen_ui = AdvancedDynamicTexture.CreateFullscreenUI("myUI");

    let wheatCounter = new TextBlock();
    wheatCounter.name = "WheatCounter";
    wheatCounter.text = "Current Wheat: " + PLAYER_WHEAT;
    wheatCounter.color = "#1A202C";
    wheatCounter.fontFamily = "JetBrains Mono";
    wheatCounter.top = "-350px";
    wheatCounter.left = "-600px";
    wheatCounter.fontSize = 24;

    // ADD CONTROLS //
    fullscreen_ui.addControl(wheatCounter);
}

export const uiLogicTick = (scene) => {
    let wheatCounter = fullscreen_ui.getControlByName("WheatCounter");
    wheatCounter.text = "Current Wheat: " + PLAYER_WHEAT;
}
//endregion
