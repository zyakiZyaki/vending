import listener from "../managers/listener.js";
import { isPressKeyA, isPressKeyD, isPressKeyC } from "../managers/event.js";
import { showMessage, resultStagePayment, cbWrapperWithCancelAllListeners, complited } from "./utils.js";

const messages = (amount) => ({
    init: `Сумма к оплате: ${amount}₽.
                Приложите карту.`,
    success: "Транзакция успешна!",
    fail: `Транзакция не удалась,
                попробуйте еще...`,
    process: ["Обработка запроса...", "Соединение с хостом...", "Получение результата..."],
    cancel: "Принудительная отмена."
})


function bankPaymentFactory(listener, handlerFirstStage, handlerSecondStage, isCancel, isFail, isSuccess) {
    return function ({ init, process, fail, success, cancel }, result) {
        return {
            initPayment: function () {
                result(
                    {
                        msg: init,
                        isComplited: false
                    }
                )
            },
            listenCancelCannel: function () {
                return new Promise(
                    wasPressed =>
                        listener('keydown',
                            e =>
                                isCancel(e)
                                && wasPressed(
                                        {
                                            msg: cancel,
                                            result: false,
                                            isComplited: true
                                        }
                                    )).setListener()
                )
            },
            listenMainChannel: function (cancel) {
                return new Promise(
                    wasPressed =>
                        listener('keydown',
                            handlerFirstStage(
                                isFail,
                                isSuccess,
                                wasPressed,
                                process,
                                fail,
                                success,
                                handlerSecondStage(result, cancel)
                            )
                        ).setListener()
                )
            },
            listenChannels: function (...args) {
                return Promise
                    .race(args)
                    .then(result)
            }
        }
    }
}


function handlerFirstStage(
    isFail,
    isSuccess,
    wasPressed,
    process,
    fail,
    success,
    nextStage
) {
    return function (e) {
        if (isFail(e)) {
            return wasPressed(
                {
                    msg: [...process, fail],
                    result: false,
                    isComplited: true
                }
            )
        }
        if (isSuccess(e)) {
            return wasPressed(
                {
                    msg: process,
                    result: () =>
                        nextStage(
                            {
                                isComplited: true,
                                msg: success,
                                result: true
                            }
                        ),
                    isComplited: false
                }
            )
        }
    }
}

function handlerSecondStage(result, cancel) {
    return function (success) {
        return Promise
            .race([
                cancel,
                success
            ])
            .then(result)
    }
}

function bankEmulator(bankPaymentFactory, result, displayWrapper, messages, cbWrapper) {
    return function (amount, cb, display_cb) {

        const { initPayment, listenCancelCannel, listenMainChannel, listenChannels } =
            bankPaymentFactory(
                messages(amount),
                result(
                    displayWrapper(display_cb),
                    cbWrapper(cb)
                )
            )

        return {
            BankCardPurchase: function (BankCardCancel) {
                return initPayment(),
                    listenChannels(
                        BankCardCancel,
                        listenMainChannel(
                            BankCardCancel
                        )
                    )
            },
            BankCardCancel: function () {
                return listenCancelCannel()
            }
        }
    }
}

export default bankEmulator(
    bankPaymentFactory(
        listener,
        handlerFirstStage,
        handlerSecondStage,
        isPressKeyC,
        isPressKeyD,
        isPressKeyA
    ),
    resultStagePayment,
    showMessage,
    messages,
    cbWrapperWithCancelAllListeners(
        listener().cancelAll
    )
)