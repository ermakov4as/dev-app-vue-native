import Vue from 'nativescript-vue'
import App from './components/App'
import VueDevtools from 'nativescript-vue-devtools'
import store from './store/store'
import router from './router'

if (TNS_ENV !== 'production') {
    Vue.use(VueDevtools)
}

Vue.config.silent = (TNS_ENV === 'production')

new Vue({
    store,
    router,
    render: h => h('frame', [h(App)])
}).$start()