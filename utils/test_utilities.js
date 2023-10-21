import {Color3, MeshBuilder, Vector3} from "@babylonjs/core";
import {GridMaterial} from "@babylonjs/materials";

export const createBox = (scene, x, y, z, color) => {
    let box = MeshBuilder.CreateBox("box", {size: 1}, scene);
    box.position.x = x;
    box.position.z = y;
    box.position.y = z;

    let material = new GridMaterial("myMaterial", scene);
    material.lineColor = new Color3(0.2, 0.2, 0.2);
    material.minorUnitVisibility = 0;
    material.gridOffset = new Vector3(0, 0, 0);
    material.majorUnitFrequency = 0.5;

    material.mainColor = color;
    box.material = material;
    return box;
}
