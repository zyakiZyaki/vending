// Функция для Лисенера

function listener(
    setListener,
    removeListener,
    controller
) {
    return function (event, cb) {
        return {
            setListener: function () {
                return console.log(event), setListener(event, cb, { signal: controller.signal })
            },
            removeListener: function () {
                return removeListener(event, cb, { signal: controller.signal })
            },
            cancelAll: function () {
                console.log('abort_controller'), controller.abort()
            }
        };
    };
}

export default listener(
    document.addEventListener,
    document.removeEventListener,
    new AbortController()
);