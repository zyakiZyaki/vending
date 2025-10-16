export function choosePayEventInterpretator(variants, redirect) {
    return function (event, stop) {
        return Object
            .entries(variants)
            .some(
                function ([key, validate]) {
                    if (validate(event)) {
                        stop()
                        redirect(key)
                    }
                }
            )
    }
}

export function choosePayHandler(interpretator) {
    return function (stop) {
        return function (event) {
            interpretator(event, stop)
        }
    }
}