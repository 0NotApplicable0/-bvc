import {Vector3} from "@babylonjs/core";
import {useEffect} from "react";

export function vecToLocal(vector, mesh){
    let m = mesh.getWorldMatrix();
    let v = Vector3.TransformCoordinates(vector, m);
    return v;
}
