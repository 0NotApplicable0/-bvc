import {cats} from "../../logic/cat_logic.js";
import {Ray, Vector3} from "@babylonjs/core";
import {bagels} from "../../logic/bagel_logic.js";
import {GAME_STATES, setGameState} from "../../logic/state_logic.js";

export default class Cat {
    constructor(name, health, damage) {
        this.name = name;
        this.id = crypto.randomUUID();
        this.health = health;
        this.damage = damage;
        this.initialized = false;
    }

    //region Functions
    move() {
        this.mesh.position.z -= 1 / 200;
        this.sprite.position.z -= 1 / 200;
    }

    //endregion

    //region Lifecycle
    init(scene) {
    }

    update(scene) {
        // Cat Death Check //
        if (this.health <= 0) {
            this.mesh.dispose();
            this.sprite.dispose();
            let index = cats.findIndex((cat) => cat.id === this.id);
            cats.splice(index, 1);
            return;
        }

        // Cat Health Bar Update //
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
            foundBagel.health -= 1;
        } else if (this.mesh.position.z - 1 / 200 < -2) {
            setGameState(GAME_STATES.GAME_OVER);
        } else {
            this.move();
        }
    }

    //endregion
}
