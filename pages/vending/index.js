import html from '../../managers/html.js'
import router from '../../managers/router.js'
import order from '../../managers/order.js'
import emulator from '../../managers/emulator.js'

//Проверяем статус оплачен ли заказ, если да то запускаем эмулятор выдачи

if(order.isPaid()) {
    emulator.Vend(order.getIdx(), isVendingOk, html.vendingMessage)
}

//Если выдача прошла успешно, завершаем заказ и переходим на начальную страницу
// В противном случае обновляем страницу
        
function isVendingOk(bool) {
    if(bool) {
        return order.completed(), router.redirectTo('choosingProduct')
    }
    else {
        return location.reload()
    }
}