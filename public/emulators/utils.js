// Функция вызывающая задержку после вызова display_cb
function showMessageProcess(msg, display_cb) {
    return new Promise(
        function (resolve) {
            display_cb(msg) // Вызываем сразу колбэк с сообщением
            setTimeout(resolve, 1000) // Резолвим промис после 1 сек задержки
        })
}

// Функция приведения сообщения к массиву
function formatedMsgs(msgs) {
    //Проверяем массив или одно сообщение, если одно - оборачиваем в массив
    return Array.isArray(msgs) ? msgs : [msgs]
}

// Универсальная функция для показа сообщений
export function showMessages(display_cb) {
    return function (messages) {
        return formatedMsgs(messages)
            .reduce(
                (acc, message) =>
                    acc.then(
                        function () {
                            return showMessageProcess(message, display_cb)
                        }
                    ),
                Promise.resolve()
            )
    }
}

// Функция завершения процесса оплаты
export function complited(stopListen, show, cb) {
    return function (msg, result) {
        stopListen()
        return show(msg)
            .then(
                function () {
                    return cb(result)
                }
            )
    }
}

// Функция интерпретации события, согласно объекту с вариантами
export function eventInterpretator(variants) {
    return function (event, cb) {
        return Object
            .entries(variants)
            .some(
                function ([key, validate]) {
                    if (validate(event)) {
                        cb(
                            Number(key) // Преобразуем в число
                        )
                        return true // Возвращаем флаг для .some() остановить перебор
                    }
                }
            )
    }
}

// Функция интерпретирующая результат этапа банковской опалты
export function stageResultInterpretator(show, cb) {
    return function ({ msg, result }) {
        return show(msg)
            .then(
                function () {
                    return typeof result === 'boolean' // Если подается булево значение
                        ?
                        cb(result) // Вызываем колбэк и завершаем процесс
                        :
                        Promise
                            .race(result) // В противном случае ожидаем победителя в гонке промисов
                            .then(stageResultInterpretator(show, cb)) // И снова запускаем интерпретатор
                }
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
            function (resolve) {
                return listener(
                    'keydown', // Будем слушать клавиши
                    function (event) { // Передаем в Handler событие
                        condition(event) && resolve(result) // При выполнении условия событием резолвим результат
                    }
                ).setListener() // Ставим лисенер
            }
        )
    }
}