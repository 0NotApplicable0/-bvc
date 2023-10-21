import {KeyboardEventTypes, PointerEventTypes} from "@babylonjs/core";

export const inputSetup = (scene, keyManagers) => {
    scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
            case KeyboardEventTypes.KEYDOWN:
                switch (kbInfo.event.key) {
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
