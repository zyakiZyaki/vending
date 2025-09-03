import data from '../managers/data.js'

//Отдельно вынес функции для рендера разметки из Data.

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
    return function(category = "coffee") {
        return renderCategories(category, data) + renderProducts(category, data)
    }
}



export default renderCategoriesAndProducts(data.getData())