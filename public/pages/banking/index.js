import { redirectTo } from '../../managers/router.js'
import { setPaidStatusTrue, getProductPrice } from '../../managers/order.js'
import { pinpadMessage } from '../../managers/html.js'
import bankingEmulator from '../../emulators/bankingEmulator.js'

//Если оплата прошла, меняем статус заказа на оплаченный и переадресуем на страницу вендинга
//В противном случае перезагружаем страницу

function isPaid(completed, redirect, reload) {
    return function (bool) {
        bool
            ? (
                completed(),
                redirect()
            )
            : reload()
    }
}


function banking({ BankCardPurchase, BankCardCancel }) {

    BankCardPurchase(BankCardCancel) // Инициируем процесс приема оплаты и передаем метод отмены колбэком

}

banking(
    bankingEmulator(
        getProductPrice(),
        isPaid(
            setPaidStatusTrue,
            () => redirectTo('vending'),
            () => location.reload()
        ),
        pinpadMessage
    )
)