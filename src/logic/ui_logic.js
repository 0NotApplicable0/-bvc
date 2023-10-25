import {AdvancedDynamicTexture, TextBlock} from "@babylonjs/gui";
import {PLAYER_WHEAT} from "./player_logic.js";

export let fullscreen_ui = null;

//region Functions
export const addControlToUi = (control) => {
    if (fullscreen_ui.getControlByName(control.name)) {
        console.error("Control with name " + control.name + " already exists!");
        return;
    }

    fullscreen_ui.addControl(control);
}
export const addTextToUi = (name, text, color, fontSize, fontFamily) => {
    if (fullscreen_ui.getControlByName(name)) {
        console.error("Control with name " + name + " already exists!");
        return;
    }

    let newText = new TextBlock();
    newText.name = name;
    newText.text = text;
    newText.color = color;
    newText.fontFamily = fontFamily;
    newText.fontSize = fontSize;
    fullscreen_ui.addControl(newText);
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

export const cleanupUiLogic = (scene) => {
    fullscreen_ui.dispose();
}
//endregion
