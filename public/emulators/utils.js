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

// Функция интерпретации события, согласно объекту с вариантами
export function eventInterpretator(variants) {
    return function (event, cb) {
        return Object
            .entries(variants)
            .some(
                ([key, validate]) => {
                    if (validate(event))
                    cb(
                        Number(key) // Преобразуем в число
                    )
                    return true // Возвращаем флаг для .some() остановить перебор
                }
            )
    }
}

// Функция интерпретирующая результат этапа банковской опалты
export function stageResultInterpretator(show, cb) {
    return function ({ msg, result }) {
        return show(msg)
            .then(() =>
                typeof result === 'boolean' // Если подается булево значение - вызываем колбэк и завершаем процесс
                    ?
                    cb(result)
                    :
                    Promise 
                        .race(result) // В ппотивном случае ожидаем победителя в гонке промисов
                        .then(stageResultInterpretator(show, cb)) // И снова запускаем интерпретатор
            )
    }
}

// Функция обертка для cb, удаляющая все висящие лисенеры при завершении процесса оплаты
export function cbWrapperWithCancelAllListeners(removeListeners) {
    return function (cb) {
        return function (result) {
            removeListeners()
            return cb(result)
        }
    }
}

// Функция, создающая новый слушатель на канал/кнопку
export function createNewChannel(listener) {
    return function (condition, result) { // Принимает условие и результат разрешения промиса
        return new Promise(
            resolve =>
                listener('keydown',
                    function (event) {
                        condition(event) && resolve(result)
                    }
                ).setListener()
        )
    }
}