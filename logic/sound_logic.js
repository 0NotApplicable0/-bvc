import {Sound} from "@babylonjs/core";
import track1 from "../assets/audio/music/track1.ogg";
import bagelsplat from "../assets/audio/bagelsplat.ogg";

let backgroundMusic = null;
let sounds = {};

//region Functions
export const stopBackgroundMusic = () => {
    backgroundMusic.stop();
}
export const startBackgroundMusic = () => {
    backgroundMusic.play();
}
export const playSound = (sound) => {
    sounds[sound].play();
}
//endregion

//region Lifecycle
export const initSoundLogic = (scene) => {
    backgroundMusic = new Sound("backgroundMusic", track1, scene, null, {
        loop: true,
        autoplay: true,
    });

    const bagelSplat = new Sound("bagelSplat", bagelsplat, scene, null, {
        loop: false,
        autoplay: false,
    });

    sounds.bagelSplat = bagelSplat;
}

export const soundLogicTick = (scene) => {

}

export const soundLogicCleanup = (scene) => {

}
//endregion
