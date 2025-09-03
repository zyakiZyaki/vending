// Функция для Лисенера

export default function listener(event) {
    return {
        set: function(fn) {
            return document.addEventListener(event, fn)
        },
        remove: function(fn) {
            return document.removeEventListener(event, fn)
        }
    }
}