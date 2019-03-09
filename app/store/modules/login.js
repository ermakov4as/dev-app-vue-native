const appSettings = require("application-settings");

const state = {
    data: {
        name: null,
        email: null,
        token: null
    }
};

const getters = {
    name(state) {
        return state.data.name;
    },

    email(state) {
        return state.data.email;
    },

    token(state) {
        return state.data.token;
    }
};

const mutations = {
    load(state, data) {
        state.data = data;
    },

    save(state, data) {
        state.data = {
            name: data.name,
            email: data.email,
            token: data.token
        };
    },

    remove(state) {
        state.data.name = null;
        state.data.email = null;
        state.data.token = null;
    },
};

const actions = {
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

    user_data(context, data) {
        appSettings.setString("user_name", data.name);
        appSettings.setString("user_email", data.email);
        appSettings.setString("user_token", data.token);
        context.commit("save", data);
    },

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