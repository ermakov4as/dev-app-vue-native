const Sqlite = require("nativescript-sqlite")

const state = {
    database: null,
    data: [{
        name: "",
        email: "",
        token: ""
    }]
};

const getters = {
    name(state) {
        return state.data[0].name;
    },

    email(state) {
        return state.data[0].email;
    },

    token(state) {
        return state.data[0].token;
    }
};

const mutations = {
    init(state, data) {
        state.database = data.database;
    },

    load(state, data) {
        state.data = [];
        for (var i = 0; i < data.data.length; i++) {
            state.data.push({
                name: data.data[i][0],
                email: data.data[i][1],
                token: data.data[i][2],
            });
        }
    },

    save(state, data) {
        state.data.push({
            name: data.data.name,
            email: data.data.email,
            token: data.data.token
        });
    },

    remove(state) {
        state.data[0].name = "";
        state.data[0].email = "";
        state.data[0].token = "";
    },
};

const actions = {
    init(context) {
        (new Sqlite("app.db")).then(db => {
            db.execSQL("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, token TEXT)")
                .then(id => {
                    context.commit("init", { database: db });
                }, error => {
                    console.dir("CREATE TABLE ERROR", error);
                });
        }, error => {
            console.dir("OPEN DB ERROR", error);
        });
    },

    user_data(context, data) {
        context.state.database.execSQL("INSERT INTO users (name, email, token) VALUES (?, ?, ?)", [data.name, data.email, data.token])
            .then(id => {
                context.commit("save", { data: data });
            }, error => {
                console.dir("INSERT ERROR", error);
            });
    },

    remove_user_data(context) {
        context.state.database.run("DELETE FROM users")
            .then(id => {
                context.commit("remove");
            }, error => {
                console.dir("DELETE ERROR", error);
            });
    },

    query(context) {
        setTimeout(() => {
            context.state.database.all("SELECT IF EXISTS name, email, token FROM users", [])
                .then(result => {
                    context.commit("load", { data: result });
                }, error => {
                    console.dir("SELECT ERROR", error);
                });
        }, 4)
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};