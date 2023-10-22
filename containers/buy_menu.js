import {createBox} from "../utils/debug.js";
import {Color3, HighlightLayer, Mesh, MeshBuilder, PointerEventTypes, Vector3} from "@babylonjs/core";
import {board, ground} from "../BagelsVersusCats.jsx";
import {GridMaterial} from "@babylonjs/materials";
import {AdvancedDynamicTexture, Rectangle, TextBlock} from "@babylonjs/gui";
import {availableBagels, spawnBagel} from "../components/bagel_logic.js";
import {PLAYER_WHEAT, removeWheat} from "../components/player_logic.js";

export const initBuyMenu = (scene, camera, canvas) => {
    let bagels = null;

    let selectedMesh = null;
    let material = new GridMaterial("outlined", scene);
    material.lineColor = new Color3(0, 1, 0);
    material.minorUnitVisibility = 0;
    material.gridOffset = new Vector3(0.5, 0.5, 0.5);
    material.majorUnitFrequency = 0.5;

    //region Functions
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

    const selectBuyOption = (pointerInfo) => {
        if (selectedMesh === null && pointerInfo.pickInfo.hit && bagels.includes(pointerInfo.pickInfo.pickedMesh)) {
            selectedMesh = pointerInfo.pickInfo.pickedMesh;

            if(PLAYER_WHEAT < selectedMesh.type.cost) {
                selectedMesh = null;
                alert("You don't have enough wheat to buy that!");
                return;
            }

            selectedMesh.renderOutline = true;
            selectedMesh.outlineColor = new Color3(0, 1, 0);
            selectedMesh.outlineWidth = 0.1;
            highlightPlacementOptions();
        } else if (selectedMesh !== null && pointerInfo.pickInfo.hit && bagels.includes(pointerInfo.pickInfo.pickedMesh)) {
            selectedMesh.renderOutline = false;
            selectedMesh = pointerInfo.pickInfo.pickedMesh;

            if(PLAYER_WHEAT < selectedMesh.type.cost) {
                selectedMesh = null;
                alert("You don't have enough wheat to buy that!");
                return;
            }

            selectedMesh.renderOutline = true;
            selectedMesh.outlineColor = new Color3(0, 1, 0);
            selectedMesh.outlineWidth = 0.1;
            highlightPlacementOptions();
        } else if (selectedMesh !== null && pointerInfo.pickInfo.hit && ground.includes(pointerInfo.pickInfo.pickedMesh)) {
            let newBagelPlacement = ground.find((platform) => platform === pointerInfo.pickInfo.pickedMesh).position;

            // Spawn Bagel
            removeWheat(selectedMesh.type.cost);
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
            createdBagel.scaling = new Vector3(0.5, 0.5, 0.5);

            let guiPlane = MeshBuilder.CreatePlane("plane", {size: 1}, scene);
            guiPlane.parent = createdBagel;
            guiPlane.position.x = -2;
            guiPlane.position.y = -1.5;
            guiPlane.billboardMode = Mesh.BILLBOARDMODE_ALL;

            let gui = AdvancedDynamicTexture.CreateForMesh(guiPlane, 200, 200);
            let wheatCost = new TextBlock();
            wheatCost.name = bagel.name + "_WheatCost";
            wheatCost.text = "Cost: " + bagel.cost;
            wheatCost.color = "#1A202C";
            wheatCost.fontFamily = "JetBrains Mono";
            wheatCost.fontSize = 50;

            let bagelName = new TextBlock();
            bagelName.name = bagel.name + "_name";
            bagelName.text = bagel.name;
            bagelName.color = "#1A202C";
            bagelName.fontFamily = "JetBrains Mono";
            bagelName.fontSize = 50;
            bagelName.top = "-50px";

            gui.addControl(wheatCost);
            gui.addControl(bagelName);

            return createdBagel;
        }

        const generatedMeshes = [];
        availableBagels.forEach((bagel, index) => {
            generatedMeshes.push(createInScene(3 + (index), -7 + (index), 2, bagel));
        });

        return generatedMeshes;
    }
    //endregion

    bagels = createBuyOptions();
    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case PointerEventTypes.POINTERDOWN:
                selectBuyOption(pointerInfo);
                break;
        }
    });
}
