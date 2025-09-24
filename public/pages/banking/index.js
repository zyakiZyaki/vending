import { redirectTo } from '../../managers/router.js'
import { setPaidStatusTrue, getProductPrice } from '../../managers/order.js'
import { pinpadMessage } from '../../managers/html.js'
import bankingEmulator from '../../emulators/bankingEmulator.js'

//Если оплата прошла, меняем статус заказа на оплаченный и переадресуем на страницу вендинга
//В противном случае перезагружаем страницу

function isPaid(changeOrderStatus, redirect, reload) {
    return function (bool) {
        return bool
            ?
            (
                changeOrderStatus(),
                redirect()
            )
            :
            (
                reload()
            )
    }
}


//Запускаем эмулятор

bankingEmulator
    .BankCardPurchase(
        getProductPrice(),
        isPaid(
            setPaidStatusTrue,
            () => redirectTo('vending'),
            () => location.reload()
        ),
        pinpadMessage
    )