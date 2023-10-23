import {ActionManager, Color3, ExecuteCodeAction, Mesh, MeshBuilder, Sprite, SpriteManager, Tags} from "@babylonjs/core";
import {createBox} from "../../utils/debug.js";
import image from "../../assets/skippy.png";
import {AdvancedDynamicTexture, Rectangle} from "@babylonjs/gui";
import Cat from "./cat.js";

const name = "standard_cat";
const health = 100;
const damage = 35;

export default class StandardCat extends Cat {
    constructor() {
        super(name, health, damage);
    }

    //region Lifecycle
    init(scene, x, y, z) {
        if (this.initialized) {
            console.log("Cat already initialized: ", this.name, this.id);
            return;
        }

        super.init(scene, x, y, z, {
            image: image,
            capacity: 1,
            cellSize: 120,
        });

        this.toggleDebugEdges();
        this.sprite.width = 1.3;
        this.sprite.height = 1.3;
    }

    update(scene) {
        super.update(scene);
    }
    //endregion
}
