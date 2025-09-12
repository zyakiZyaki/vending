// Функция для обработки событий (e)

function event() {
    function isChosenSelector(e, str) {
        return e.target.closest(str)
    }
    function getByDataAtr(e, sel) {
        return Object.keys(e.target.closest(sel)?.dataset)[0]
    }
    function isKeydown(e, num) {
        return e.code === num
    }
    return {
        getChosenCategory: function (e) {
            return getByDataAtr(e, ".category")
        },
        getIdxChosenProduct: function (e) {
            return getByDataAtr(e, ".product")
        },
        isChosenNewCategory: function (e) {
            return isChosenSelector(e, ".category") && !isChosenSelector(e, ".active")
        },
        isChosenProduct: function (e) {
            return isChosenSelector(e, ".product")
        },
        isChosenCashPayMethod: function (e) {
            return isChosenSelector(e, ".cash")
        },
        isChosenCardPayMethod: function (e) {
            return isChosenSelector(e, ".card")
        },
        isPressKeyA: function (e) {
            return isKeydown(e, "KeyA")
        },
        isPressKeyD: function (e) {
            return isKeydown(e, "KeyD")
        },
        isPressKeyC: function (e) {
            return isKeydown(e, "KeyC")
        },
        isPressKeyS: function (e) {
            return isKeydown(e, "KeyS")
        }
    }
}

export const {
    isChosenNewCategory,
    getChosenCategory,
    getIdxChosenProduct,
    isChosenProduct,
    isChosenCashPayMethod,
    isChosenCardPayMethod,
    isPressKeyA,
    isPressKeyD,
    isPressKeyC,
    isPressKeyS
} = event()