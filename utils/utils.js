import {Vector3} from "@babylonjs/core";

export function vecToLocal(vector, mesh){
    let m = mesh.getWorldMatrix();
    let v = Vector3.TransformCoordinates(vector, m);
    return v;
}
