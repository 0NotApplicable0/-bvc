import __bagel__ from "./__bagel__.js";
import {Color3, Ray, Vector3} from "@babylonjs/core";
import {createBox} from "../../utils/debug.js";
import image from "../../assets/bagelv3.png";
import {cats} from "../../logic/cat_logic.js";
import bagelShotImage from "../../assets/bagel_shot.png";
import Projectile from "../projectile.js";

const name = "standard_bagel";
const health = 100;
const damage = 50;
const cost = 1;

export default class StandardBagel extends __bagel__ {
    constructor(isDisabled = false) {
        super(name, health, damage, cost);
        this.timeSync = Date.now();
        this.isDisabled = isDisabled;
        this.projectiles = [];
    }

    //region Functions
    fireProjectile(scene) {
        let projectile = new Projectile(0.02, 25);
        let projectileSpriteOptions = {
            image: bagelShotImage,
            capacity: 1,
            cellSize: 12,
        }
        projectile.init(scene, this.mesh.position.x - 0.05, this.mesh.position.z, this.mesh.position.y + 0.05, projectileSpriteOptions);
        projectile.mesh.scaling = new Vector3(0.1, 0.1, 0.1);
        projectile.sprite.width = 0.2;
        projectile.sprite.height = 0.2;
        this.projectiles.push(projectile);
    }

    timedFireProjectile(scene) {
        let timeNow = Date.now();
        let timePassed = (timeNow - this.timeSync) / 1000;
        if (timePassed >= 3) {
            this.timeSync = timeNow;
            this.fireProjectile(scene);
        }
    }

    //endregion

    //region Lifecycle
    init(scene, x, y, z) {
        if (this.initialized) {
            console.log("Standard __bagel__ already initialized: ", this.name, this.id);
            return;
        }

        super.init(scene, "standard", x, y, z, {
            image: image,
            capacity: 1,
            cellSize: 60,
        });

        // this.sprite.width = 0.7;
        // this.sprite.height = 0.7;
        // this.mesh.scaling = new Vector3(0.8, 0.8, 0.8);
        // this.toggleDebugEdges();
    }

    update(scene) {
        super.update(scene);

        // __cat__ In Row Detection //
        let currentY = this.mesh.position.y;
        let currentX = this.mesh.position.x;
        if (cats.find((cat) => cat.mesh.position.y === currentY && cat.mesh.position.x === currentX)) {
            this.timedFireProjectile(scene);
        }

        // Simulate Projectiles //
        this.projectiles.forEach((projectile) => {
            projectile.update(scene);
        });
    }

    //endregion
}
