import listener from "../managers/listener.js";
import { abortListeners } from "../managers/listener.js";
import { isPressKeyA, isPressKeyD, isPressKeyC } from "../managers/event.js";
import { showMessages, stageResultInterpretator, cbWrapperWithCancelAllListeners, createNewChannel } from "./utils.js";

const messages =
    (amount) => ({
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
    return function ({ init, process, fail, success, cancel }, interpretator) {
        return {
            start: function (next) {
                return next({
                    initListening: function (...listenedChannels) { // Получаем каналы
                        interpretator(
                            // Запускаем интерпретатор объекта с результатами
                            // Объект содержит сообщение(msg) и
                            // результат для логического продолжения:
                            // channels(массив промисов) или result(boolean)
                            {
                                msg: init,
                                channels: listenedChannels
                            }
                        )
                    },
                    failCannel:
                        createNewChannel(
                            isFail, // Условие возврата объекта ниже интерпретатором
                            {
                                msg: [...process, fail],
                                result: false
                            }
                        ),
                    successCannel: function (cancel) {
                        return createNewChannel(
                            isSuccess,
                            {
                                msg: process,
                                channels: [
                                    cancel,
                                    {
                                        msg: success,
                                        result: true
                                    }
                                ]
                            }
                        )
                    }
                })
            },
            cancel:
                createNewChannel(
                    isCancel,
                    {
                        msg: cancel,
                        result: false
                    }
                )

        }
    }
}

function bankEmulator(bankCardPurchaseFactory, result, displayWrapper, messages, cbWrapper) {

    return function (amount, cb, display_cb) {

        const { start, cancel } = // Получаем ручки включения и отмены

            bankCardPurchaseFactory(
                messages(amount),
                result(
                    displayWrapper(display_cb), // Оборачиваем display_cb в функцию промис, показывающую сообщение через 1 сек
                    cbWrapper(cb) // Оборачиваем cb в функцию, удалющую все висящие лисенеры.
                )
            )

        return {

            BankCardPurchase: function (cancelCannel) {
                return start( // Стартуем, чтобы получить все методы фактори-функции
                    ({ initListening, successCannel, failCannel }) =>
                        initListening( // Начинаем прослушивание кнопок
                            cancelCannel, // Добавляем кнопку отмены из колбэка
                            failCannel,
                            successCannel(
                                cancelCannel
                            )
                        )
                )
            },
            
            BankCardCancel: cancel

        }
    }
}

export default bankEmulator(
    bankCardPurchaseFactory(
        createNewChannel(
            listener("keydown")
        ),
        isPressKeyC,
        isPressKeyD,
        isPressKeyA
    ),
    stageResultInterpretator,
    showMessages,
    messages,
    cbWrapperWithCancelAllListeners(
        abortListeners // Здесь используем AbortController для удаления всех слушателей
    )
)