import { vendingMessage } from '../../managers/html.js'
import { redirectTo } from '../../managers/router.js'
import { isPaidStatusTrue, getProductIdx, orderCompleted } from '../../managers/order.js'
import vendingEmulator from '../../emulators/vendingEmulator.js'

//Если выдача прошла успешно, завершаем заказ и переходим на начальную страницу
// В противном случае обновляем страницу

function isVendingCompleted(orderCompleted, redirect, reload) {
    return function (bool) {
        if (bool) {
            return orderCompleted(), redirect()
        }
        else {
            return reload()
        }
    }
}

//Проверяем статус оплачен ли заказ, если да то запускаем эмулятор выдачи

if (isPaidStatusTrue()) {
    vendingEmulator
        .Vend(
            getProductIdx(),
            isVendingCompleted(
                orderCompleted,
                () => redirectTo('choosingProduct'),
                () => location.reload()
            ),
            vendingMessage
        )
} 