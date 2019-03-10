import Home from './components/Home.vue';
import Login from './components/HelloWorld.vue';
//const Vue = require('nativescript-vue');
//const VueRouter = require('vue-router');
import Vue from 'vue';
import Router from 'vue-router';

//Vue.use(VueRouter);
Vue.use(Router);

export default new Router({
    //const router = new VueRouter({
    //mode: history,
    pageRouting: true,
    routes: [{
            path: '/home',
            name: 'home',
            component: Home
        },
        {
            path: '/login',
            name: login,
            component: Login
                /*component: () =>
                    import ('./components/HelloWorld.vue')*/ // Isn't availible
        },
        {
            path: '*',
            redirect: '/home'
        }
    ]
});

//export default router;