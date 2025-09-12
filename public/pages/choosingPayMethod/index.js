import { isChosenCashPayMethod, isChosenCardPayMethod } from '../../managers/event.js'
import listener from '../../managers/listener.js'
import { redirectTo } from '../../managers/router.js'

//Ставим слушателя на кнопки, переходим на соответствующую страницу при клике

const { setListener, removeListener } =
    listener('click', function (e) {
        if (isChosenCashPayMethod(e) || isChosenCardPayMethod(e)) {
            return removeListener(),
                redirectTo(
                    isChosenCashPayMethod(e)
                        ?
                        'cashing'
                        :
                        'banking'
                )
        }
    })

setListener()