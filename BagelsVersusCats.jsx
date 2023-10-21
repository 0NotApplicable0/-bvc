import {useEffect, useRef} from "react";
import {
    Color3,
    Color4,
    DefaultRenderingPipeline,
    Engine,
    GizmoManager,
    Mesh,
    PointerEventTypes,
    Scene,
    TransformNode
} from "@babylonjs/core";
import {cameraSetup, zoom2DView} from "./utils/camera_controls.js";
import {createPlatform} from "./utils/generate_scene.js";
import {createBox} from "./utils/test_utilities.js";
import {inputSetup} from "./utils/input_manager.js";
import "./styles.css";
import {Debug} from "@babylonjs/core/Legacy/legacy.js";

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

const Game = ({antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady, ...rest}) => {
    const reactCanvas = useRef(null);

    useEffect(() => {
        const {current: canvas} = reactCanvas;
        if (!canvas) return;

        // Load the engine & scene...
        const engine = new Engine(canvas, antialias, engineOptions, adaptToDeviceRatio);
        const scene = new Scene(engine, sceneOptions);
        if (scene.isReady()) {
            onSceneReady(scene);
        } else {
            scene.onReadyObservable.addOnce((scene) => onSceneReady(scene));
        }

        engine.runRenderLoop(() => {
            if (typeof onRender === "function") onRender(scene);
            scene.render();
        });

        const resize = () => {
            scene.getEngine().resize();
        };

        if (window) {
            window.addEventListener("resize", resize);
        }

        // Unmount Cleanup...
        return () => {
            scene.getEngine().dispose();

            if (window) {
                window.removeEventListener("resize", resize);
            }
        };
    }, [antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady]);

    return <canvas ref={reactCanvas} {...rest} />;
};

export default function BagelsVersusCats() {
    let character = null;
    let cat = null;

    /**
     * Will run when the scene is ready
     */
    const onSceneReady = (scene) => {
        const canvas = scene.getEngine().getRenderingCanvas();
        const camera = cameraSetup(scene, canvas);
        const anchor = new TransformNode("");

        // OTHER //
        character = createBox(scene, 0, 0, 2, new Color3(0, 1, 0));
        cat = createBox(scene, -2, 2, 2, new Color3(1, 0, 0));

        // SCENE SETUP //
        scene.clearColor = new Color4(1, 1, 1, 1);
        scene.onPointerObservable.add(({event}) => {
            const delta = -Math.sign(event.deltaY);
            zoom2DView(camera, delta, canvas);
        }, PointerEventTypes.POINTERWHEEL);

        // GIZMO SETUP //
        const gizmoManager = new GizmoManager(scene);

        // DEBUG SETTINGS //
        // const characterAxesView = new Debug.AxesViewer(scene, 1)
        // characterAxesView.xAxis.parent = character;
        // characterAxesView.yAxis.parent = character;
        // characterAxesView.zAxis.parent = character;
        // createAxisViewerForMesh(character);
        character.showLocalAxis();
        // cat.showLocalAxis();
        // character.hideLocalAxis();

        // PIPELINE //
        let pipeline = new DefaultRenderingPipeline(
            "pipeline",
            false,
            scene,
            scene.cameras
        );
        pipeline.imageProcessingEnabled = true;
        pipeline.imageProcessing.vignetteEnabled = true;
        pipeline.imageProcessing.vignetteWeight = 2;

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
                if (character.position.x + 1 > 2 || character.position.x + 1 < -2) return;
                character.position.x += 1;
            },
            onDKeyDown: () => {
                if (character.position.x - 1 > 2 || character.position.x - 1 < -2) return;
                character.position.x -= 1;
            },
            onWKeyDown: () => {
                if (character.position.z - 1 > 2 || character.position.z - 1 < -2) return;
                character.position.z -= 1;
            },
            onSKeyDown: () => {
                if (character.position.z + 1 > 2 || character.position.z + 1 < -2) return;
                character.position.z += 1;
            }
        });

        // SCENE GENERATION //
        createPlatform(scene);
        // createBuyMenu(scene);

    }

    /**
     * Will run on every frame render.
     */
    const onRender = (scene) => {
        console.log("Character X Y Z", character.position.x, character.position.y, character.position.z)
    }

    useEffect(() => {
        console.log("BagelsVersusCats mounted");

        let catMover = setInterval(() => {
            let previousX = cat.position.x;
            let previousZ = cat.position.z;
            let newX = previousX;
            let newZ = previousZ;

            if (Math.random() < 0.5) {
                if (previousX + 1 > 2 || previousX + 1 < -2) newX -= 1;
                else newX += 1;
            } else {
                if (previousX - 1 > 2 || previousX - 1 < -2) newX += 1;
                else newX -= 1;
            }

            if (Math.random() < 0.5) {
                if (previousZ + 1 > 2 || previousZ + 1 < -2) newZ -= 1;
                else newZ += 1;
            } else {
                if (previousZ - 1 > 2 || previousZ - 1 < -2) newZ += 1;
                else newZ -= 1;
            }

            cat.position.x = newX;
            cat.position.z = newZ;
        }, 1000);

        return () => {
            clearInterval(catMover);
            console.log("BagelsVersusCats unmounted");
        }
    }, []);

    return (
        <div id={"game-container"}>
            <Game antialias onSceneReady={onSceneReady} onRender={onRender} id="bvc"
                  style={{width: "80%", height: "80%", borderRadius: "12px"}}/>
        </div>
    )
}

