// Функция для Лисенера

function listener(setListener, removeListener) {
    return function (event, cb) {
        return {
            setListener: function () {
                return setListener(event, cb)
            },
            removeListener: function () {
                return removeListener(event, cb)
            }
        }
    }
}

export default listener(document.addEventListener, document.removeEventListener)