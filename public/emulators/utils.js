// Инкапсулируем таймаут в промис
function process(msg, cb) {
    return new Promise((resolve) => {
        cb(msg),
            setTimeout(() => {
                resolve()
            }, 1000);
    });
}

// Функция для показа массива сообщений
export function showMessage(cb) {
    return function (messages) {
        return (Array.isArray(messages) ? messages : [messages]) //Проверяем массив или строка
            .reduce(
                (promise, message) =>
                    promise.then(() => process(message, cb)),
                Promise.resolve()
            );
    }
}

// Функция завершения процесса оплаты
export function complited(stopListen, show, cb) {
    return function (msg, result) {
        return stopListen(), show(msg).then(() => cb(result))
    }
}