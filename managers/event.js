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
        getCategory: function(e) {
            return getByDataAtr(e,".category")
        },
        getProduct: function(e) {
            return getByDataAtr(e,".product")
        },
        isChosenNewCategory: function(e) {
            return isChosenSelector(e, ".category") && !isChosenSelector(e, ".active")
        },
        isChosenProduct: function(e) {
            return isChosenSelector(e, ".product")
        },
        isChosenCash: function(e) {
            return isChosenSelector(e, ".cash")
        },
        isChosenCard: function(e) {
            return isChosenSelector(e, ".card")
        },
        isChosen0: function(e) {
            return isKeydown(e, "Digit0")
        },
        isChosen1: function(e) {
            return isKeydown(e, "Digit1")
        },
        isChosen2: function(e) {
            return isKeydown(e, "Digit2")
        },
        isChosen5: function(e) {
            return isKeydown(e, "Digit5")
        },
        isSuccesCard: function(e) {
            return isKeydown(e, "KeyA")
        },
        isFailCard: function(e) {
            return isKeydown(e, "KeyD")
        },
        isCancelCard: function (e) {
            return isKeydown(e, "KeyC")
        }
    }
}

export default event()