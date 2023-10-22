import StandardBagel from "../components/bagels/standard_bagel.js";
import GeneratorBagel from "../components/bagels/generator_bagel.js";

export const availableBagels = [{
    name: "standard",
    cost: 1
}, {
    name: "sesame",
    cost: 2
}, {
    name: "everything",
    cost: 3
}, {
    name: "poppy",
    cost: 4
}, {
    name: "generator",
    cost: 1
}]

export let bagels = [];

//region Functions
export const addBagel = (bagel) => {
    bagels.push(bagel);
}

export const removeBagel = (bagel) => {
    let index = bagels.findIndex((bagel) => bagel.id === bagel.id);
    bagels.splice(index, 1);
}
//endregion

//region Lifecycle
export const initBagelLogic = (scene) => {
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
}

export const bagelLogicTick = (scene) => {
    bagels.forEach((bagel, index) => {
        bagel.update(scene);
    });
}
//endregion
