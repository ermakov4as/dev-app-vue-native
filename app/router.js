import Home from './components/Home.vue';
import Login from './components/Login.vue';
import Player from './components/Player.vue';
import Trainer from './components/Trainer.vue';
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({ // TODO: Не сработала динамическая подгрузка компонентов
    //mode: history,
    pageRouting: true,
    routes: [{
            path: '/home',
            name: 'home',
            component: Home
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/player',
            name: 'player',
            component: Player
        },
        {
            path: '/trainer',
            name: 'trainer',
            component: Trainer
        },
        {
            path: '*',
            redirect: '/home'
        }
    ]
});