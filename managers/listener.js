// Функция для Лисенера

export default function listener(event) {
    return {
        set: function(fn) {
            return document.addEventListener(event, fn)
        },
        remove: function(fn) {
            console.log('Removing event listener for:', event, 'with handler:', fn);
            return document.removeEventListener(event, fn)
        }
    }
}