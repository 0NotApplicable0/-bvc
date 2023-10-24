import Entity from "./entity.js";
import {Ray, Vector3} from "@babylonjs/core";
import {cats} from "../logic/cat_logic.js";

const name = "Projectile";

export default class Projectile extends Entity {
    constructor(speed, damage) {
        super(name);
        this.speed = speed;
        this.damage = damage;
    }

    //region Lifecycle
    init(scene, x, y, z, spriteManagerOptions) {
        super.init(scene, x, y, z, spriteManagerOptions);
        // this.toggleDebugEdges();
    }

    update(scene) {
        super.update(scene);
        if(this.cleanedUp) return;

        // Ray Look Ahead //
        let origin = new Vector3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z + 0.11);
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
            this.cleanup();
        } else if (this.mesh.position.z + 0.01 > 8) {
            this.cleanup();
        } else {
            this.mesh.position.z += this.speed;
            this.sprite.position.z += this.speed;
        }
    }

    cleanup() {
        super.cleanup();
        console.log("Projectile cleanup: ", this.name, this.id);
    }
    //endregion

}
