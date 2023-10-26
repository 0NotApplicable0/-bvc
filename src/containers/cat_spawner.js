import {CURRENT_GAME_STATE, GAME_STATES} from "../logic/state_logic.js";
import {maxPlayableX, maxPlayableY, minPlayableX, randomIntFromInterval} from "../utils/debug.js";
import {cats} from "../logic/cat_logic.js";
import StandardCat from "../components/cats/SKIPPY.js";

let spawnerId = null;
let timeSync = Date.now();
let spawnRow = {y: maxPlayableY, z: 1};

//region Functions
const createCat = (scene, retryCount) => {
    if (retryCount > 5) return;

    // Generate a random x value between -2 and 2 for the cat to spawn at
    let x = randomIntFromInterval(minPlayableX, maxPlayableX);

    // Check if there is already a cat at that x value
    let catAlreadyExists = cats.find((cat) => {
        let foundCat = scene.getMeshById(cat.id);
        if (foundCat === null) return false;

        return foundCat.position.x === x
            && foundCat.position.y === spawnRow.z
            && Math.ceil(foundCat.position.z) === spawnRow.y;
    });

    if (!catAlreadyExists) {
        let newCat = new StandardCat();
        newCat.init(scene, x, spawnRow.y, spawnRow.z);
        cats.push(newCat);
    } else
        createCat(scene, retryCount + 1);
}
//endregion

export const initCatSpawner = (scene) => {
}

export const catSpawnerTick = (scene) => {
    if (CURRENT_GAME_STATE === GAME_STATES.IN_GAME) {
        let timeNow = Date.now();
        let timePassed = (timeNow - timeSync) / 1000;
        if (timePassed >= 3) {
            timeSync = timeNow;
            createCat(scene, 0);
        }
    }
}

export const catSpawnerCleanup = (scene) => {
    clearInterval(spawnerId);
}
