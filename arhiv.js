import event from "../event.js";
import listener from "../listener.js";

function cashinEmulator(event, listener) {
    function createHandler(cb) {
        return function handler(e) {
            if (event.isChosen1(e)) return cb(cash)
            if (event.isChosen2(e)) return cb(cash)
            if (event.isChosen5(e)) return cb(cash)
        }
    }
    return {
        StartCashin: function (cb) {
            const handler = createHandler(cb)
            return listener("keydown").set(handler), {
                StopCashin: function () {
                    return listener("keydown").remove(handler)
                }
            }
        }
    }
}

export const { StartCashin } = cashinEmulator(event, listener)