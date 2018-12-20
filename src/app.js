import Vue from 'vue'
import App from './App.vue'
// import router from './router'
// import store from './store'
//
// Vue.config.productionTip = false
//
// new Vue({
//     router,
//     store,
//     render: h => h(App)
// }).$mount('#app')

import { createRouter } from './router'

export function createApp () {
    const router = createRouter()

    const app = new Vue({
        router,
        render: h => h(App)
    })

    return { app, router }
}
