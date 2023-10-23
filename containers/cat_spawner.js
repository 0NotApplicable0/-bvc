import {CURRENT_GAME_STATE, GAME_STATES} from "../logic/state_logic.js";
import {randomIntFromInterval} from "../utils/debug.js";
import {cats} from "../logic/cat_logic.js";
import StandardCat from "../components/cats/standard_cat.js";

let spawnerId = null;
export const initCatSpawner = (scene) => {
    let spawnRow = {y: 2, z: 2};

    const createCat = (retryCount) => {
        if(retryCount > 5) return;

        // Generate a random x value between -2 and 2 for the cat to spawn at
        let x = randomIntFromInterval(-2, 2);

        // Check if there is already a cat at that x value
        let catAlreadyExists = cats.find((cat) => {
            let foundCat = scene.getMeshById(cat.id);
            if(foundCat === null) return false;
            return foundCat.position.x === x
                && foundCat.position.y === spawnRow.y
                && Math.ceil(foundCat.position.z) === 2;
        });

        if (!catAlreadyExists){
            let newCat = new StandardCat();
            newCat.init(scene, x, spawnRow.y, spawnRow.z);
            cats.push(newCat);
        }
        else
            createCat(retryCount + 1);
    }

    // Every 5 seconds, spawn a cat
    spawnerId = setInterval(() => {
        createCat(0);
    }, 1000);
}

export const catSpawnerTick = (scene) => {
    if (CURRENT_GAME_STATE === GAME_STATES.GAME_OVER) clearInterval(spawnerId);
}

export const catSpawnerCleanup = (scene) => {
    clearInterval(spawnerId);
}
