import emulator from "../../managers/emulator.js"
import router from "../../managers/router.js"
import order from '../../managers/order.js'
import html from "../../managers/html.js"


startCashin(order.getPrice()) //Вызываем функцию начала оплаты и заряжаем в нее "price" товара.

function startCashin(price) { // Храним прайс в течении всей оплаты, после вызова автоматически запустится вложенная функция.
    return (function payForOrder(cash) { // Далее она будет вызываться рекурсивно с колбэком(cash), пока не достигнем условия выхода из рекурсии.
        return ( // После получения cash сразу вызываем следующую функцию
            function (amount = order.refreshAmount(cash)) { //Обновляем amount
                if (amount === 0) {
                    return emulator.StartCashin(payForOrder)
                }
                if (price <= amount) {
                    return payIsFinished(amount - price)
                }
                else {
                    return html.reRenderAmount(amount)
                }
            }
        )()
    })()
}

// Возможно такой подход(выше) кажется непривычным(а может быть и нет), но он позволяет избегать хранения ненужного состояния
// и передавать данные из функции в функцию по цепочке.

// При успешном завершении останавливаем эмулятор,
// показываем блок сдачи на странице,
// меняем статус заказа на оплаченный
// и переходим на страницу вендинга

function payIsFinished(change) {
    return emulator.StopCashin(),
        html.renderBlockWithChange(change),
        order.setPaidTrue(),
        setTimeout(() => router.redirectTo('vending'), 2000)
}