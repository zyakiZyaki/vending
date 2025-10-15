// Функция для работы с роутами

function router(routes, location) {
    return {
        redirectTo: function (str) {
            return location
                .assign(
                    routes[str]
                )
        }
    }
}

// Объект с роутами

const routes = {
    choosingProduct: '../../pages/choosingProduct/',
    choosingPayMethod: '../../pages/choosingPayMethod/',
    vending: '../../pages/vending/',
    cashing: '../../pages/cashing/',
    banking: '../../pages/banking/'
}

export const { redirectTo } = router(routes, window.location);