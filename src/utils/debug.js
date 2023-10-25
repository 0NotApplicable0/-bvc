import {ActionManager, Color3, ExecuteCodeAction, GizmoManager, KeyboardEventTypes, MeshBuilder, SceneLoader, Texture, Vector3} from "@babylonjs/core";
import {GridMaterial} from "@babylonjs/materials";
import {Inspector} from "@babylonjs/inspector";
import '@babylonjs/loaders';

import bagelStallTexture from "../assets/textures/stall_baseColor.png";
import bagelGroundTexture from "../assets/textures/gound_baseColor.png";
import bagelStand from "../assets/background.glb";
import {addWheat} from "../logic/player_logic.js";
// import bagelStand from "../assets/scene.gltf";
// import bagelStand from "../assets/bread_stall.fbx";

//region Helper functions
export const createBox = (scene, x, y, z, color, name, opacity) => {
    let box = MeshBuilder.CreateBox(name === undefined ? "box" : name, {size: 1}, scene);
    box.position.x = x;
    box.position.z = y;
    box.position.y = z;

    let material = new GridMaterial(name + "_material", scene);
    material.lineColor = new Color3(0.2, 0.2, 0.2);
    material.minorUnitVisibility = 0;
    material.gridOffset = new Vector3(0.5, 0.5, 0.5);
    material.majorUnitFrequency = 0.5;
    material.diffuseColor = new Color3(0.667, 0.4, 0.168);

    material.mainColor = color;
    material.opacity = opacity;
    box.material = material;
    return box;
}

export const createPlatform = (scene) => {
    let ground = []

    for (let x = -2; x < 5; x++) {
        for (let y = -2; y < 8; y++) {
            for (let z = 1; z < 2; z++) {
                let box = MeshBuilder.CreateBox("box", {size: 1}, scene);
                box.position.x = x;
                box.position.z = y;
                box.position.y = z;

                let material = new GridMaterial("ground_material", scene);
                material.lineColor = new Color3(0, 1, 0);
                material.minorUnitVisibility = 0;
                material.gridOffset = new Vector3(0.5, 0.5, 0.5);
                material.majorUnitFrequency = 0.5;
                material.opacity = 0.99;
                material.mainColor = new Color3(0.49, 0.8, 0.05);
                material.diffuseColor = new Color3(0.49, 0.8, 0.05);

                if (y !== 7) ground.push(box);
                box.material = material;
            }
        }
    }

    SceneLoader.ImportMesh(
        '',
        bagelStand,
        '',
        scene,
        function (meshes) {
            let root = meshes[0];
            root.scaling = new Vector3(20, 20, 20);
            root.position = new Vector3(0, -18.5, 0);

            let stall_ground = meshes[0].getChildMeshes()[1];
            let stall = meshes[0].getChildMeshes()[0];

            const stallTex = new Texture(bagelStallTexture);
            const groundTex = new Texture(bagelGroundTexture);

            stall.material.albedoTexture = stallTex
            stall_ground.material.albedoTexture = groundTex
        }
    );

    scene.createDefaultEnvironment({createGround:false, createSkybox:false})

    return ground;
}

export const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
//endregion

let gizmoManager = null;
let debug_char = null;
//region Lifecycle
export const initDebugUtilities = (scene) => {
    gizmoManager = new GizmoManager(scene);
    // debug_char = createBox(scene, 100, 0, 2, new Color3(0, 1, 0));

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
    //endregion

    // debug_char.showLocalAxis();
    // cats.push(crewateBox(scene, -2, 2, 2, new Color3(1, 0, 0)));
    // cats.push(createBox(scene, -1, 2, 2, new Color3(1, 0, 0)));
    // spawnBagel(scene, "standard", -2, -2, 2);
    // spawnBagel(scene, "standard", -1, -2, 2);
    // spawnBagel(scene, "standard", 0, -2, 2);
    // spawnBagel(scene, "standard", 1, -2, 2);
    // spawnBagel(scene, "standard", 2, -2, 2);
    // spawnCat(scene, "standard", -2, 2, 2);
    // spawnCat(scene, "standard", -1, 2, 2);
    // spawnCat(scene, "standard", 0, 2, 2);
    // spawnCat(scene, "standard", 1, 2, 2);
    // spawnCat(scene, "standard", 2, 2, 2);
}

export const debugUtilitiesTick = (scene) => {
    // fullscreen_ui.getControlByName("DebugCharPos").text = "Character Position: " + debug_char.position.x + ", " + debug_char.position.y + ", " + debug_char.position.z;
}
//endregion
