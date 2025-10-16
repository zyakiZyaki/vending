import { isChosenCashPayMethod, isChosenCardPayMethod } from '../../managers/event.js'
import { redirectTo } from '../../managers/router.js'
import { listen } from '../handlers.js'
import { choosePayEventInterpretator, choosePayHandler } from './utils.js'

const variants =
    (isCash, isCard) =>
        ({
            'cashing': isCash,
            'banking': isCard
        })

listen(
    "click",
    choosePayHandler(
        choosePayEventInterpretator(
            variants(
                isChosenCashPayMethod,
                isChosenCardPayMethod
            ),
            redirectTo
        )
    )
)