import {createBox} from "../utils/debug.js";
import {Color3, HighlightLayer, Mesh, PointerEventTypes, Vector3} from "@babylonjs/core";
import {board, ground} from "../BagelsVersusCats.jsx";
import {GridMaterial} from "@babylonjs/materials";
import {AdvancedDynamicTexture, Rectangle} from "@babylonjs/gui";
import {availableBagels, spawnBagel} from "../components/bagel_logic.js";

export const initBuyMenu = (scene, camera, canvas) => {
    let bagels = null;

    //region Functions
    let selectedMesh = null;
    let material = new GridMaterial("outlined", scene);
    material.lineColor = new Color3(0, 1, 0);
    material.minorUnitVisibility = 0;
    material.gridOffset = new Vector3(0.5, 0.5, 0.5);
    material.majorUnitFrequency = 0.5;

    const highlightPlacementOptions = () => {
        ground.forEach((platform) => {
            platform.material.previousLineColor = platform.material.lineColor;
            platform.material.lineColor = new Color3(0, 0.2, 1);
        });
    }

    const unhighlightPlacementOptions = () => {
        ground.forEach((platform) => {
            platform.material.lineColor = platform.material.previousLineColor;
        });
    }

    const pointerDown = (pointerInfo) => {
        if (selectedMesh === null && pointerInfo.pickInfo.hit && bagels.includes(pointerInfo.pickInfo.pickedMesh)) {
            selectedMesh = pointerInfo.pickInfo.pickedMesh;
            selectedMesh.renderOutline = true;
            selectedMesh.outlineColor = new Color3(0, 1, 0);
            selectedMesh.outlineWidth = 0.1;
            highlightPlacementOptions();
        } else if (selectedMesh !== null && pointerInfo.pickInfo.hit && bagels.includes(pointerInfo.pickInfo.pickedMesh)) {
            selectedMesh.renderOutline = false;
            selectedMesh = pointerInfo.pickInfo.pickedMesh;
            selectedMesh.renderOutline = true;
            selectedMesh.outlineColor = new Color3(0, 1, 0);
            selectedMesh.outlineWidth = 0.1;
            highlightPlacementOptions();
        } else if (selectedMesh !== null && pointerInfo.pickInfo.hit && ground.includes(pointerInfo.pickInfo.pickedMesh)) {
            let newBagelPlacement = ground.find((platform) => platform === pointerInfo.pickInfo.pickedMesh).position;

            // Spawn Bagel
            console.log(selectedMesh.type);
            spawnBagel(scene, selectedMesh.type.name, newBagelPlacement.x, newBagelPlacement.z, newBagelPlacement.y + 1);

            // Reset
            selectedMesh.renderOutline = false;
            selectedMesh = null;
            unhighlightPlacementOptions();
        } else {
            if (selectedMesh) {
                selectedMesh.renderOutline = false;
                unhighlightPlacementOptions();
            }
            selectedMesh = null;
        }
    }

    const createBuyOptions = () => {
        const createInScene = (x, y, z, bagel) => {
            let createdBagel = createBox(scene, x, y, z, bagel.color, bagel.name);
            createdBagel.type = bagel;
            return createdBagel;
        }

        const generatedMeshes = [];
        availableBagels.forEach((bagel, index) => {
            generatedMeshes.push(createInScene(3 + (index * 2), -7 + (index * 2), 2, bagel));
        });

        return generatedMeshes;
    }
    //endregion

    bagels = createBuyOptions();
    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case PointerEventTypes.POINTERDOWN:
                pointerDown(pointerInfo);
                break;
        }
    });
}
