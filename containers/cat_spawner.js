import {randomIntFromInterval} from "../utils/debug.js";
import {cats, gameState} from "../BagelsVersusCats.jsx";
import {spawnCat} from "../components/cat_logic.js";
import {CURRENT_GAME_STATE, GAME_STATES} from "../components/state_logic.js";

let spawnerId = null;
export const initCatSpawner = (scene) => {
    let spawnRow = {y: 2, z: 2};

    const createCat = () => {
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

        if (!catAlreadyExists)
            spawnCat(scene, "standard", x, spawnRow.z, spawnRow.y);
        else
            createCat();
    }

    // Every 5 seconds, spawn a cat
    spawnerId = setInterval(() => {
        createCat();
    }, 2000);
}

export const catSpawnerTick = (scene) => {
    if(CURRENT_GAME_STATE === GAME_STATES.GAME_OVER) clearInterval(spawnerId);
}
