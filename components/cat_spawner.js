import {createBox, randomIntFromInterval} from "../utils/test_utilities.js";
import {Color3} from "@babylonjs/core";

export const initCatSpawner = (scene) => {
    let spawnRow = {y: 2, z: 2};
    let cats = [];

    const createMovementHandler = (cat) => {
        let handlerId = setInterval(() => {
            cat.position.z -= 1;
            if (cat.position.z < -2) {
                cat.dispose();
                clearInterval(handlerId);
            }
        }, 1000);
    }

    const spawnCat = () => {
        // Generate a random x value between -2 and 2 for the cat to spawn at
        let x = randomIntFromInterval(-2, 2);

        // Check if there is already a cat at that x value
        let catAlreadyExists = cats.find((cat) => (cat.position.x === x
            && cat.position.y === spawnRow.y
            && cat.position.z === spawnRow.z));

        // If there is no cat at that x value, spawn a cat there
        if (!catAlreadyExists) {
            let cat = createBox(scene, x, spawnRow.z, spawnRow.y, new Color3(1, 0, 0), "cat");
            cats.push(cat);
            createMovementHandler(cat);
        }
        else {
            // If there is a cat at that x value, try again
            spawnCat();
        }
    }

    // Every 2 seconds, spawn a cat
    setInterval(() => {
        spawnCat();
    }, 2000);
}
