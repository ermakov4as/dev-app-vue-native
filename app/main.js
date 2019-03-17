import Vue from 'nativescript-vue'
import App from './components/App'
//import App from './components/HelloWorld.vue'
//import App from './components/Home.vue'
import VueDevtools from 'nativescript-vue-devtools'
import store from './store/store'
import router from './router'
//import routes from './router'
//import sideDrawer from './components/sideDrawer'
//import drawerContent from './components/drawerContent'

if (TNS_ENV !== 'production') {
    Vue.use(VueDevtools)
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

//Vue.registerElement('RadSideDrawer', () => require('nativescript-ui-sidedrawer').RadSideDrawer)

//Vue.prototype.$routes = routes

//Vue.use(RadSideDrawer)

//router.replace('/home');

new Vue({
    store,
    router,
    render: h => h('frame', [h(App)])
        /*render(h) {
            return h(
                sideDrawer, [
                    h(drawerContent, { slot: 'drawerContent' }),
                    h(routes.Home, { slot: 'mainContent' })
                ]
            )
        }*/
}).$start()