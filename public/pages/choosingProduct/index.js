import listener from "../../managers/listener.js";
import { getIdxChosenProduct, getChosenCategory, isChosenNewCategory, isChosenProduct } from '../../managers/event.js'
import { renderMenu, reRenderMenu } from '../../managers/html.js'
import { redirectTo } from '../../managers/router.js'
import { getProductData } from '../../managers/data.js'
import { createNewOrder } from '../../managers/order.js'

const { setListener, removeListener } =
    listener("click",
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
function handler(cb, isChosenNewCategory, reRenderMenu, getChosenCategory, isChosenProduct, getProductData, getIdxChosenProduct, redirect) {
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
                    getIdxChosenProduct(e) // По клику получаем выбранный напиток
                )
            ),
                cb(),
                redirect();

        }
    }
}

//Рендерим категории и устанавливаем лисенер

renderMenu(), setListener()