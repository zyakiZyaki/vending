import listener from "../managers/listener.js";
import { isPressKeyA, isPressKeyD, isPressKeyC } from "../managers/event.js";
import { showMessage, stageResultInterpretator, cbWrapperWithCancelAllListeners, createNewChannel } from "./utils.js";

const messages = (amount) => ({
    init: `Сумма к оплате: ${amount}₽.
                Приложите карту.`,
    success: "Транзакция успешна!",
    fail: `Транзакция не удалась,
                попробуйте еще...`,
    process: ["Обработка запроса...", "Соединение с хостом...", "Получение результата..."],
    cancel: "Принудительная отмена."
})

// Фабричная функция с прослушиваемыми каналами(кнопками) и методом их инициации
function bankCardPurchaseFactory(createNewChannel, isCancel, isFail, isSuccess) {
    return function ({ init, process, fail, success, cancel }, resultInterpretator) {
        return {
            start: function (next) {
                return next({
                    raceChannels: function (...listenedChannels) { // Получаем каналы
                        return resultInterpretator( // Запускаем интерпретатор результата
                            {
                                msg: init,
                                result: listenedChannels
                            }
                        )
                    },
                    listenCancelCannel:
                        createNewChannel(
                            isCancel,
                            {
                                msg: cancel,
                                result: false
                            }
                        ),
                    listenFailCannel:
                        createNewChannel(
                            isFail,
                            {
                                msg: [...process, fail],
                                result: false
                            }
                        ),
                    listenSuccesCannel: function (cancelChannel) {
                        return createNewChannel(
                            isSuccess,
                            {
                                msg: process,
                                result: [
                                    cancelChannel,
                                    {
                                        msg: success,
                                        result: true
                                    }
                                ]
                            }
                        )
                    }
                })
            }
        }
    }
}

function bankEmulator(bankCardPurchaseFactory, result, displayWrapper, messages, cbWrapper) {
    return {
        BankCardPurchase: function (amount, cb, display_cb) {
            return bankCardPurchaseFactory(
                messages(amount),
                result(
                    displayWrapper(display_cb), // Оборачиваем display_cb в функцию промис, показывающую сообщение через 1 сек
                    cbWrapper(cb) // Оборачиваем cb в функцию, удалющую все висящие лисенеры
                )
            )
                .start(
                    ({ raceChannels, listenCancelCannel, listenSuccesCannel, listenFailCannel }) =>
                        raceChannels(
                            listenCancelCannel,
                            listenFailCannel,
                            listenSuccesCannel(
                                listenCancelCannel
                            )
                        )
                )
        },
        // Метод нигде в коде не используется,
        // но при вызове вернет удаление всех лисенеров, вызов колбэка с false
        // и выведет сообщение об отмене
        BankCardCancel: function () {
            return result(
                displayWrapper(display_cb),
                cbWrapper(cb)
            )({
                msg: cancel,
                result: false
            })
        }
    }
}

export default bankEmulator(
    bankCardPurchaseFactory(
        createNewChannel(listener),
        isPressKeyC,
        isPressKeyD,
        isPressKeyA
    ),
    stageResultInterpretator,
    showMessage,
    messages,
    cbWrapperWithCancelAllListeners(
        listener().cancelAll
    )
)