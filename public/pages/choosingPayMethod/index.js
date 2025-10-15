import { isChosenCashPayMethod, isChosenCardPayMethod } from '../../managers/event.js'
import listener from '../../managers/listener.js'
import { redirectTo } from '../../managers/router.js'


function choosingPayMethod(listener, handler) {
    const { setListener, removeListener } =
        listener(
            handler(
                function () {
                    removeListener()
                }
            )
        )
    setListener()
}

function handler(isCash, isCard, redirectTo) {
    return function (stop) {
        return function (e) {
            if (isCash(e) || isCard(e)) {
                stop()
                redirectTo(
                    isCash(e) ? 'cashing' : 'banking'
                )
            }
        }
    }
}

choosingPayMethod(
    listener("click"),
    handler(
        isChosenCashPayMethod,
        isChosenCardPayMethod,
        redirectTo
    )
)