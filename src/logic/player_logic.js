export let PLAYER_WHEAT = 10000;

export const addWheat = (amount) => {
    PLAYER_WHEAT += amount;
}

export const removeWheat = (amount) => {
    PLAYER_WHEAT -= amount;
}

//region Lifecycle
export const initPlayerLogic = (scene) => {}
//endregion
