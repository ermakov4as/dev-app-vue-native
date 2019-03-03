import Vue from 'vue'
import Vuex from 'vuex'
import login from './modules/login'

//const Sqlite = require("nativescript-sqlite")

Vue.use(Vuex)

export default new Vuex.Store({
    state: {},
    mutations: {},
    getters: {},
    actions: {},
    modules: {
        login
    }
});