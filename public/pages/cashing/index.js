import { redirectTo } from "../../managers/router.js"
import { getNewAmount, setPaidStatusTrue, getProductPrice } from '../../managers/order.js'
import { reRenderAmountBlock, renderBlockWithChange } from "../../managers/html.js"
import cashinEmulator from "../../emulators/cashinEmulator.js"

const { StartCashin, StopCashin } =
    cashinEmulator(
        processPayment(
            getNewAmount,
            reRenderAmountBlock,
            renderBlockWithChange,
            setPaidStatusTrue,
            getProductPrice(),
            function () {
                return StopCashin() // Подаем метод колбэком
            },
            function () {
                return setTimeout(
                    () => redirectTo('vending'),
                    2000
                )
            }
        )
    )

StartCashin()


// Функция логики процесса оплаты и сопутствующих действий

function processPayment(
    getNewAmount,
    showOnDisplay,
    showOnDisplayChange,
    setComplitedStatus,
    price,
    stopEmulator,
    redirectToNextPage
) {
    return function (cash) {
        const amount = getNewAmount(cash) // После ввода cash, получаем сумму amount
        return amount < price // Условие работы эмулятора
            ?
            (
                showOnDisplay(amount)
            )
            :
            (
                setComplitedStatus(),
                showOnDisplayChange(amount - price),
                stopEmulator(),
                redirectToNextPage()
            )
    }
}