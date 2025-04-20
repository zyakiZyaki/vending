import event from '../../managers/event.js'
import listener from '../../managers/listener.js'
import router from '../../managers/router.js'

//Ставим слушателя на кнопки, переходим на соответствующую страницу при клике

listener('click')
    .set(function (e) {
        if (event.isChosenCash(e)) {
            return router.redirectTo('cashing')
        }
        if (event.isChosenCard(e)) {
            return router.redirectTo('banking')
        }
    })