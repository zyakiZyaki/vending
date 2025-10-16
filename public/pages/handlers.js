import listener from "../managers/listener.js"


function createListenerWithRemove(listener) {
    return function (eventType, handler) {
        const { setListener, removeListener } =
            listener
                (eventType)
                (
                    handler(
                        function () {
                            removeListener()
                        }
                    )
                )

        setListener()
    }
}

export const listen = createListenerWithRemove(listener)