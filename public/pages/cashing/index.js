import { redirectTo } from "../../managers/router.js"
import { getNewAmount, setPaidStatusTrue, getProductPrice } from '../../managers/order.js'
import { reRenderAmountBlock, renderBlockWithChange } from "../../managers/html.js"
import cashinEmulator from "../../emulators/cashinEmulator.js"

// Функция логики процесса оплаты и сопутствующих действий

function processPayment(getAmount, cont, price, finish) {
    return function (cash) {
        return (
            function (amount) {
                amount < price // Условие работы эмулятора
                    ?
                    cont(amount)
                    :
                    finish(amount - price)
            }
        )(getAmount(cash)) // После ввода cash, вызываем ф-цию и получаем amount
    }
}

const { StartCashin, StopCashin } = // Получаем методы
    cashinEmulator(
        processPayment(
            getNewAmount,
            reRenderAmountBlock, // cont
            getProductPrice(), // price
            function (change) { // finish
                renderBlockWithChange(change),
                    setPaidStatusTrue(),
                    StopCashin(),
                    setTimeout(
                        () => redirectTo('vending'),
                        2000
                    )
            }
        )
    )

StartCashin() // Запуск эмулятора