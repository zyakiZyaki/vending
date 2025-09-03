// Функция и методы для работы с заказом
// Базой для хранения заказа выступает localStorage. Так мы не потеряет информацию при перезагрузке страницы,
// Это один из варинтов для данной задачи.

function order() {
    return {
        get: function () {
            return JSON.parse(localStorage.getItem("newOrder"))
        },
        set: function (order) {
            return localStorage.setItem("newOrder", JSON.stringify(order)), true
        }
    }
}

function orderMethods(get, set) {
    return {
        getPrice: function() {
            return +get().price
        },
        getAmount: function() {
            return +get().amount
        },
        isPaid: function() {
            return get().isPaid
        },
        getIdx: function() {
            return +get().idx
        },
        setPaidTrue: function() {
            const order = get()
            return set({
                ...order,
                isPaid: true
            })
        },
        addToAmount: function(cash) {
            const order = get()
            return set({
                ...order,
                amount: order.amount + cash
            })
        },
        completed: function() {
            return set({})
        },
        refreshAmount: function(cash) {
            if (cash !== 0) {
                this.addToAmount(cash)
            }
            return this.getAmount()
        },
        createNewOrder: function(obj) {
            return set({
                ...obj,
                amount: 0,
                id: Date.now().toString(),
                isPaid: false
            })
        }
    }
}

export default orderMethods(order().get, order().set)