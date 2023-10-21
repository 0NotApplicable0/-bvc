import {KeyboardEventTypes} from "@babylonjs/core";
import {Inspector} from "@babylonjs/inspector";

export const inputSetup = (scene, keyManagers, ground) => {
    scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
            case KeyboardEventTypes.KEYDOWN:
                switch (kbInfo.event.key) {
                    case "`":
                        if (scene.debugLayer.isVisible()) {
                            Inspector.Hide();
                        } else {
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
