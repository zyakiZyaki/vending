import listener from "../../managers/listener.js";
import { getIdxChosenProduct, getChosenCategory, isChosenNewCategory, isChosenProduct } from '../../managers/event.js'
import { reRenderMenu } from '../../managers/html.js'
import { redirectTo } from '../../managers/router.js'
import { getProductData } from '../../managers/data.js'
import { createNewOrder } from '../../managers/order.js'

function handler(isNewMenuItem, reRender, newItem, isProduct, getData, product, createOrder, redirect) {
    return function (stop) {
        return function (e) {
            // Если выбирают новый пункт меню - обновляем.
            if (isNewMenuItem(e)) {
                reRender(
                    newItem(e)
                )
            }
            // Если выбирают продукт - создаем заказ.
            if (isProduct(e)) {
                createOrder(
                    getData(
                        product(e) // Получаем выбранный напиток
                    )
                )
                stop() // Перестаем слушать
                redirect()
            }
        }
    }
}

function choosingProduct(listener, handler) {

    const { setListener, removeListener } =
        listener(
            handler(
                function () {
                    removeListener()
                }
            )
        )

    setListener()
}

choosingProduct(
    listener('click'),
    handler(
        isChosenNewCategory,
        reRenderMenu,
        getChosenCategory,
        isChosenProduct,
        getProductData,
        getIdxChosenProduct,
        createNewOrder,
        function () {
            redirectTo('choosingPayMethod')
        }
    )
)