import {ArcRotateCamera, Camera, PointerEventTypes, Vector3} from "@babylonjs/core";

export const cameraSetup = (scene, canvas) => {
    let camera = new ArcRotateCamera(
        "camera2",
        Math.PI / 4,
        Math.PI / 4,
        3 * 10,
        new Vector3(0, 1, 0),
        scene
    );
    camera.mode = Camera.ORTHOGRAPHIC_CAMERA;

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    camera.lowerRadiusLimit = camera.radius;
    camera.upperRadiusLimit = camera.radius;
    camera.wheelDeltaPercentage = 0.01;

    let width = 10 * 1.5;
    camera.orthoLeft = (-1.2 * width) / 2;
    camera.orthoRight = -camera.orthoLeft;

    scene.onPointerObservable.add(({event}) => {
        const delta = -Math.sign(event.deltaY);
        zoom2DView(camera, delta, canvas);
    }, PointerEventTypes.POINTERWHEEL);

    setTopBottomRatio(camera, canvas);
    return camera;
}

export const setTopBottomRatio = (camera, canvas) => {
    const ratio = canvas.height / canvas.width;
    if (camera.orthoLeft && camera.orthoRight) {
        camera.orthoTop = camera.orthoRight * ratio;
        camera.orthoBottom = camera.orthoLeft * ratio;
    }
}

export const zoom2DView = (camera, delta, canvas) => {
    const zoomingOut = delta < 0;

    if (camera.orthoLeft && camera.orthoRight) {
        // limit zooming in to no less than 3 units.
        if (!zoomingOut && Math.abs(camera.orthoLeft) <= 3) {
            return;
        }

        camera.orthoLeft += delta / 2;
        camera.orthoRight -= delta / 2;

        setTopBottomRatio(camera, canvas);
    }
}
