import productsData from '../data/index.js'

function data(data) {
    function getProductData(idx) {
            return Object
                .values(data)
                .flatMap(category => Object.values(category.products || {}))
                .find(product => product.idx === +idx);
        }
    return {
        getProductData,
        getData: function() {
            return data
        },
        getProductTitle: function(idx) {
            return getProductData(idx).title
        }
    }
}

export const { getProductData, getProductTitle, getData } = data(productsData)