import { getData } from './data.js'

function html(data) {
    // Вспомогательные утилиты
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
    // Рендеры
    function renderCategories(choisedCategory, data) {
        return `
        <section class="categories">
            ${Object.keys(data)
                .map(function (category) {
                    return `
                        <div 
                            class="category ${category === choisedCategory ? 'active' : ''}" 
                            data-${category}
                        >
                            <img src="../../images/menu-drinks/${category}.png" alt="${data[category].title}">
                            <p>${data[category].title}</p>
                        </div>
                    `;
                })
                .join("")}
        </section>
    `;
    }

    function renderProducts(category, data) {
        return `
        <section class="products">
            <h2>${data[category].title}</h2>
            <div class="products-grid">
                ${Object.values(data[category]?.products || {})
                .map(function (product) {
                    return `
                            <div class="product" data-${product.idx}>
                                <img src="${'../' + product.img}" alt="${product.title}">
                                <p class="drink-name">${product.title}</p>
                                <p class="drink-price">от <span>${product.price}₽</span></p>
                                ${product.title.includes("2x") ? `<div class="popular-badge">2x</div>` : ''}
                            </div>
                        `;
                })
                .join("")}
            </div>
        </section>
    `;
    }

    function renderCategoriesAndProducts(data) {
        return function (category = "coffee") {
            return renderCategories(category, data) + renderProducts(category, data)
        }
    }

    // Методы
    function menuRemove() {
        ['.categories', '.products'].forEach(sel => removeBySel(sel))
    }

    function renderMenu(category) {
        return inserAfter('header', renderCategoriesAndProducts(data)(category))
    }

    function reRenderMenu(category) {
        return menuRemove(), renderMenu(category)
    }

    function reRenderAmountBlock(amount) {
        return innerTextBySel(amount, '.amountSum')
    }

    function pinpadMessage(str) {
        return refreshText(str, '.pinpad_message')
    }

    function vendingMessage(str) {
        return refreshText(str, '.vending_message')
    }

    function renderBlockWithChange(change) {
        return removeBySel('.amount'),
            inserAfter('header',
                `<div class="amount">
                <p>Ваша сдача:</p>
                <div class="amountSum">${change}</div>
            </div>`
            )
    }

    return {
        renderMenu,
        reRenderMenu,
        vendingMessage,
        reRenderAmountBlock,
        renderBlockWithChange,
        pinpadMessage
    }
}

export const {
    renderMenu,
    reRenderMenu,
    vendingMessage,
    reRenderAmountBlock,
    renderBlockWithChange,
    pinpadMessage
} = html(getData())