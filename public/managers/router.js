import routes from "../routes/index.js"

// Функция для работы с роутами

function router(routes, location) {
    return {
        redirectTo: function(str) {
            return location.assign(routes[str])
        }
    }
}

export const { redirectTo } = router(routes, window.location);