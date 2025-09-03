// Объект для хранения информации о товарах

export default {
    coffee: {
        title: "Кофе",
        products: {
            espresso: {
                idx: 1,
                title: "Эспрессо",
                img: "../images/drinks/espresso.png",
                price: "79"
            },
            double_espresso: {
                idx: 2,
                title: "Эспрессо (2x)",
                img: "../images/drinks/espresso.png",
                price: "109"
            },
            americano: {
                idx: 3,
                title: "Американо",
                img: "../images/drinks/americano.png",
                price: "119"
            },
            latte: {
                idx: 4,
                title: "Латте",
                img: "../images/drinks/latte.png",
                price: "129"
            },
            cappuccino: {
                idx: 5,
                title: "Капучино",
                img: "../images/drinks/cappuccino.png",
                price: "129"
            },
            macchiato: {
                idx: 6,
                title: "Макиато",
                img: "../images/drinks/macchiato.png",
                price: "129"
            }
        }
    },
    tea: {
        title: "Чай",
        products: {}
    },
    milkshake: {
        title: "Молочные коктейли",
        products: {}
    },
    soda: {
        title: "Газированные напитки",
        products: {}
    }
};