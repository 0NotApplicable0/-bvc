import {Color3, MeshBuilder, Vector3} from "@babylonjs/core";
import {GridMaterial} from "@babylonjs/materials";

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
