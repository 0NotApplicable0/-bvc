import Bagel from "./bagel.js";
import {Color3, Ray, Vector3} from "@babylonjs/core";
import {createBox} from "../../utils/debug.js";
import image from "../../assets/bagelv3.png";
import {cats} from "../../logic/cat_logic.js";

const name = "standard_bagel";
const health = 100;
const damage = 50;
const cost = 1;

export default class StandardBagel extends Bagel {
    constructor(isDisabled = false) {
        super(name, health, damage, cost);
        this.timeSync = Date.now();
        this.isDisabled = isDisabled;
    }

    //region Functions
    fireProjectile(scene) {
        let projectile = createBox(scene, this.mesh.position.x - 0.05, this.mesh.position.z, this.mesh.position.y + 0.05, new Color3(0, 0, 1), "projectile");
        projectile.scaling = new Vector3(0.1, 0.1, 0.1);

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
                if(foundCat === undefined) return;
                foundCat.health -= this.damage;
                projectile.material.dispose();
                projectile.dispose();
                this.localIntervals.splice(this.localIntervals.indexOf(projectileLoop), 1);
                clearInterval(projectileLoop);
            } else if (projectile.position.z + 0.01 > 2) {
                projectile.material.dispose();
                projectile.dispose();
                this.localIntervals.splice(this.localIntervals.indexOf(projectileLoop), 1);
                clearInterval(projectileLoop);
            } else {
                projectile.position.z += 0.01;
            }
        }, 10);
        this.localIntervals.push(projectileLoop);
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
            console.log("Standard Bagel already initialized: ", this.name, this.id);
            return;
        }

        super.init(scene, "standard", x, y, z, {
            image: image,
            capacity: 1,
            cellSize: 60,
        });

        this.sprite.width = 0.7;
        this.sprite.height = 0.7;
        this.mesh.scaling = new Vector3(0.8, 0.8, 0.8);
        this.toggleDebugEdges();
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
