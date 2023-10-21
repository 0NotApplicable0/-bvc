import {Debug} from "@babylonjs/core/Legacy/legacy.js";
import {Mesh} from "@babylonjs/core";

export const createAxisViewerForMesh = (mesh, size = 1) => {
    const newAxisViewer = new Debug.AxesViewer(mesh.getScene(), size);
    newAxisViewer.xAxis.parent = mesh;
    newAxisViewer.yAxis.parent = mesh;
    newAxisViewer.zAxis.parent = mesh;
}
