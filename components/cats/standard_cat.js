import {ActionManager, Color3, ExecuteCodeAction, Mesh, MeshBuilder, Sprite, SpriteManager, Tags} from "@babylonjs/core";
import {createBox} from "../../utils/debug.js";
import image from "../../assets/catv2.png";
import {AdvancedDynamicTexture, Rectangle} from "@babylonjs/gui";
import Cat from "./cat.js";

const name = "standard";
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
        super.init(scene);

        // Create Sprite
        const spriteManager = new SpriteManager(
            "standard_cat_sprite_manager",
            image,
            1,
            66,
            scene
        )
        const sprite = new Sprite("standard_cat_sprite", spriteManager);

        sprite.position.x = x;
        sprite.position.z = y;
        sprite.position.y = z;
        sprite.renderingGroupId = 1;

        // Create invisible mesh for raycasting
        let mesh = createBox(scene, x, y, z, new Color3(0, 0, 0), this.name, 0);

        mesh.id = this.id;
        mesh.renderingGroupId = 1;
        mesh.receiveShadows = true;
        mesh.checkCollisions = true;
        mesh.isPickable = true;

        // Create Health Bar
        // Create Bagel Health Bar Mesh //
        let guiPlane = MeshBuilder.CreatePlane("health_plane_" + this.id, {size: 1}, scene);
        guiPlane.parent = mesh;
        guiPlane.position.y = 1;
        guiPlane.billboardMode = Mesh.BILLBOARDMODE_ALL;

        let gui = AdvancedDynamicTexture.CreateForMesh(guiPlane, 200, 100);
        let healthBar = new Rectangle();
        healthBar.width = (this.health / 100 / 2);
        healthBar.height = "10px";
        healthBar.color = "black";
        healthBar.background = "red";
        healthBar.thickness = 1;
        gui.addControl(healthBar);

        Tags.EnableFor(mesh);
        Tags.AddTagsTo(mesh, "cat");

        // Add Bagel to State
        this.sprite = sprite;
        this.mesh = mesh;
        this.healthBarMesh = healthBar;
        this.initialized = true;
    }

    update(scene) {
        super.update(scene);
    }

    //endregion
}
