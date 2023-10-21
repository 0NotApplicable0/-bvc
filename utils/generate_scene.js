import {Color3, MeshBuilder, Vector3} from "@babylonjs/core";
import {GridMaterial} from "@babylonjs/materials";

export const createPlatform = (scene) => {
    for (let x = -3; x < 3; x++) {
        for (let y = -3; y < 3; y++) {
            for (let z = 0; z < 2; z++) {
                let box = MeshBuilder.CreateBox("box", {size: 1}, scene);
                box.position.x = x;
                box.position.z = y;
                box.position.y = z;

                // box.enableEdgesRendering();
                // box.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
                // box.edgesWidth = 3;

                let material = new GridMaterial("myMaterial", scene);
                material.lineColor = new Color3(0.2, 0.2, 0.2);
                material.minorUnitVisibility = 0;
                material.gridOffset = new Vector3(0.5, 0.5, 0.5);
                material.majorUnitFrequency = 0.5;

                if (z == 1) {
                    material.mainColor = new Color3(0.49, 0.8, 0.05);
                    // material.diffuseColor = new BABYLON.Color3(0.49, 0.8, 0.05);
                } else {
                    // rgba(170,102,43,255)
                    material.mainColor = new Color3(0.667, 0.4, 0.168);
                    // material.diffuseColor = new BABYLON.Color3(0.667, 0.4, 0.168);
                }
                // material.ambientColor = new BABYLON.Color3(0.0, 0.0, 0.0);
                // material.specularColor = new BABYLON.Color3(0,0,0);

                box.material = material;
            }
        }
    }
}

export const createBuyMenu = (scene) => {
    const createInScene = (mesh, x, y, z) => {

    }

    const availableBagels = [];

    availableBagels.forEach((bagel, index) => {
        createInScene(scene, index, 0, 0);
    });
}
