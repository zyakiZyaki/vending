import listener from "../managers/listener.js";
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
    return function ({ init, process, fail, success, cancel }, resultInterpretator) {
        return {
            start: function (next) {
                return next({
                    raceChannels: function (...listenedChannels) { // Получаем каналы
                        return resultInterpretator(
                            // Запускаем интерпретатор объекта с результатами
                            // Объект содержит побочный эффект(сообщение) и
                            // результат для логического продолжения(возврата): промис(ы) или cb(boolean)
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
                    cbWrapper(cb) // Оборачиваем cb в функцию, удалющую все висящие лисенеры.
                    // То есть, когда возвращаем cb, действие завершено и больше бессмысленно слушать
                )
            )
                .start( // Стартуем, чтобы получить все методы фактори-функции
                    ({ raceChannels, listenCancelCannel, listenSuccesCannel, listenFailCannel }) =>
                        raceChannels( // Начинаем прослушивание трех кнопок
                            listenCancelCannel,
                            listenFailCannel,
                            listenSuccesCannel(
                                listenCancelCannel //Передаем канал отмены колбэком,
                                // чтобы иметь возможность отменить уже запущенный успешный сценарий
                            )
                        )
                )
        },
        // Метод нигде в коде не используется,
        // но при вызове удаленит все лисенеры, вызовет cb(false)
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
    showMessages,
    messages,
    cbWrapperWithCancelAllListeners(
        listener().cancelAll // Здесь используем AbortController для удаления всех слушателей
    )
)