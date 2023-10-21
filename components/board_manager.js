export const boardRender = (scene, board) => {
    // Update Bagel Health
    board.forEach((bagel, index) => {
        if (bagel.type.health <= 0) {
            scene.getMeshById(bagel.id).dispose();
            board.splice(index, 1);
            return;
        }
        bagel.healthBar.width = (bagel.type.health / 100 / 2);
    });
}
