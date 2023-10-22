import {Color4, HavokPlugin, Mesh, Vector3} from "@babylonjs/core";
import {cameraSetup} from "./utils/camera_controls.js";
import {createPlatform, debugUtilitiesTick, initDebugUtilities} from "./utils/debug.js";
import "./styles.css";
import {Debug} from "@babylonjs/core/Legacy/legacy.js";
import {SceneManager} from "./containers/SceneManager.jsx";
import {bagelLogicTick, initBagelLogic} from "./logic/bagel_logic.js";
import {catLogicTick, initCatLogic} from "./logic/cat_logic.js";
import {initStateLogic, stateLogicCleanup, stateLogicTick} from "./logic/state_logic.js";
import HavokPhysics from "@babylonjs/havok";
import {initBuyMenu} from "./containers/buy_menu.js";
import {catSpawnerTick, initCatSpawner} from "./containers/cat_spawner.js";
import {initPlayerLogic} from "./logic/player_logic.js";
import {initUiLogic, uiLogicTick} from "./logic/ui_logic.js";
import {useEffect} from "react";

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
    /**
     * Will run when the scene is ready
     */
    const onSceneReady = (scene) => {
        // SCENE GENERATION //
        scene.clearColor = new Color4(1, 1, 1, 1);
        const canvas = scene.getEngine().getRenderingCanvas();
        const camera = cameraSetup(scene, canvas);
        ground = createPlatform(scene);

        // COMPONENT SETUP //
        initBuyMenu(scene, camera, canvas);
        initCatSpawner(scene);
        initDebugUtilities(scene);
        initPlayerLogic(scene);
        initUiLogic(scene);
        initStateLogic(scene);
        initBagelLogic(scene);
        initCatLogic(scene);
    }

    /**
     * Will run on every frame render.
     */
    const onRender = (scene) => {
        stateLogicTick(scene);
        debugUtilitiesTick(scene);
        bagelLogicTick(scene);
        catLogicTick(scene);
        catSpawnerTick(scene);
        uiLogicTick(scene)
    }

    useEffect(() => {
        return () => {
            stateLogicCleanup();
        }
    }, []);

    return (
        <div id={"game-container"}>
            <SceneManager antialias onSceneReady={onSceneReady} onRender={onRender} id="bvc"
                          style={{width: "80%", height: "80%", borderRadius: "12px"}}/>
        </div>
    )
}

