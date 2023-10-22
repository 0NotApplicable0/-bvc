import Bagel from "./bagel.js";
import {ActionManager, Color3, ExecuteCodeAction, Mesh, MeshBuilder, Ray, Sprite, SpriteManager, Tags, Vector3} from "@babylonjs/core";
import {createBox} from "../../utils/debug.js";
import image from "../../assets/bagel.png";
import {AdvancedDynamicTexture, Rectangle} from "@babylonjs/gui";
import {cats} from "../../logic/cat_logic.js";

const name = "standard";
const health = 100;
const damage = 35;
const cost = 1;
const color = new Color3(0, 0, 0);

export default class StandardBagel extends Bagel {
    constructor(isDisabled = false) {
        super(name, health, damage, cost);
        this.timeSync = Date.now();
        this.isDisabled = isDisabled;
    }

    //region Functions
    fireProjectile(scene) {
        let projectile = createBox(scene, this.mesh.position.x, this.mesh.position.z + 0.8, this.mesh.position.y, new Color3(0, 0, 1), "projectile");
        projectile.scaling = new Vector3(0.2, 0.2, 0.2);

        // Projectile Loop //
        let projectileLoop = setInterval(() => {
            // Ray Look Ahead //
            let origin = new Vector3(projectile.position.x, projectile.position.y, projectile.position.z + 0.11);
            let forward = new Vector3(0, 0, 1);
            let length = 0.05;
            let ray = new Ray(origin, forward, length);

            // let rayHelper = new RayHelper(ray);
            // rayHelper.show(scene, new Color3(1, 0, 0));

            // Hit Detection //
            let hit = scene.pickWithRay(ray);
            if (hit.pickedMesh && hit.pickedMesh.matchesTagsQuery !== undefined && hit.pickedMesh.matchesTagsQuery("cat")) {
                let foundCat = cats.find((cat) => cat.id === hit.pickedMesh.id);
                foundCat.health -= this.damage;
                projectile.dispose();
                clearInterval(projectileLoop);
            } else if (projectile.position.z + 0.01 > 2) {
                projectile.dispose();
                clearInterval(projectileLoop);
            } else {
                projectile.position.z += 0.01;
            }
        }, 10);
    }

    timedFireProjectile(scene) {
        let timeNow = Date.now();
        let timePassed = (timeNow - this.timeSync) / 1000;
        if (timePassed >= 1) {
            this.timeSync = timeNow;
            this.fireProjectile(scene);
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
            "standard_bagel_sprite_manager",
            image,
            1,
            50,
            scene
        )
        const sprite = new Sprite("standard_bagel_sprite", spriteManager);

        sprite.position.x = x;
        sprite.position.z = y;
        sprite.position.y = z;

        // Create invisible mesh for raycasting
        let mesh = createBox(scene, x, y, z, color, this.name, 0);

        if (!this.isDisabled) {
            mesh.actionManager = new ActionManager(scene);
            mesh.actionManager.registerAction(
                new ExecuteCodeAction(
                    ActionManager.OnPickTrigger,
                    (evt) => {
                        console.log("Bagel Picked: ", mesh.id, this.name);
                    }
                )
            );
            mesh.actionManager.registerAction(
                new ExecuteCodeAction(
                    ActionManager.OnPointerOverTrigger,
                    (evt) => {
                        console.log("Bagel Hovered: ", mesh.id, this.name);
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

        // Cat In Row Detection //
        let currentY = this.mesh.position.y;
        let currentX = this.mesh.position.x;
        if (cats.find((cat) => cat.mesh.position.y === currentY && cat.mesh.position.x === currentX)) {
            this.timedFireProjectile(scene);
        }
    }

    //endregion
}
