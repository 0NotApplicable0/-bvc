import {Color3, Color4, Sprite, SpriteManager} from "@babylonjs/core";
import {createBox} from "../utils/debug.js";

export default class Entity {
    constructor(name) {
        this.name = name;
        this.id = crypto.randomUUID();
        this.initialized = false;
        this.localIntervals = []; // Add all intervals to this array to be cleared on cleanup
    }

    //region Functions
    toggleDebugEdges() {
        if (!this.initialized) {
            console.log("Can't toggle debug edges on uninitialized entity: ", this.name, this.id);
            return;
        }

        if (this.debugEdgesEnabled) {
            this.mesh.disableEdgesRendering();
        } else {
            this.mesh.enableEdgesRendering();
            this.mesh.edgesColor = new Color4(0, 0, 0, 1);
            this.mesh.edgesWidth = 3;
        }

        this.debugEdgesEnabled = !this.debugEdgesEnabled;
    }

    //endregion

    //region Lifecycle
    init(scene, x, y, z, spriteManagerOptions) {
        // Create Sprite //
        const spriteManager = new SpriteManager(
            this.name + "_sprite_manager",
            spriteManagerOptions.image,
            spriteManagerOptions.capacity,
            spriteManagerOptions.cellSize,
            scene
        )
        const sprite = new Sprite(this.name + "_sprite", spriteManager);

        sprite.position.x = x;
        sprite.position.z = y;
        sprite.position.y = z;

        // Create Mesh //
        let mesh = createBox(scene, x, y, z, new Color3(0, 0, 0), this.name, 0);
        mesh.id = this.id;

        // Add Bagel to State
        this.sprite = sprite;
        this.spriteManager = spriteManager;
        this.mesh = mesh;
        this.initialized = true;
    }

    update(scene) {
    }

    cleanup() {
        this.mesh.dispose(false, true);
        this.sprite.dispose();
        this.spriteManager.dispose();

        this.localIntervals.forEach((interval) => {
            clearInterval(interval);
        });
    }

    //endregion
}
