import axios from 'axios'
import store from './store/store'
//import router from './router'

const API_URL = 'https://backend.swift-english.com/api/v1/';

// Стандартный HTTP запрос
export const HTTP = axios.create({
    baseURL: API_URL,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${store.getters.token}`
    }
});

/*// Стандартный HTTP запрос для загрузки
export const HTTP_UPLOAD = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${store.getters.token}`
    }
});*/

// HTTP запрос для авторизации
export const LOGIN_HTTP = axios.create({
    baseURL: API_URL + 'users/',
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
});

// Проверка авторизации при HTTP запросе
HTTP.interceptors.request.use(
    function(config) {
        const token = store.getters.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        };
        return config;
    },
    function(error) {
        return Promise.reject(error);
    }
);

// Действия при ошибки авторизации
HTTP.interceptors.response.use(null, function(error) {
    if (error.response.status === 401 || error.response.status === 403) {
        console.dir(`Failed to login (error: ${error.response.status})`);
        //router.push('/login'); // TODO
    };
    return Promise.reject(error)
});