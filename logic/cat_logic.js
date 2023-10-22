import {Color3} from "@babylonjs/core";
import StandardCat from "../components/cats/standard_cat.js";

const availableCats = [{
    name: "standard",
    color: new Color3(1, 0, 0),
    health: 100,
}]

export let cats = [];

//region Lifecycle
export const initCatLogic = (scene) => {
    // let testcat1 = new StandardCat();
    // testcat1.init(scene, -2, 2, 2);
    // cats.push(testcat1);
}

export const catLogicTick = (scene) => {
    cats.forEach((cat, index) => {
        cat.update(scene);
    });
}
//endregion
