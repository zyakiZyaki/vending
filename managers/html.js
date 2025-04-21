import renderCategoriesAndProducts from '../utils/dataExtractor.js'

// Функция для работы с разметкой HTML

function html() {
    function removeBySel(sel) {
        return document.querySelector(sel)?.remove()
    }
    function inserAfter(sel, data) {
        return document
            .querySelector(sel)
            .insertAdjacentHTML('afterend', data)
    }
    function innerTextBySel(str, sel) {
        return document.querySelector(sel).innerText = str
    }
    function refreshText(str, sel) {
        return innerTextBySel(str, sel)
    }
    return {
        menuRemove: function () {
            return ['.categories', '.products'].forEach(sel => removeBySel(sel))
        },
        menuRender: function (category) {
            return inserAfter('header', renderCategoriesAndProducts(category))
        },
        payButtonsRemove: function () {
            return ['.cash', '.card'].forEach(sel => removeBySel(sel))
        },
        refreshMenu: function (category) {
            return this.menuRemove(), this.menuRender(category)
        },
        reRenderAmount: function (amount) {
            return innerTextBySel(amount,'.amountSum')
        },
        pinpadMessage: function (str) {
            return refreshText(str, '.pinpad_message')
        },
        vendingMessage: function (str) {
            return refreshText(str, '.vending_message')
        },
        renderBlockWithChange: function (change) {
            return removeBySel('.amount'),
                inserAfter('header',
                    `<div class="amount">
                    <p>Ваша сдача:</p>
                    <div class="amountSum">${change}</div>
                    </div>`
            )
        }
    }
}

export default html()