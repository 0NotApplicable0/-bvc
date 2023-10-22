import {bagels} from "../../logic/bagel_logic.js";
import {Color3, Ray, RayHelper, Vector3} from "@babylonjs/core";

export default class Bagel {
    constructor(name, health, damage, cost) {
        this.name = name;
        this.id = crypto.randomUUID();
        this.health = health;
        this.damage = damage;
        this.cost = cost;
        this.initialized = false;
    }

    //region Lifecycle
    init(scene) {
    }

    update(scene) {
        // Bagel Death Check //
        if (this.health <= 0) {
            this.mesh.dispose();
            this.sprite.dispose();
            let index = bagels.findIndex((bagel) => bagel.id === this.id);
            bagels.splice(index, 1);
            return
        }

        // Bagel Health Bar Update //
        this.healthBarMesh.width = (this.health / 100 / 2);
    }

    //endregion
}
