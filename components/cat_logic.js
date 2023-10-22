import {cats} from "../BagelsVersusCats.jsx";
import {Color3, MeshBuilder, Ray, Vector3} from "@babylonjs/core";
import {createBox} from "../utils/debug.js";
import {AdvancedDynamicTexture, Rectangle} from "@babylonjs/gui";
import {GAME_STATES, setGameState} from "./state_logic.js";
import clone from 'just-clone';

const availableCats = [{
    name: "standard",
    color: new Color3(1, 0, 0),
    health: 200,
}]

export const spawnCat = (scene, type, x, y, z) => {
    console.log("Spawning cat: ", type);

    // Create Cat Mesh //
    let catType = clone(availableCats.find((cat) => cat.name === type));
    let newCat = createBox(scene, x, y, z, catType.color, catType.name);
    newCat.type = catType;
    newCat.type.type = "cat";
    newCat.id = crypto.randomUUID();

    // Create Cat Health Bar Mesh //
    let guiPlane = MeshBuilder.CreatePlane("plane", {size: 1}, scene);
    guiPlane.parent = newCat;
    guiPlane.position.y = 1;

    let gui = AdvancedDynamicTexture.CreateForMesh(guiPlane, 200, 100);
    let healthBar = new Rectangle();
    healthBar.width = (newCat.type.health / 100 / 2);
    healthBar.height = "10px";
    healthBar.color = "black";
    healthBar.background = "red";
    healthBar.thickness = 1;
    gui.addControl(healthBar);

    // Add Cat to State //
    cats.push({...newCat, healthBar: healthBar});
}

export const catLogicTick = (scene) => {
    const moveCats = () => {
        cats.forEach((cat, index) => {
            let foundCat = scene.getMeshById(cat.id);
            if (!foundCat) return;

            // Ray Look Ahead //
            let origin = new Vector3(foundCat.position.x, foundCat.position.y, foundCat.position.z - 0.51);
            let forward = new Vector3(0, 0, -1);
            let length = 0.2;
            let ray = new Ray(origin, forward, length);

            // let rayHelper = new RayHelper(ray);
            // rayHelper.show(scene, new Color3(1, 0, 0));

            // Hit Detection //
            let hit = scene.pickWithRay(ray);
            if (hit.pickedMesh && hit.pickedMesh.type && hit.pickedMesh.type.health && hit.pickedMesh.type.type === "bagel") {
                hit.pickedMesh.type.health -= 1;
            } else if (foundCat.position.z - 1 / 200 < -2) {
                // YOU LOSE! //
                setGameState(GAME_STATES.GAME_OVER);
                foundCat.dispose();
                cats.splice(index, 1);
                return;
            } else {
                foundCat.position.z -= 1 / 200;
            }

            // Cat Death Check //
            if (foundCat.type.health <= 0) {
                cats.splice(index, 1);
                foundCat.dispose();
                return;
            }

            // UPDATE HEALTH //
            cat.healthBar.width = (cat.type.health / 100 / 2);
        });
    }

    moveCats();
}
