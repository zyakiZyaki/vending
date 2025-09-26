// Функция и методы для работы с заказом
// Базой для хранения заказа выступает localStorage. Так мы не потеряет информацию при перезагрузке страницы,
// Это один из варинтов для данной задачи.

function createOrderStorage(read, write) {
    return {
        get: function () {
            return JSON.parse(
                read()
            )
        },
        set: function (order) {
            return write(
                JSON.stringify(order)
            )
        }
    }
}

function orderMethods({ get, set }) {

    return {
        getProductPrice: function () {
            return Number(
                get().price
            )
        },
        getProductIdx: function () {
            return Number(
                get().idx
            )
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
            return (
                function (order) {
                    return (
                        function (amount) {
                            set({
                                ...order,
                                amount
                            })
                            return amount
                        }
                    )(order.amount + cash)
                }
            )(get())
        },
        createNewOrder: function (obj) {
            return set({
                ...obj,
                amount: 0,
                id: Date
                    .now()
                    .toString(),
                isPaid: false
            })
        },
        orderCompleted: function () {
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
} = orderMethods(
    createOrderStorage(
        () => localStorage.getItem("newOrder"),
        (order) => localStorage.setItem("newOrder", order)
    )
)