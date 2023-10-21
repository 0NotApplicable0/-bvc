import {createBox} from "../utils/test_utilities.js";
import {Color3, HighlightLayer, PointerEventTypes, Vector3} from "@babylonjs/core";
import {board, ground} from "../BagelsVersusCats.jsx";
import {GridMaterial} from "@babylonjs/materials";

export const initBuyMenu = (scene, camera, canvas) => {
    let bagels = null;
    let hl = new HighlightLayer("hl1", scene);

    //region Functions
    let selectedMesh = null;
    let startingPoint = null;

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
        } else if(selectedMesh !== null && pointerInfo.pickInfo.hit && ground.includes(pointerInfo.pickInfo.pickedMesh)) {
            let newBagelPlacement = ground.find((platform) => platform === pointerInfo.pickInfo.pickedMesh).position;
            console.log(newBagelPlacement);

            let newBagel = createBox(scene,
                newBagelPlacement.x, newBagelPlacement.z, newBagelPlacement.y + 1,
                new Color3(Math.random(), Math.random(), Math.random()), selectedMesh.name);
            board.push(newBagel);

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

    const createMeshes = () => {
        const createInScene = (x, y, z, name) => {
            return createBox(scene, x, y, z, new Color3(Math.random(), Math.random(), Math.random()), name);
        }

        const generatedMeshes = [];
        const availableBagels = ["standard", "sesame", "everything", "poppy"];
        availableBagels.forEach((bagel, index) => {
            generatedMeshes.push(createInScene(3 + (index * 2), -7 + (index * 2), 2, bagel));
        });

        return generatedMeshes;
    }
    //endregion

    bagels = createMeshes();
    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case PointerEventTypes.POINTERDOWN:
                pointerDown(pointerInfo);
                break;
        }
    });
}
