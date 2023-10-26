import {ActionManager, Color3, ExecuteCodeAction, Mesh, MeshBuilder, PointerEventTypes, Vector3} from "@babylonjs/core";
import {ground} from "../BagelsVersusCats.jsx";
import {GridMaterial} from "@babylonjs/materials";
import {AdvancedDynamicTexture, Rectangle, TextBlock} from "@babylonjs/gui";
import {addBagel, availableBagels, createBagel} from "../logic/bagel_logic.js";
import {PLAYER_WHEAT, removeWheat} from "../logic/player_logic.js";
import {maxPlayableX, maxPlayableY, minPlayableY, nonPlayableAreaExtension} from "../utils/debug";

export const highlightPlacementOptions = () => {
    ground.forEach((platform) => {
        platform.material.diffuseColor = new Color3(1, 0.5, 0.5);
    });
}

export const unhighlightPlacementOptions = () => {
    ground.forEach((platform) => {
        platform.material.diffuseColor = new Color3(1, 1, 1);
    });
}

export const initBuyMenu = (scene, camera, canvas) => {
    let selectedMesh = null;
    let material = new GridMaterial("outlined", scene);
    material.lineColor = new Color3(0, 1, 0);
    material.minorUnitVisibility = 0;
    material.gridOffset = new Vector3(0.5, 0.5, 0.5);
    material.majorUnitFrequency = 0.5;

    //region Functions
    const selectBuyOption = (pointerInfo) => {
        if (selectedMesh !== null && pointerInfo.pickInfo.hit && ground.includes(pointerInfo.pickInfo.pickedMesh)) {
            let newBagelPlacement = ground.find((platform) => platform === pointerInfo.pickInfo.pickedMesh).position;

            // Spawn __bagel__
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
            generatedMeshes.push(createInScene((maxPlayableX + 4) + (index), minPlayableY + (index), 3, bagel));
        });

        return generatedMeshes;
    }
    //endregion

    // Buy Menu Options //
    let generatedOptions = createBuyOptions();

    // Buy Menu Background //
    let guiPlane = MeshBuilder.CreatePlane("buy_plane", {width: 4, height: 10}, scene);
    guiPlane.parent = generatedOptions[0].mesh;
    guiPlane.position.y = -1;
    guiPlane.billboardMode = Mesh.BILLBOARDMODE_ALL;

    let gui = AdvancedDynamicTexture.CreateForMesh(guiPlane, 50, 400);
    let background = new Rectangle();
    background.color = "lightgreen";
    background.background = "lightgreen";
    background.thickness = 1;
    background.cornerRadius = 5;
    background.top = "120";
    gui.addControl(background);

    // Buy Menu Interaction //
    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case PointerEventTypes.POINTERDOWN:
                selectBuyOption(pointerInfo);
                break;
        }
    });
}
