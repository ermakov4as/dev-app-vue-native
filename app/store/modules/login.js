const appSettings = require("application-settings");

const state = {
    data: {
        name: null,
        email: null,
        token: null
    }
};

const getters = {
    // Возврат имени из хранилища
    name(state) {
        return state.data.name;
    },

    // Возврат email из хранилища
    email(state) {
        return state.data.email;
    },

    // Возврат токена из хранилища
    token(state) {
        return state.data.token;
    }
};

const mutations = {
    // Загрузка данных в хранилище
    load(state, data) {
        state.data = data;
    },

    // Сохранение данных в хранилище
    save(state, data) {
        state.data = {
            name: data.name,
            email: data.email,
            token: data.token
        };
    },

    // Удаление данных из хранилища
    remove(state) {
        state.data.name = null;
        state.data.email = null;
        state.data.token = null;
    },
};

const actions = {
    // Загрузка данных пользователя (если они есть) из application-settings в хранилище
    init(context) {
        let _name = appSettings.getString("user_name", null);
        let _email = appSettings.getString("user_email", null);
        let _token = appSettings.getString("user_token", null);
        let user_settings = {
            name: _name,
            email: _email,
            token: _token
        };
        context.commit("load", user_settings);
    },

    // Загрузка данных пользователя в application-settings
    user_data(context, data) {
        appSettings.setString("user_name", data.name);
        appSettings.setString("user_email", data.email);
        appSettings.setString("user_token", data.token);
        context.commit("save", data);
    },

    // Удаление данных пользователя из application-settings
    remove_user_data(context) {
        appSettings.remove("user_name");
        appSettings.remove("user_email");
        appSettings.remove("user_token");
        context.commit("remove");
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};