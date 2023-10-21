import {Color3, GizmoManager, KeyboardEventTypes, MeshBuilder, PointerEventTypes, Vector3} from "@babylonjs/core";
import {GridMaterial} from "@babylonjs/materials";
import {bagels, board} from "../BagelsVersusCats.jsx";
import {AdvancedDynamicTexture, TextBlock} from "@babylonjs/gui";
import {Inspector} from "@babylonjs/inspector";
import {spawnBagel} from "../components/bagel_logic.js";
import {spawnCat} from "../components/cat_logic.js";

//region Helper functions
export const createBox = (scene, x, y, z, color, name) => {
    let box = MeshBuilder.CreateBox(name === undefined ? "box" : name, {size: 1}, scene);
    box.position.x = x;
    box.position.z = y;
    box.position.y = z;

    let material = new GridMaterial("myMaterial", scene);
    material.lineColor = new Color3(0.2, 0.2, 0.2);
    material.minorUnitVisibility = 0;
    material.gridOffset = new Vector3(0.5, 0.5, 0.5);
    material.majorUnitFrequency = 0.5;
    material.diffuseColor = new Color3(0.667, 0.4, 0.168);

    material.mainColor = color;
    box.material = material;
    return box;
}

export const createPlatform = (scene) => {
    let ground = []

    for (let x = -2; x < 3; x++) {
        for (let y = -2; y < 3; y++) {
            for (let z = 0; z < 2; z++) {
                let box = MeshBuilder.CreateBox("box", {size: 1}, scene);
                box.position.x = x;
                box.position.z = y;
                box.position.y = z;

                // box.enableEdgesRendering();
                // box.edgesColor = new Color4(0, 0, 0, 1);
                // box.edgesWidth = 3;

                let material = new GridMaterial("myMaterial", scene);
                material.lineColor = new Color3(0.2, 0.2, 0.2);
                material.minorUnitVisibility = 0;
                material.gridOffset = new Vector3(0.5, 0.5, 0.5);
                material.majorUnitFrequency = 0.5;

                if (z == 1) {
                    material.mainColor = new Color3(0.49, 0.8, 0.05);
                    material.diffuseColor = new Color3(0.49, 0.8, 0.05);
                    if (y !== 2) ground.push(box);
                } else {
                    material.mainColor = new Color3(0.667, 0.4, 0.168);
                    material.diffuseColor = new Color3(0.667, 0.4, 0.168);
                }
                // material.ambientColor = new Color3(0.0, 0.0, 0.0);
                // material.specularColor = new Color3(0,0,0);

                box.material = material;
            }
        }
    }

    return ground;
}

export const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
//endregion

let gizmoManager = null;
let debug_char = null;
export let fullscreen_ui = null;

export const initDebugUtilities = (scene) => {
    gizmoManager = new GizmoManager(scene);
    debug_char = createBox(scene, 100, 0, 2, new Color3(0, 1, 0));
    fullscreen_ui = AdvancedDynamicTexture.CreateFullscreenUI("myUI");

    //region Display debug_char position
    // let debugCharPos = new TextBlock();
    // debugCharPos.name = "DebugCharPos";
    // debugCharPos.text = "Character Position: " + debug_char.position.x + ", " + debug_char.position.y + ", " + debug_char.position.z;
    // debugCharPos.color = "#1A202C";
    // debugCharPos.fontFamily = "JetBrains Mono";
    // debugCharPos.top = "-350px";
    // debugCharPos.fontSize = 24;
    // fullscreen_ui.addControl(debugCharPos);
    //endregion

    //region Inputs for debug utilities
    scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
            case KeyboardEventTypes.KEYDOWN:
                switch (kbInfo.event.key) {
                    case "`":
                        if (scene.debugLayer.isVisible()) {
                            Inspector.Hide();
                        } else {
                            Inspector.Show(scene, {});
                        }
                        break;
                    case "a":
                    case "A":
                        // if (debug_char.position.x + 1 > 2 || debug_char.position.x + 1 < -2) return;
                        debug_char.position.x += 1;
                        break
                    case "d":
                    case "D":
                        // if (debug_char.position.x - 1 > 2 || debug_char.position.x - 1 < -2) return;
                        debug_char.position.x -= 1;
                        break
                    case "w":
                    case "W":
                        // if (debug_char.position.z - 1 > 2 || debug_char.position.z - 1 < -2) return;
                        debug_char.position.z -= 1;
                        break
                    case "s":
                    case "S":
                        // if (debug_char.position.z + 1 > 2 || debug_char.position.z + 1 < -2) return;
                        debug_char.position.z += 1;
                        break
                }
                break;
        }
    });
    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case PointerEventTypes.POINTERDOWN:
                if(pointerInfo.pickInfo.hit && bagels.find((mesh) => mesh.id === pointerInfo.pickInfo.pickedMesh.id)) {
                    bagels.find((mesh) => mesh.id === pointerInfo.pickInfo.pickedMesh.id).type.health -= 50;
                }
                break;
        }
    });
    //endregion

    // debug_char.showLocalAxis();
    // cats.push(crewateBox(scene, -2, 2, 2, new Color3(1, 0, 0)));
    // cats.push(createBox(scene, -1, 2, 2, new Color3(1, 0, 0)));
    spawnBagel(scene, "standard", -2, -2, 2);
    spawnBagel(scene, "standard", -1, -2, 2);
    spawnBagel(scene, "standard", 0, -2, 2);
    spawnBagel(scene, "standard", 1, -2, 2);
    spawnBagel(scene, "standard", 2, -2, 2);
    spawnCat(scene, "standard", -2, 2, 2);
    spawnCat(scene, "standard", -1, 2, 2);
    spawnCat(scene, "standard", 0, 2, 2);
    spawnCat(scene, "standard", 1, 2, 2);
    spawnCat(scene, "standard", 2, 2, 2);

}

export const debugUtilitiesTick = (scene) => {
    // fullscreen_ui.getControlByName("DebugCharPos").text = "Character Position: " + debug_char.position.x + ", " + debug_char.position.y + ", " + debug_char.position.z;
}
