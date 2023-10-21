import {useEffect, useRef} from "react";
import {
    ArcRotateCamera,
    Camera,
    Color3,
    Color4,
    DefaultRenderingPipeline,
    Engine,
    MeshBuilder,
    PointerEventTypes,
    Scene,
    Vector3
} from "@babylonjs/core";
import {GridMaterial} from "@babylonjs/materials";
import {cameraSetup, setTopBottomRatio, zoom2DView} from "./utils/camera_controls.js";
import {createPlatform} from "./utils/generate_scene.js";
import {createBox, spawnCube, spawnSprite} from "./utils/test_utilities.js";
import {inputSetup} from "./utils/input_manager.js";

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

    /**
     * Will run when the scene is ready
     */
    const onSceneReady = (scene) => {
        const canvas = scene.getEngine().getRenderingCanvas();
        const camera = cameraSetup(scene, canvas);

        // SCENE SETUP //
        scene.clearColor = new Color4(1, 1, 1, 1);
        scene.onPointerObservable.add(({event}) => {
            const delta = -Math.sign(event.deltaY);
            zoom2DView(camera, delta, canvas);
        }, PointerEventTypes.POINTERWHEEL);

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
            onAKeyDown: () => {
                character.position.x += 1;
            },
            onDKeyDown: () => {
                character.position.x -= 1;
            },
            onWKeyDown: () => {
                character.position.z -= 1;
            },
            onSKeyDown: () => {
                character.position.z += 1;
            }
        });

        // SCENE GENERATION //
        createPlatform(scene);
        // createBuyMenu(scene);

        character = createBox(scene, -3, -3, 2, new Color3(1, 0, 0));
    }

    /**
     * Will run on every frame render.
     */
    const onRender = (scene) => {
        console.log("Character X Y Z", character.position.x, character.position.y, character.position.z)
    }

    return (
        <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <Game antialias onSceneReady={onSceneReady} onRender={onRender} id="bvc"
                  style={{width: "80%", height: "80%", borderRadius: "12px"}}/>
        </div>
    )
}

