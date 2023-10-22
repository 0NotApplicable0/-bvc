import {bagels} from "../BagelsVersusCats.jsx";
import {Color3, MeshBuilder, Ray, RayHelper, Vector3} from "@babylonjs/core";
import {createBox} from "../utils/debug.js";
import {AdvancedDynamicTexture, Rectangle} from "@babylonjs/gui";
import clone from "just-clone";

export const availableBagels = [{
    name: "standard",
    color: new Color3(0.337, 0.8, 0.468),
    health: 500,
    damage: 25,
}, {
    name: "sesame",
    color: new Color3(0.87, 0.5, 0.128),
    health: 100,
    damage: 15,
}, {
    name: "everything",
    color: new Color3(0.647, 0.4, 0.128),
    health: 100,
    damage: 15,
}, {
    name: "poppy",
    color: new Color3(0.17, 0.4, 0.168),
    health: 100,
    damage: 15,
}]

const fireProjectile = (scene, bagel) => {
    let operatingBagel = scene.getMeshById(bagel.id)

    let projectile = createBox(scene, operatingBagel.position.x, operatingBagel.position.z + 0.8, operatingBagel.position.y, new Color3(0, 0, 1), "projectile");
    projectile.scaling = new Vector3(0.2, 0.2, 0.2);

    // Projectile Loop //
    let projectileLoop = setInterval(() => {
        // Ray Look Ahead //
        let origin = new Vector3(projectile.position.x, projectile.position.y, projectile.position.z + 0.11);
        let forward = new Vector3(0, 0, 1);
        let length = 0.05;
        let ray = new Ray(origin, forward, length);

        // let rayHelper = new RayHelper(ray);
        // rayHelper.show(scene, new Color3(1, 0, 0));

        // Hit Detection //
        let hit = scene.pickWithRay(ray);
        if (hit.pickedMesh && hit.pickedMesh.type && hit.pickedMesh.type.health) {
            hit.pickedMesh.type.health -= bagel.type.damage;
            projectile.dispose();
            clearInterval(projectileLoop);
        } else if (projectile.position.z + 0.01 > 2) {
            projectile.dispose();
            clearInterval(projectileLoop);
        } else {
            projectile.position.z += 0.01;
        }
    }, 10);
}

const bagelActionTick = (scene, bagel) => {
    let timeNow = Date.now();
    let timePassed = (timeNow - bagel.timeThen) / 1000;
    if (timePassed >= 1) {
        bagel.timeThen = timeNow;
        fireProjectile(scene, bagel);
    }
}

export const spawnBagel = (scene, type, x, y, z) => {
    // Create Bagel Mesh //
    let bagelType = clone(availableBagels.find((bagel) => bagel.name === type));
    let newBagel = createBox(scene, x, y, z, bagelType.color, bagelType.name);
    newBagel.type = bagelType;
    newBagel.type.type = "bagel";
    newBagel.id = crypto.randomUUID();

    // Create Bagel Health Bar Mesh //
    let guiPlane = MeshBuilder.CreatePlane("plane", {size: 1}, scene);
    guiPlane.parent = newBagel;
    guiPlane.position.y = 1;

    let gui = AdvancedDynamicTexture.CreateForMesh(guiPlane, 200, 100);
    let healthBar = new Rectangle();
    healthBar.width = (newBagel.type.health / 100 / 2);
    healthBar.height = "10px";
    healthBar.color = "black";
    healthBar.background = "red";
    healthBar.thickness = 1;
    gui.addControl(healthBar);

    // Add Bagel to State //
    bagels.push({...newBagel, healthBar: healthBar, timeThen: Date.now(), actionTick: bagelActionTick});
}

export const bagelLogicTick = (scene) => {
    // Update Bagel Health
    bagels.forEach((bagel, index) => {
        // console.log("bagel", bagel.id);

        let operatingBagel = scene.getMeshById(bagel.id)

        // Bagel Death Check //
        if (bagel.type.health <= 0) {
            console.log("actionId", bagel.actionId);
            bagel.actionId && clearInterval(bagel.actionId);
            operatingBagel.dispose();
            bagels.splice(index, 1);
            return;
        }

        // Bagel Row Check //
        let origin = new Vector3(operatingBagel.position.x, operatingBagel.position.y - 0.2, operatingBagel.position.z + 0.51);
        let forward = new Vector3(0, 0, 1);
        let length = 8;
        let ray = new Ray(origin, forward, length);

        // let rayHelper = new RayHelper(ray);
        // rayHelper.show(scene, new Color3(1, 0, 0));

        let hit = scene.pickWithRay(ray);
        if (hit.pickedMesh && hit.pickedMesh.type && hit.pickedMesh.type.health && hit.pickedMesh.type.type === "cat") {
            // console.log("actionTick fired for: ", bagel.id);
            bagel.actionTick && bagel.actionTick(scene, bagel);
        }

        // UPDATE HEALTH //
        bagel.healthBar.width = (bagel.type.health / 100 / 2);
    });
}
