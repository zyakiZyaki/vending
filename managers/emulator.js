import listener from "./listener.js";
import data from './data.js'
import event from "./event.js";

// Вспомогательная функция process, на 1 секунду сдвигает выполнение следующе операции.
// Используется только для иммитации процесса работы оборудования.
// Из-за данной функции немного посыпалась очередь задач и код стал более громоздкий.

function process(callback) {
    return setTimeout(callback, 1000)
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
            // Сохраняем внешний контекст this
            const self = this

            const messages = {
                init: `Сумма к оплате: ${amount}₽.
                Приложите карту.`,
                success: "Транзакция успешна!",
                fail: `Транзакция не удалась,
                попробуйте еще...`,
                processing1: "Обработка запроса...",
                processing2: "Соединение с хостом...",
                processing3: "Получение результата...",
                cancel: "Принудительная отмена."
            }

            // Функция с замыканием для управления состоянием отмены операции в процессе
            function cancelInProcessing() {
                return (function () {
                    // Переменная isCancel находится в области видимости замыкания
                    let isCancel = false;
                    // Возвращаемая функция управляет состоянием isCancel
                    return function (e) {
                        if (e) {
                            // Если передан аргумент, проверяем условие и обновляем isCancel
                            if (event.isCancelCard(e)) {
                                isCancel = true;
                            }
                        } else {
                            // Если аргумент не передан, возвращаем текущее значение isCancel
                            return isCancel;
                        }
                    };
                })();
            }

            //Функция отмены банкинга до процесса
            function cancelBeforeProcessing(e) {
                if (event.isCancelCard(e)) {
                    return self.BankCardCancel(),
                        cancelBankCard()
                }
            }
            // Переиспользуемая часть при отмене банкинга
            function cancelBankCard() {
                return display_cb(messages.cancel),
                    process(function () {
                        return cb(false)
                    })
            }
            handler = function (e) {
                if (event.isSuccesCard(e) || event.isFailCard(e)) {
                    //Удаляем лисенер отмены операции до процессинга
                    listener('click').remove(cancelBeforeProcessing)
                    //Удаляем лисенер на нажатие клавиш успешная/неуспешная операция
                    listener("keydown").remove(handler)
                    //Ставим обработчик, который отлавливает нажатие кнопки отмены
                    listener("click").set(cancelInProcessing)
                    // Выводим на экран процесс обработки карты1
                    display_cb(messages.processing1)
                    return process(function () {
                        // Выводим на экран процесс обработки карты2
                        display_cb(messages.processing2)
                        return process(function () {
                            // Выводим на экран процесс обработки карты3
                            display_cb(messages.processing3)
                            // В зависимости от нажатой кнопки - успешная/неуспешная транзакция
                            return process(function () {
                                if (event.isSuccesCard(e)) {
                                    display_cb(messages.success)
                                    return process(function () {
                                        //Проверяем была ли нажата кнопка отмены, если да, то отменяем транзакцию
                                        return cancelInProcessing() ? cancelBankCard() : cb(true)
                                    });
                                }
                                if (event.isFailCard(e)) {
                                    display_cb(messages.fail)
                                    return process(function () {
                                        return cancelInProcessing() ? cancelBankCard() : cb(false)
                                    });
                                }
                            })
                        })
                    })
                }
            }

            return display_cb(messages.init),
                listener('keydown').set(handler), // Слушатель на успех/неуспех
                listener('click').set(cancelBeforeProcessing) // Слушатель на клик отмены
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