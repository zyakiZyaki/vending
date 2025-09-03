import listener from "../../managers/listener.js";
import event from '../../managers/event.js'
import html from '../../managers/html.js'
import router from '../../managers/router.js'
import data from '../../managers/data.js'
import order from '../../managers/order.js'

//Рендерим категории товаров

html.menuRender(),

//Устанавливаем лисенер

listener("click").set(logicPage)

// Если выбирают новую категорию, получаем ее по клику и перерендерим с учетом этого
function logicPage(e) {
    if (event.isChosenNewCategory(e)) {
        return html.refreshMenu(
            event.getCategory(e) 
        )
    }
    // Если выбирают напиток - создаем новый заказ.
    // По клику получаем напиток,
    // по нему из "базы" получаем объект с данными, который передаем в заказ.
    if (event.isChosenProduct(e)) { 
        return order.createNewOrder(
            data.getProduct(
                event.getProduct(e)
            )
        ) && router.redirectTo('choosingPayMethod');
    }
}