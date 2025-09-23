import { isPressKeyA, isPressKeyD } from "../managers/event.js";
import listener from "../managers/listener.js";
import { showMessage, complited } from "./utils.js";
import { getProductTitle } from '../managers/data.js'

const messages = (product) => ({
    init: "Процесс вендинга запущен!",
    success: `Вот ваш: ${product}`,
    fail: "Приготовление не удалось, попробуйте еще..."
})

function handler( isSuccess, isFail ) {
    return function (complited, show, { init, success, fail }) {
        return (
            show(init),
            function (e) {
                if (isSuccess(e)) return complited(success, true)
                if (isFail(e)) return complited(fail, false)
            }
        )
    }
}

function vendingEmulator(showMessage, messages, handler, getProduct) {

    return function (product_idx, cb, display_cb) {

        const { setListener, removeListener } =
            listener("keydown",
                handler(
                    complited(
                        () => removeListener(),
                        showMessage(display_cb),
                        cb
                    ),
                    showMessage(display_cb),
                    messages(getProduct(product_idx)
                    )
                )
            )

        return {
            Vend: function () {
                return setListener()
            }
        }
    }
}

export default vendingEmulator(
    showMessage,
    messages,
    handler(
        isPressKeyA,
        isPressKeyD
    ),
    getProductTitle
)