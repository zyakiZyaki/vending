import { isPressKeyA, isPressKeyD } from "../managers/event.js";
import listener from "../managers/listener.js";
import { showMessages, complited } from "./utils.js";
import { getProductTitle } from '../managers/data.js'

const messages = (product) => ({
    init: "Процесс вендинга запущен!",
    success: `Вот ваш: ${product}`,
    fail: "Приготовление не удалось, попробуйте еще..."
})

function handler(isSuccess, isFail) {
    return function (complited, show, { init, success, fail }) {
        return show(init),
            function (e) {
                if (isSuccess(e)) return complited(success, true)
                if (isFail(e)) return complited(fail, false)
            }
    }
}

function vendingEmulator(listener, showMessages, messages, handler, getProduct) {

    return {
        Vend: function (product_idx, cb, display_cb) {
            const { setListener, removeListener } =
                listener(
                    handler(
                        complited(
                            () => removeListener(),
                            showMessages(display_cb),
                            cb
                        ),
                        showMessages(display_cb),
                        messages(
                            getProduct(product_idx)
                        )
                    )
                )
            return setListener()
        }
    }
}

export default vendingEmulator(
    listener("keydown"),
    showMessages,
    messages,
    handler(
        isPressKeyA,
        isPressKeyD
    ),
    getProductTitle
)