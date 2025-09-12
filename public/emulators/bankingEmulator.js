import listener from "../managers/listener.js";
import { isPressKeyA, isPressKeyD, isPressKeyC } from "../managers/event.js";
import { showMessage, complited } from "./utils.js";

const messages = (amount) => ({
    init: `Сумма к оплате: ${amount}₽.
                Приложите карту.`,
    success: "Транзакция успешна!",
    fail: `Транзакция не удалась,
                попробуйте еще...`,
    process: ["Обработка запроса...", "Соединение с хостом...", "Получение результата..."],
    cancel: "Принудительная отмена."
})

function handler(isCancelCardPay, isSuccessCardPay, isFailCardPay) {
    return function ({ init, success, fail, process }, show, complited, BankCardCancel) {
        let [isCancelEvent, isSuccessProcessStarted] = [false, false] // Переменные для хранения состояния
        return (
            show(init),
            function (e) {
                if (isCancelCardPay(e)) {
                    return isSuccessProcessStarted
                        ?
                        (isCancelEvent = true)
                        :
                        BankCardCancel()
                }

                if (isFailCardPay(e)) {
                    return !isSuccessProcessStarted
                        && complited([...process, fail], false)
                }

                if (isSuccessCardPay(e)) {
                    return !isSuccessProcessStarted
                        && (
                            isSuccessProcessStarted = true,
                            show(process)
                                .then(
                                    () => isCancelEvent
                                        ?
                                        BankCardCancel()
                                        :
                                        complited(success, true)
                                )
                        )
                }
            }
        )
    }
}

function bankEmulator(listener, messages, showMessage, handler, complited) {

    return function (amount, cb, display_cb, BankCardCancel) {

        const { setListener, removeListener } =
            listener("keydown",
                handler(
                    messages(amount),
                    showMessage(display_cb),
                    complited(
                        () => removeListener(),
                        showMessage(display_cb),
                        cb
                    ),
                    () => BankCardCancel()
                )
            )

        return {
            BankCardPurchase: function () {
                return setListener()
            },
            // Так как в ТЗ требуется написать этот метод и использовать,
            // добавил в него удаление лисенера, завершение заказа с сообщением отмены и cb(false)
            // Заллогировал, чтобы можно было подтвердить работу в консоли
            BankCardCancel: function () {
                return console.log('BankCardCancel'),
                    complited(
                        () => removeListener(),
                        showMessage(display_cb),
                        cb
                    )(
                        messages().cancel,
                        false
                    )
            }
        }
    }
}

export default bankEmulator(
    listener,
    messages,
    showMessage,
    handler(
        isPressKeyC,
        isPressKeyA,
        isPressKeyD
    ),
    complited
)