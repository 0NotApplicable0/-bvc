import {useEffect, useRef, useState} from "react";
import {Color3, Color4, GizmoManager, Mesh, PointerEventTypes} from "@babylonjs/core";
import {cameraSetup} from "./utils/camera_controls.js";
import {createBox, createPlatform} from "./utils/test_utilities.js";
import {inputSetup} from "./utils/input_manager.js";
import "./styles.css";
import {Debug} from "@babylonjs/core/Legacy/legacy.js";
import {SceneManager} from "./components/SceneManager.jsx";
import {initBuyMenu} from "./components/buy_menu.js";
import {AdvancedDynamicTexture, TextBlock} from "@babylonjs/gui";
import {initCatSpawner} from "./components/cat_spawner.js";
import {boardRender} from "./components/board_manager.js";

//region PROTOTYPES
Mesh.prototype.showLocalAxis = function () {
    this.axisViewer = new Debug.AxesViewer(this.getScene(), 1);
    this.axisViewer.xAxis.parent = this;
    this.axisViewer.yAxis.parent = this;
    this.axisViewer.zAxis.parent = this;
};

Mesh.prototype.hideLocalAxis = function () {
    this.axisViewer.dispose();
};
//endregion

//region STATE
export let board = [];
export let ground = null;
//endregion

export default function BagelsVersusCats() {
    let debug_char = null;
    let gui = null;

    /**
     * Will run when the scene is ready
     */
    const onSceneReady = (scene) => {
        const canvas = scene.getEngine().getRenderingCanvas();
        const camera = cameraSetup(scene, canvas);

        // SCENE GENERATION //
        ground = createPlatform(scene);

        // COMPONENT SETUP //
        initBuyMenu(scene, camera, canvas);
        // initCatSpawner(scene);

        // SCENE SETUP //
        scene.clearColor = new Color4(1, 1, 1, 1);

        // DEBUG //
        const gizmoManager = new GizmoManager(scene);
        debug_char = createBox(scene, 0, 0, 2, new Color3(0, 1, 0));
        // debug_char.showLocalAxis();
        // cats.push(crewateBox(scene, -2, 2, 2, new Color3(1, 0, 0)));
        // cats.push(createBox(scene, -1, 2, 2, new Color3(1, 0, 0)));

        scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case PointerEventTypes.POINTERDOWN:
                    console.log("Pointer Down: ", pointerInfo.pickInfo.pickedMesh);
                    console.log("Board: ", board);
                    if(pointerInfo.pickInfo.hit && board.find((mesh) => mesh.id === pointerInfo.pickInfo.pickedMesh.id)) {
                        console.log("Damage To: ", pointerInfo.pickInfo.pickedMesh.name);
                        board.find((mesh) => mesh.id === pointerInfo.pickInfo.pickedMesh.id).type.health -= 10;
                    }
                    break;
            }
        });

        // GUI SETUP //
        gui = AdvancedDynamicTexture.CreateFullscreenUI("myUI");
        let debugCharPos = new TextBlock();
        debugCharPos.name = "DebugCharPos";
        debugCharPos.text = "Character Position: " + debug_char.position.x + ", " + debug_char.position.y + ", " + debug_char.position.z;
        debugCharPos.color = "#1A202C";
        debugCharPos.fontFamily = "JetBrains Mono";
        debugCharPos.top = "-350px";
        debugCharPos.fontSize = 24;
        gui.addControl(debugCharPos);

        // INPUT SETUP //
        inputSetup(scene, {
            onMinusKeyDown: () => {
                if (gizmoManager.positionGizmoEnabled) {
                    gizmoManager.positionGizmoEnabled = false;
                    gizmoManager.rotationGizmoEnabled = false;
                    gizmoManager.boundingBoxGizmoEnabled = false;
                } else {
                    gizmoManager.positionGizmoEnabled = true;
                    gizmoManager.rotationGizmoEnabled = true;
                    gizmoManager.boundingBoxGizmoEnabled = true;
                }
            },
            onAKeyDown: () => {
                // if (debug_char.position.x + 1 > 2 || debug_char.position.x + 1 < -2) return;
                debug_char.position.x += 1;
            },
            onDKeyDown: () => {
                // if (debug_char.position.x - 1 > 2 || debug_char.position.x - 1 < -2) return;
                debug_char.position.x -= 1;
            },
            onWKeyDown: () => {
                // if (debug_char.position.z - 1 > 2 || debug_char.position.z - 1 < -2) return;
                debug_char.position.z -= 1;
            },
            onSKeyDown: () => {
                // if (debug_char.position.z + 1 > 2 || debug_char.position.z + 1 < -2) return;
                debug_char.position.z += 1;
            }
        });
    }

    /**
     * Will run on every frame render.
     */
    const onRender = (scene) => {
        gui.getControlByName("DebugCharPos").text = "Character Position: " + debug_char.position.x + ", " + debug_char.position.y + ", " + debug_char.position.z;
        // console.log("Board: ", board);
        boardRender(scene, board);
    }

    return (
        <div id={"game-container"}>
            <SceneManager antialias onSceneReady={onSceneReady} onRender={onRender} id="bvc"
                          style={{width: "80%", height: "80%", borderRadius: "12px"}}/>
        </div>
    )
}

