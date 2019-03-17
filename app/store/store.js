import Vue from 'vue'
import Vuex from 'vuex'
import login from './modules/login'
//import sideDrawer from './modules/sideDrawer'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {},
    mutations: {},
    getters: {},
    actions: {},
    modules: {
        login
        /*,
                sideDrawer*/
    }
});