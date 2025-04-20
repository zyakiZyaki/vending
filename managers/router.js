import routes from "../routes/index.js"

// Функция для работы с роутами

function router(routes) {
    return {
        redirectTo: function(str) {
            return window.location.href = routes[str]
        }
    }
}

export default router(routes)