// Функция и методы для работы с заказом
// Базой для хранения заказа выступает localStorage. Так мы не потеряет информацию при перезагрузке страницы,
// Это один из варинтов для данной задачи.

function createOrderStorage() {
    return {
        get: function () {
            return JSON.parse(localStorage.getItem("newOrder"))
        },
        set: function (order) {
            return localStorage.setItem("newOrder", JSON.stringify(order)), true
        }
    }
}

function orderMethods({ get, set }) {

    return {
        getProductPrice: function () {
            return +get().price
        },
        getProductIdx: function () {
            return +get().idx
        },
        isPaidStatusTrue: function () {
            return get().isPaid
        },
        setPaidStatusTrue: function () {
            return set({
                ...get(),
                isPaid: true
            })
        },
        getNewAmount: function (cash) {
            return cash
                && (
                    set({
                        ...get(),
                        amount: get().amount + cash
                    }),
                    +get().amount
                )
        },
        createNewOrder: function (obj) {
            return set({
                ...obj,
                amount: 0,
                id: Date.now().toString(),
                isPaid: false
            })
        },
        orderCompleted: function() {
            return set({})
        }
    }
}

export const {
    createNewOrder,
    getNewAmount,
    setPaidStatusTrue,
    getProductPrice,
    isPaidStatusTrue,
    getProductIdx,
    orderCompleted
} = orderMethods(createOrderStorage())