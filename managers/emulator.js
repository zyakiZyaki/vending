import listener from "./listener.js";
import data from './data.js'
import event from "./event.js";

// Вспомогательная функция process, на 4 секунды сдвигает выполнение следующе операции.
// Используется только для иммитации процесса работы оборудования.
// Из-за данной функции немного посыпалась очередь задач и код стал более громоздкий.

function process(callback) {
    return setTimeout(callback, 2000)
}

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
            const messages = {
                init: `Сумма к оплате: ${amount}₽.
                Приложите карту.`,
                success: "Транзакция успешна!",
                fail: `Транзакция не удалась,
                попробуйте еще...`,
                processing: "Обработка карты...",
                cancel: "Принудительная отмена."
            }
            handler = function (e) {
                // Если нажата клавиша 2 - отменяем процесс оплаты
                if (event.isChosen2(e)) {
                    return this.BankCardCancel(),
                        display_cb(messages.cancel),
                        process(function () {
                            return cb(false)
                        });
                }
                // Если нажаты 1 или 0
                if (event.isChosen1(e) || event.isChosen0(e)) {
                    //Выбор сделан, лисенер удаляем
                    listener("keydown").remove(handler)
                    // Выводим на экран процесс обработки карты
                    display_cb(messages.processing)
                    // В зависимости от нажатой кнопки - успешная/неуспешная транзакция
                    process(function () {
                        if (event.isChosen1(e)) {
                            return display_cb(messages.success),
                                process(function () {
                                    return cb(true)
                                });
                        }
                        if (event.isChosen0(e)) {
                            return display_cb(messages.fail),
                                process(function () {
                                    return cb(false)
                                });
                        }
                    })
                }
            }.bind(this) // Байндим контекст, чтобы работал BankCardCancel

            return display_cb(messages.init), listener('keydown').set(handler)
        },
        BankCardCancel: function () {
            // Удаляем функцию и обработчик
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