import Vue from 'nativescript-vue'
import App from './components/App'
//import App from './components/HelloWorld.vue'
//import App from './components/Home.vue'
import VueDevtools from 'nativescript-vue-devtools'
import store from './store/store'
import router from './router'

if (TNS_ENV !== 'production') {
    Vue.use(VueDevtools)
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

//router.replace('/home');

new Vue({
    store,
    router,
    render: h => h('frame', [h(App)])
}).$start()