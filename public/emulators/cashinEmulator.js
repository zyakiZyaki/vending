import { isPressKeyA, isPressKeyS, isPressKeyD } from "../managers/event.js";
import listener from "../managers/listener.js";
import { eventInterpretator } from "./utils.js"

const variants =
    (is10, is20, is50) =>
    ({
        '10': is10,
        '20': is20,
        '50': is50
    })

function handler(interpretator) {
    return function (cb) {
        return function (event) {
            return interpretator(event, cb)
        }
    }
}

function cashinEmulator(listener, handler) {
    return function (cb) {

        const { setListener, removeListener } =
            listener("keydown",
                handler(cb)
            )

        return {
            StartCashin: function () {
                return setListener()
            },
            StopCashin: function () {
                return removeListener()
            }
        }
    }
}

export default cashinEmulator(
    listener,
    handler(
        eventInterpretator(
            variants(
                isPressKeyA,
                isPressKeyS,
                isPressKeyD
            )
        )
    )
)