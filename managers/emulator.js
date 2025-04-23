import listener from "./listener.js";
import data from './data.js'
import event from "./event.js";

function emulator() {
    // Объявляем обработчик в замыкании, будем его перезаписывать, чтобы был доступен для методов удаления
    let handler;

    return {
        StartCashin: function (cb) {
            if (!handler) {
                handler = function (e) {
                    if (event.isChosen1(e)) {
                        return cb(10)
                    }
                    if (event.isChosen2(e)) {
                        return cb(20)
                    }
                    if (event.isChosen5(e)) {
                        return cb(50)
                    }
                }
                return listener("keydown").set(handler)
            }
        },
        StopCashin: function () {
            if (handler) {
                return listener("keydown").remove(handler), (handler = null)
            }
        },
        BankCardPurchase: function (amount, cb, display_cb) {

            let isBankingProcess = false // Процесс оплаты запущен?
            let isCancel = false // Нажата кнопка отмены?

            const messages = {
                init: `Сумма к оплате: ${amount}₽.
                Приложите карту.`,
                success: "Транзакция успешна!",
                fail: `Транзакция не удалась,
                попробуйте еще...`,
                process: ["Обработка запроса...", "Соединение с хостом...", "Получение результата..."],
                cancel: "Принудительная отмена."
            }

            // Инкапсулируем таймаут в промис
            function process(msg) {
                return new Promise((resolve) => {
                    display_cb(msg),
                        setTimeout(() => {
                            resolve()
                        }, 1000);
                });
            }

            // Функция для показа массива сообщений
            function showMessage(messages) {
                return (Array.isArray(messages) ? messages : [messages]) //Проверяем массив или строка
                    .reduce(
                        (promise, message) =>
                            promise.then(() => process(message)),
                        Promise.resolve()
                    );
            }

            // Отмена банкинга
            function cancelBankCard(self) {
                return showMessage(messages.cancel)
                    .then(() => {
                        self.BankCardCancel()
                        cb(false)
                    })
            }
            handler = function (e) {
                if (event.isCancelCard(e)) {
                    return isBankingProcess ? isCancel = true : cancelBankCard(this)
                }
                if (event.isSuccesCard(e) || event.isFailCard(e)) {
                    if (isBankingProcess) {
                        return
                    }
                    else {
                        isBankingProcess = true,
                            showMessage([...messages.process, event.isSuccesCard(e) ? messages.success : messages.fail])
                                .then(() => isCancel ? cancelBankCard(this) : cb(event.isSuccesCard(e)))
                    }
                }
            }.bind(this)

            return showMessage(messages.init), listener('keydown').set(handler)

        },
        BankCardCancel: function () {
            // Удаляем обработчик
            return listener('keydown').remove(handler)
        },
        Vend: function (product_idx, cb, display_cb) {
            // Для вывода методом на экран сообщений, необходимо еше передать колбэк display_cb по аналогии с BankCardPurchase(в задании его нет)
            const messages = {
                init: "Процесс вендинга запущен!",
                success: `Вот ваш: ${data.getProductTitle(product_idx)}`,  // Как бы получаем продукт из базы(data), и выводим на экран(иммитируем выдачу)
                fail: "Приготовление не удалось, попробуйте еще..."
            }
            function vending(e) {
                if (event.isChosen1(e) || event.isChosen0(e)) {
                    //Удаляем лисенер
                    listener("keydown").remove(vending)
                    // При нажатии 1
                    if (event.isChosen1(e)) {
                        display_cb(messages.success)
                        return process(function () {
                            return cb(true)
                        })
                    }
                    //При нажатии 2
                    if (event.isChosen0(e)) {
                        display_cb(messages.fail)
                        return process(function () {
                            return cb(false);
                        })
                    }
                }
            }
            return display_cb(messages.init), listener("keydown").set(vending)
        }
    }
}

export default emulator()