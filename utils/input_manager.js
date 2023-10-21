import {KeyboardEventTypes, PointerEventTypes} from "@babylonjs/core";
import {Inspector} from "@babylonjs/inspector";

export const inputSetup = (scene, keyManagers) => {
    scene.onKeyboardObservable.add((kbInfo) => {

        console.log("Key event: ", kbInfo.event.key)

        switch (kbInfo.type) {
            case KeyboardEventTypes.KEYDOWN:
                switch (kbInfo.event.key) {
                    case "`":
                        if (scene.debugLayer.isVisible()) {
                            Inspector.Hide();
                        }
                        else {
                            Inspector.Show(scene, {});
                        }
                        break;
                    case '-':
                        keyManagers.onMinusKeyDown();
                    case "a":
                    case "A":
                        keyManagers.onAKeyDown();
                        break
                    case "d":
                    case "D":
                        keyManagers.onDKeyDown();
                        break
                    case "w":
                    case "W":
                        keyManagers.onWKeyDown();
                        break
                    case "s":
                    case "S":
                        keyManagers.onSKeyDown();
                        break
                }
                break;
        }
    });
}
