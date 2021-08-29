import * as $ from 'jquery'
function createAnalytics() {
    let counter = 0
    let Destroyed = false

    console.log("test")

    const listener = () => counter++

    $(document).on('click', listener)
    return {
        destroy() {
            $(document).off('click', listener)
            Destroyed = true
        },

        getClicks() {
            if (Destroyed) {
                return `Analytics is destroyed. Total clicks = ${counter}`
            }
            return counter
        }
    }
}
window.analytics = createAnalytics()