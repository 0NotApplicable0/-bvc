import {cats, removeCat} from "../../logic/cat_logic.js";
import {Color3, Color4, Mesh, MeshBuilder, Ray, Sprite, SpriteManager, Tags, Vector3} from "@babylonjs/core";
import {bagels} from "../../logic/bagel_logic.js";
import {GAME_STATES, setGameState} from "../../logic/state_logic.js";
import image from "../../assets/skippy.png";
import {createBox} from "../../utils/debug.js";
import {AdvancedDynamicTexture, Rectangle} from "@babylonjs/gui";
import Entity from "../entity.js";

export default class __cat__ extends Entity{
    constructor(name, health, damage) {
        super(name);
        this.health = health;
        this.damage = damage;
    }

    //region Functions
    move() {
        this.mesh.position.z -= 1 / 200;
        this.sprite.position.z -= 1 / 200;
    }
    //endregion

    //region Lifecycle
    init(scene, x, y, z, spriteManagerOptions) {
        super.init(scene, x, y, z, spriteManagerOptions);

        this.toggleDebugEdges();

        // Create Health Bar
        // Create __cat__ Health Bar Mesh //
        let guiPlane = MeshBuilder.CreatePlane("health_plane_" + this.name + "_cat_" + this.id, {size: 1}, scene);
        guiPlane.parent = this.mesh;
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

        Tags.EnableFor(this.mesh);
        Tags.AddTagsTo(this.mesh, "cat");

        this.healthBarMesh = healthBar;
        this.healthBarGui = gui;
        this.healthBarGuiPlane = guiPlane;
    }

    update(scene) {
        super.update(scene);

        // __cat__ Death Check //
        if (this.health <= 0) {
            this.cleanup();
            return;
        }

        // __cat__ Health Bar Update //
        this.healthBarMesh.width = (this.health / 100 / 2);

        // Look Ahead //
        let origin = new Vector3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z - 0.51);
        let forward = new Vector3(0, 0, -1);
        let length = 0.2;
        let ray = new Ray(origin, forward, length);

        // let rayHelper = new RayHelper(ray);
        // rayHelper.show(scene, new Color3(1, 0, 0));

        let hit = scene.pickWithRay(ray);
        if (hit.pickedMesh && hit.pickedMesh.matchesTagsQuery !== undefined && hit.pickedMesh.matchesTagsQuery("bagel")) {
            let foundBagel = bagels.find((bagel) => bagel.id === hit.pickedMesh.id);
            foundBagel.health -= 0.5;
        } else if (this.mesh.position.z - 1 / 200 < -2) {
            setGameState(GAME_STATES.GAME_OVER);
        } else {
            this.move();
        }
    }

    cleanup() {
        super.cleanup();

        removeCat(this);
        this.healthBarMesh.dispose();
        this.healthBarGui.dispose();
        this.healthBarGuiPlane.dispose(true, true);
    }
    //endregion
}
