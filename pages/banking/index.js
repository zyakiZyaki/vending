import router from '../../managers/router.js'
import order from '../../managers/order.js'
import html from '../../managers/html.js'
import emulator from '../../managers/emulator.js'

//Сразу вызываем эмулятор

emulator.BankCardPurchase(order.getPrice(), isPaymentOk, html.pinpadMessage)

//Если оплата прошла, меняем статус заказа на оплаченный и переадресуем на страницу вендинга
//В противном случае перезагружаем страницу

function isPaymentOk(bool) {
    if(bool) {
        return order.setPaidTrue(), router.redirectTo('vending')
    }
    else {
        return location.reload()
    }
}