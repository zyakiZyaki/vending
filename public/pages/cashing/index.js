import { redirectTo } from "../../managers/router.js"
import { getNewAmount, setPaidStatusTrue, getProductPrice } from '../../managers/order.js'
import { reRenderAmountBlock, renderBlockWithChange } from "../../managers/html.js"
import cashinEmulator from "../../emulators/cashinEmulator.js"

// Функция логики процесса оплаты и сопутствующих действий

function processPayment(getAmount, cont, price, finish) {
    return function (cash) {
        return (
            function (amount) {
                // Условие работы эмулятора
                amount < price ? cont(amount) : finish(amount - price)
            }
        )(getAmount(cash)) // После получения cash, вызываем ф-цию и получаем amount
    }
}

// Завершение оплаты

function finishPayProccess(display, complitedStatus, stop, redirect) {
    return function (change) {
        display(change)
        complitedStatus()
        stop()
        setTimeout(
            function () {
                redirect()
            }, 2000
        )
    }
}

const { StartCashin, StopCashin } = // Получаем методы
    cashinEmulator(
        processPayment(
            getNewAmount,
            reRenderAmountBlock,
            getProductPrice(),
            finishPayProccess(
                renderBlockWithChange,
                setPaidStatusTrue,
                function() {
                    StopCashin()
                },
                function() {
                    redirectTo('vending')
                }
            )
        )
    )

StartCashin() // Запуск эмулятора