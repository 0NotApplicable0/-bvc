import __bagel__ from "./__bagel__.js";
import {ActionManager, ExecuteCodeAction, ParticleHelper} from "@babylonjs/core";
import image from "../../assets/wheat_bagel.png";
import {addWheat} from "../../logic/player_logic.js";

const name = "wheat";
const health = 10000;
const damage = 0;
const cost = 1;

export default class WheatBagel extends __bagel__ {
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
            console.log("Wheat __bagel__ already initialized: ", this.name, this.id);
            return;
        }

        super.init(scene, "wheat", x, y, z, {
            image: image,
            capacity: 1,
            cellSize: 50,
        });

        if (!this.isDisabled) {
            this.mesh.actionManager = new ActionManager(scene);
            this.mesh.actionManager.registerAction(
                new ExecuteCodeAction(
                    ActionManager.OnPickTrigger,
                    (evt) => {
                        console.log("Generator __bagel__ Picked: ", this);
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
        }
    }

    update(scene) {
        super.update(scene);
        this.timedBuildHarvest()
    }

    cleanup(scene) {
        super.cleanup(scene);
        if (this.emissions) {
            this.emissions.stop();
            this.emissions.dispose();
            this.emissions = null;
        }
    }

    //endregion
}
