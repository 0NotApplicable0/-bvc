import {randomIntFromInterval} from "../../utils/debug.js";
import skippySpriteSheet from "../../assets/sprites/skippy_spritesheet3.png";
import __cat__ from "./__cat__.js";

const name = "standard_cat";
const health = 100;
const damage = 35;

export default class StandardCat extends __cat__ {
    constructor() {
        super(name, health, damage);
    }

    //region Lifecycle
    init(scene, x, y, z) {
        if (this.initialized) {
            console.log("__cat__ already initialized: ", this.name, this.id);
            return;
        }

        super.init(scene, x, y, z, {
            image: skippySpriteSheet,
            capacity: 1,
            cellSize: 108,
        });

        this.sprite.playAnimation(0, 3, true, randomIntFromInterval(50, 100));

        // this.toggleDebugEdges();
        this.sprite.width = 1.3;
        this.sprite.height = 1.3;
    }

    update(scene) {
        super.update(scene);
    }

    //endregion
}
