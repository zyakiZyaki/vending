import { redirectTo } from '../../managers/router.js'
import { setPaidStatusTrue, getProductPrice } from '../../managers/order.js'
import { pinpadMessage } from '../../managers/html.js'
import bankingEmulator from '../../emulators/bankingEmulator.js'

//Если оплата прошла, меняем статус заказа на оплаченный и переадресуем на страницу вендинга
//В противном случае перезагружаем страницу

function isPaid(completedStatus, redirect, reload) {
    return function (isCompleted) {
        isCompleted
            ? (
                completedStatus(),
                redirect()
            )
            : reload()
    }
}


function banking({ BankCardPurchase, BankCardCancel }) {

    // Инициируем процесс приема оплаты и передаем метод отмены колбэком
    BankCardPurchase(
        BankCardCancel
        // Колбэк можно было бы передать явно и внутри эмулятора,
        // Но так как в ТЗ требуется написать этот метод на уровне параллельном с BankCardPurchase,
        // То почему бы его не использовать такую передачу
        // Это позволяет включит метод в работу приложения
        // и придает ему в этом контексте смысл
    )

}

banking(
    bankingEmulator(
        getProductPrice(),
        isPaid(
            setPaidStatusTrue,
            function() {
                redirectTo('vending')
            },
            function() {
                location.reload()
            }
        ),
        pinpadMessage
    )
)