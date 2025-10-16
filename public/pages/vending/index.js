import { vendingMessage } from '../../managers/html.js'
import { redirectTo } from '../../managers/router.js'
import { getProductIdx, orderCompleted } from '../../managers/order.js'
import vendingEmulator from '../../emulators/vendingEmulator.js'

// Функция с логикой завершения

function isVendingCompleted(completed, redirect, reload) {
    return function (isCompleted) {
        isCompleted
            ? (
                completed(),
                redirect()
            )
            : reload()
    }
}

// Получаем ручку включения эмулятора

const { Vend } = vendingEmulator(
    getProductIdx(),
    isVendingCompleted(
        orderCompleted,
        function () {
            redirectTo('choosingProduct')
        },
        function () {
            location.reload()
        }
    ),
    vendingMessage
)

// Запускаем вендинг

Vend()