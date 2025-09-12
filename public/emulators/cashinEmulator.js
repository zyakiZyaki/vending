import { isPressKeyA, isPressKeyS, isPressKeyD } from "../managers/event.js";
import listener from "../managers/listener.js";

function handler(isInserted10, isInserted20, isInserted50) {
    return function (cb) {
        return function (e) {
            if (isInserted10(e)) return cb(10)
            if (isInserted20(e)) return cb(20)
            if (isInserted50(e)) return cb(50)
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
        isPressKeyA,
        isPressKeyS,
        isPressKeyD
    )
)