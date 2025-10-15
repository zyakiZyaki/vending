// Функция для Лисенера

const controller = new AbortController()

function listener(
    setListener,
    removeListener,
    controller
) {
    return function (eventType) {
        return function (cb) {
            return {
                setListener: function () {
                    return console.log(eventType), setListener(eventType, cb, { signal: controller.signal })
                },
                removeListener: function () {
                    return removeListener(eventType, cb, { signal: controller.signal })
                }
            }
        }
    }
}

export default listener(
    document.addEventListener,
    document.removeEventListener,
    controller
)

export function abortListeners() {
    controller.abort()
}