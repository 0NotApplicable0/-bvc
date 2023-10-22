import Bagel from "./bagel.js";
import {ActionManager, Color3, ExecuteCodeAction, Mesh, MeshBuilder, ParticleHelper, Sprite, SpriteManager, Tags} from "@babylonjs/core";
import {createBox} from "../../utils/debug.js";
import image from "../../assets/bagel.png";
import {AdvancedDynamicTexture, Rectangle} from "@babylonjs/gui";
import {addWheat} from "../../logic/player_logic.js";

const name = "generator";
const health = 100;
const damage = 0;
const cost = 1;
const color = new Color3(0, 0, 0);

export default class GeneratorBagel extends Bagel {
    constructor(isDisabled = false) {
        super(name, health, damage, cost);
        this.timeSync = Date.now();
        this.harvestCount = 0;
        this.isDisabled = isDisabled;
        this.readyToHarvest = false;
    }

    //region Functions
    buildHarvest() {
        if (this.readyToHarvest) return;

        if (this.harvestCount >= 10) {
            this.harvestCount = 0;
            let emissions = ParticleHelper.CreateDefault(this.mesh.position);
            emissions.start();
            this.readyToHarvest = true;
            this.emissions = emissions;
        } else {
            if (this.harvestCount === undefined) this.harvestCount = 0;
            this.harvestCount += 1;
            console.log("Building Harvest: ", this.harvestCount);
        }
    }

    timedBuildHarvest() {
        console.log("running")
        let timeNow = Date.now();
        let timePassed = (timeNow - this.timeSync) / 1000;
        if (timePassed >= 1) {
            this.timeSync = timeNow;
            this.buildHarvest();
        }
    }

    //endregion

    //region Lifecycle
    init(scene, x, y, z) {
        if (this.initialized) {
            console.log("Bagel already initialized: ", this.name, this.id);
            return;
        }
        super.init(scene);

        // Create Sprite
        const spriteManager = new SpriteManager(
            "generator_bagel_sprite_manager",
            image,
            1,
            50,
            scene
        )
        const sprite = new Sprite("generator_bagel_sprite", spriteManager);

        sprite.position.x = x;
        sprite.position.z = y;
        sprite.position.y = z;

        // Create invisible mesh for raycasting
        let mesh = createBox(scene, x, y, z, color, this.name, 1);

        if (!this.isDisabled) {
            mesh.actionManager = new ActionManager(scene);
            mesh.actionManager.registerAction(
                new ExecuteCodeAction(
                    ActionManager.OnPickTrigger,
                    (evt) => {
                        console.log("Generator Bagel Picked: ", this);
                        if (this.readyToHarvest) {
                            addWheat(1);
                            this.readyToHarvest = false;
                            this.emissions.stop();
                            this.emissions.dispose();
                            this.emissions = null;
                        }
                    }
                )
            );

            mesh.id = this.id;
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
            Tags.AddTagsTo(mesh, "bagel");

            this.healthBarMesh = healthBar;
        }

        // Add Bagel to State
        this.sprite = sprite;
        this.mesh = mesh;
        this.initialized = true;
    }

    update(scene) {
        super.update(scene);
        this.timedBuildHarvest()
    }

    //endregion
}
