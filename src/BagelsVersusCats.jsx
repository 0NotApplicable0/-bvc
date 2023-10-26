import {Color4, Mesh} from "@babylonjs/core";
import {cameraSetup} from "./utils/camera_controls.js";
import {createExperimentalPlatform, createPlatform, debugUtilitiesTick, initDebugUtilities} from "./utils/debug.js";
import "./styles.css";
import {Debug} from "@babylonjs/core/Legacy/legacy.js";
import {SceneManager} from "./containers/SceneManager.jsx";
import {bagelLogicCleanup, bagelLogicTick, initBagelLogic} from "./logic/bagel_logic.js";
import {catLogicCleanup, catLogicTick, initCatLogic} from "./logic/cat_logic.js";
import {CURRENT_GAME_STATE, GAME_STATES, initStateLogic, setGameState, stateLogicCleanup, stateLogicTick} from "./logic/state_logic.js";
import {catSpawnerCleanup, catSpawnerTick, initCatSpawner} from "./containers/cat_spawner.js";
import {initPlayerLogic} from "./logic/player_logic.js";
import {cleanupUiLogic, fullscreen_ui, initUiLogic, uiLogicTick} from "./logic/ui_logic.js";
import {useEffect} from "react";
import {initBuyMenu, unhighlightPlacementOptions} from "./containers/buy_menu.js";
import {TextBlock} from "@babylonjs/gui";
import {initSoundLogic} from "./logic/sound_logic.js";
import {highlightPlacementOptions} from "./containers/buy_menu";

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
export let ground = [];
//endregion

export default function BagelsVersusCats() {
    /**
     * Will run when the scene is ready
     */
    const onSceneReady = (scene) => {
        setGameState(GAME_STATES.IN_GAME);

        // SCENE GENERATION //
        scene.clearColor = new Color4(1, 1, 1, 1);
        const canvas = scene.getEngine().getRenderingCanvas();
        const camera = cameraSetup(scene, canvas);
        // ground = createPlatform(scene);
        ground = createExperimentalPlatform(scene);
        highlightPlacementOptions();
        unhighlightPlacementOptions();

        // COMPONENT SETUP //
        initBagelLogic(scene);
        initCatLogic(scene);
        initBuyMenu(scene, camera, canvas);
        // initCatSpawner(scene);
        initDebugUtilities(scene);
        initPlayerLogic(scene);
        initUiLogic(scene);
        initStateLogic(scene);
        initSoundLogic(scene);
    }

    /**
     * Will run on every frame render.
     */
    const onRender = (scene) => {
        if(CURRENT_GAME_STATE === GAME_STATES.PAUSED) {
            console.log("== GAME PAUSED ==");
        }
        else {
            stateLogicTick(scene);
            debugUtilitiesTick(scene);
            bagelLogicTick(scene);
            catLogicTick(scene);
            // catSpawnerTick(scene);
            uiLogicTick(scene);
        }
    }

    /**
     * Will run when the component unmounts and cleans up Babylon
     */
    useEffect(() => {
        return () => {
            console.log("Cleaning up...");
            cleanupUiLogic();
            stateLogicCleanup();
            bagelLogicCleanup();
            catLogicCleanup();
            catSpawnerCleanup();
        }
    }, []);

    return (
        <div id={"game-container"}>
            <SceneManager antialias onSceneReady={onSceneReady} onRender={onRender} id="bvc"
                          style={{width: "80%", height: "80%", borderRadius: "12px"}}/>
        </div>
    )
}

