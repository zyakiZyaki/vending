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
export function showMessage(display_cb) {
    return function (messages) {
        return (Array.isArray(messages) ? messages : [messages]) //Проверяем массив или строка
            .reduce(
                (promise, message) =>
                    promise.then(() => process(message, display_cb)),
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

export function resultStagePayment(show, cb) {
    return function ({ msg, result, isComplited }) {
        return show(msg)
            .then(() => {
                if (result === undefined) {
                    return
                }
                isComplited && typeof result === 'boolean'
                    ?
                    cb(result)
                    :
                    result()

            })
    }
}

export function cbWrapperWithCancelAllListeners(removeListeners) {
    return function (cb) {
        return function (result) {
            removeListeners()
            return cb(result)
        }
    }
}