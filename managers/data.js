import productsData from '../data/index.js'

function data(data) {
    return {
        getData: function() {
            return data
        },
        getProduct: function(idx) {
            return Object
                .values(data)
                .flatMap(category => Object.values(category.products || {}))
                .find(product => product.idx === +idx);
        },
        getProductTitle: function(idx) {
            return this.getProduct(idx).title
        }
    }
}

export default data(productsData)