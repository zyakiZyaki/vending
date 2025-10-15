import listener from "../../managers/listener.js";
import { getIdxChosenProduct, getChosenCategory, isChosenNewCategory, isChosenProduct } from '../../managers/event.js'
import { reRenderMenu } from '../../managers/html.js'
import { redirectTo } from '../../managers/router.js'
import { getProductData } from '../../managers/data.js'
import { createNewOrder } from '../../managers/order.js'

const { setListener, removeListener } =
    listener("click")
        (
            handler(
            () => removeListener(), // Колбэк для удаления слушателя
            isChosenNewCategory,
            reRenderMenu,
            getChosenCategory,
            isChosenProduct,
            getProductData,
            getIdxChosenProduct,
            () => redirectTo('choosingPayMethod')
        )
    )


// Если выбирают новую категорию, получаем ее по клику и перерендерим с учетом этого
function handler(removeListener, isChosenNewCategory, reRenderMenu, getChosenCategory, isChosenProduct, getProductData, getChosenProduct, redirect) {
    return function (e) {
        if (isChosenNewCategory(e)) {
            return reRenderMenu(
                getChosenCategory(e)
            )
        }
        // Если выбирают напиток - создаем новый заказ.
        if (isChosenProduct(e)) {
            return createNewOrder(
                getProductData(
                    getChosenProduct(e) // По клику получаем выбранный напиток
                )
            ),
                removeListener(),
                redirect();

        }
    }
}

//Устанавливаем лисенер

setListener()