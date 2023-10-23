import {ActionManager, Color3, ExecuteCodeAction, Mesh, MeshBuilder, PointerEventTypes, Vector3} from "@babylonjs/core";
import {ground} from "../BagelsVersusCats.jsx";
import {GridMaterial} from "@babylonjs/materials";
import {AdvancedDynamicTexture, TextBlock} from "@babylonjs/gui";
import {addBagel, availableBagels, createBagel, getCorrespondingBagel} from "../logic/bagel_logic.js";
import {PLAYER_WHEAT, removeWheat} from "../logic/player_logic.js";
import StandardBagel from "../components/bagels/standard_bagel.js";
import GeneratorBagel from "../components/bagels/generator_bagel.js";

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
            platform.material.lineColor = new Color3(0, 0, 1);
        });
    }

    const unhighlightPlacementOptions = () => {
        ground.forEach((platform) => {
            platform.material.lineColor = platform.material.previousLineColor;
        });
    }

    const selectBuyOption = (pointerInfo) => {
        if (selectedMesh !== null && pointerInfo.pickInfo.hit && ground.includes(pointerInfo.pickInfo.pickedMesh)) {
            let newBagelPlacement = ground.find((platform) => platform === pointerInfo.pickInfo.pickedMesh).position;

            // Spawn Bagel
            removeWheat(selectedMesh.metadata.cost);
            let newBagel = createBagel(scene, selectedMesh.metadata.name,
                newBagelPlacement.x, newBagelPlacement.z, newBagelPlacement.y + 1);
            addBagel(newBagel)

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
            let createdBagel = null;
            createdBagel = createBagel(scene, bagel.name, x, y, z, true);

            //region Create Entity
            createdBagel.init(scene, x, y, z);
            createdBagel.mesh.metadata = {name: bagel.name, cost: bagel.cost};
            createdBagel.mesh.scaling = new Vector3(0.5, 0.5, 0.5);
            createdBagel.sprite.width = 0.7;
            createdBagel.sprite.height = 0.7;

            let guiPlane = MeshBuilder.CreatePlane("plane", {size: 1}, scene);
            guiPlane.parent = createdBagel.mesh;
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
            //endregion

            //region Add Actions
            createdBagel.mesh.actionManager = new ActionManager(scene);
            createdBagel.mesh.actionManager.registerAction(
                new ExecuteCodeAction(
                    ActionManager.OnPickTrigger,
                    (evt) => {
                        if (PLAYER_WHEAT < createdBagel.cost) {
                            selectedMesh = null;
                            alert("You don't have enough wheat to buy that!");
                            return;
                        }

                        if (selectedMesh) {
                            selectedMesh.renderOutline = false;
                        } else if (selectedMesh === createdBagel.mesh) {
                            selectedMesh = null;
                            unhighlightPlacementOptions();
                            return;
                        }

                        selectedMesh = createdBagel.mesh;
                        selectedMesh.renderOutline = true;
                        selectedMesh.outlineColor = new Color3(0, 1, 0);
                        selectedMesh.outlineWidth = 0.1;
                        highlightPlacementOptions();
                    }
                )
            );
            //endregion

            return createdBagel;
        }

        const generatedMeshes = [];
        availableBagels.forEach((bagel, index) => {
            generatedMeshes.push(createInScene(4 + (index), -6 + (index), 3, bagel));
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
