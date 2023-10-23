import StandardBagel from "../components/bagels/standard_bagel.js";
import GeneratorBagel from "../components/bagels/generator_bagel.js";

export const availableBagels = [
    {
        name: "standard",
        cost: 1
    },
    {
        name: "generator",
        cost: 1
    }
]

export const createBagel = (scene, name, x, y, z, isDisabled) => {
    switch (name) {
        case "standard":
            let standardBagel = new StandardBagel(isDisabled);
            standardBagel.init(scene, x, y, z);
            return standardBagel;
        case "generator":
            let generatorBagel = new GeneratorBagel(isDisabled);
            generatorBagel.init(scene, x, y, z);
            return generatorBagel;
        default:
            let defaultBagel = new StandardBagel(isDisabled);
            defaultBagel.init(scene, x, y, z);
            return defaultBagel;
    }
}

export let bagels = null;

//region Functions
export const addBagel = (bagel) => {
    bagels.push(bagel);
}

export const removeBagel = (bagel) => {
    bagels.splice(bagels.indexOf(bagel), 1);
}
//endregion

//region Lifecycle
export const initBagelLogic = (scene) => {
    bagels = [];

    let test_standard_bagel1 = new StandardBagel();
    test_standard_bagel1.init(scene, -2, -2, 2);
    bagels.push(test_standard_bagel1);

    let test_standard_bagel2 = new StandardBagel();
    test_standard_bagel2.init(scene, -1, -2, 2);
    bagels.push(test_standard_bagel2);

    let test_standard_bagel3 = new StandardBagel();
    test_standard_bagel3.init(scene, 0, -2, 2);
    bagels.push(test_standard_bagel3);

    let test_standard_bagel4 = new StandardBagel();
    test_standard_bagel4.init(scene, 1, -2, 2);
    bagels.push(test_standard_bagel4);

    let test_standard_bagel5 = new StandardBagel();
    test_standard_bagel5.init(scene, 2, -2, 2);
    bagels.push(test_standard_bagel5);

    let test_standard_bagel6 = new StandardBagel();
    test_standard_bagel6.init(scene, 3, -2, 2);
    bagels.push(test_standard_bagel6);

    let test_standard_bagel7 = new StandardBagel();
    test_standard_bagel7.init(scene, 4, -2, 2);
    bagels.push(test_standard_bagel7);
}

export const bagelLogicTick = (scene) => {
    bagels.forEach((bagel, index) => {
        bagel.update(scene);
    });
}

export const bagelLogicCleanup = (scene) => {
    bagels.forEach((bagel) => {
        bagel.cleanup(scene);
    });

    bagels = null;
}
//endregion
