// Функция для работы с роутами

function router(location) {
    return {
        redirectTo: function (str) {
            return location
                .assign(
                    '../../pages/' + str
                    // Явно добавляем путь к файлам
                )
        }
    }
}

export const { redirectTo } = router(window.location)