import {removeBagel} from "../../logic/bagel_logic.js";
import {Mesh, MeshBuilder, Tags} from "@babylonjs/core";
import {AdvancedDynamicTexture, Rectangle} from "@babylonjs/gui";
import Entity from "../entity.js";

export default class __bagel__ extends Entity {
    constructor(name, health, damage, cost) {
        super(name);
        this.health = health;
        this.damage = damage;
        this.cost = cost;
    }

    //region Lifecycle
    init(scene, name, x, y, z, spriteManagerOptions) {
        super.init(scene, x, y, z, spriteManagerOptions);

        this.sprite.width = 0.7;
        this.sprite.height = 0.7;
        // this.toggleDebugEdges();

        if (!this.isDisabled) {
            // Create Health Bar //
            let guiPlane = MeshBuilder.CreatePlane("health_plane_" + this.name + "_bagel_" + this.id, {size: 1}, scene);
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
            healthBar.top = "20px";
            gui.addControl(healthBar);

            Tags.EnableFor(this.mesh);
            Tags.AddTagsTo(this.mesh, "bagel");

            this.healthBarMesh = healthBar;
            this.healthBarGui = gui;
            this.healthBarGuiPlane = guiPlane;
        }
    }

    update(scene) {
        super.update(scene);

        // __bagel__ Death Check //
        if (this.health <= 0) {
            this.cleanup();
            return
        }

        // __bagel__ Health Bar Update //
        this.healthBarMesh.width = (this.health / 100 / 2);
    }

    cleanup() {
        super.cleanup();

        removeBagel(this);
        if (this.healthBarMesh) {
            this.healthBarMesh.dispose();
            this.healthBarGui.dispose();
            this.healthBarGuiPlane.dispose(false, true);
        }
    }

    //endregion
}
