import {createBox} from "../utils/test_utilities.js";
import {Color3, DynamicTexture, HighlightLayer, Mesh, PointerEventTypes, StandardMaterial, Vector3} from "@babylonjs/core";
import {board, ground} from "../BagelsVersusCats.jsx";
import {GridMaterial} from "@babylonjs/materials";
import {AdvancedDynamicTexture, Rectangle} from "@babylonjs/gui";

const availableBagels = [{
    name: "standard",
    color: new Color3(0.337, 0.8, 0.468),
    health: 200,
}, {
    name: "sesame",
    color: new Color3(0.87, 0.5, 0.128),
    health: 100,
}, {
    name: "everything",
    color: new Color3(0.647, 0.4, 0.128),
    health: 100,
}, {
    name: "poppy",
    color: new Color3(0.17, 0.4, 0.168),
    health: 100,
}]

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

            // Render Bagel
            let newBagel = createBox(scene,
                newBagelPlacement.x, newBagelPlacement.z, newBagelPlacement.y + 1,
                selectedMesh.material.mainColor, selectedMesh.name);
            newBagel.type = {...selectedMesh.type};
            newBagel.id = crypto.randomUUID();

            // Render Health Bar
            var plane = Mesh.CreatePlane("healthbar", 2);
            plane.parent = newBagel;
            plane.position.y = 1;

            const healthBar = AdvancedDynamicTexture.CreateForMesh(plane, 200, 100);

            var rect1 = new Rectangle();
            rect1.width = (newBagel.type.health / 100 / 2);
            rect1.height = "10px";
            rect1.color = "black";
            rect1.background = "red";
            rect1.thickness = 1;
            healthBar.addControl(rect1);


            board.push({
                ...newBagel, healthBar: rect1
            });

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

    bagels = createMeshes();
    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case PointerEventTypes.POINTERDOWN:
                pointerDown(pointerInfo);
                break;
        }
    });
}
