<template>
    <Page class="page">
        <ActionBar :title="title" class="action-bar" />
        <ScrollView>
            <StackLayout class="home-panel">

                <!--Add your page content here-->
                <template v-if="!loading">
                    <template v-if="!authorized">
                        <template v-if="reqError">
                            <label textWrap="true" text="Ошибка регистрации" class="h2 description-label error-label" />
                        </template>
                        <TextView hint="Логин (email)" keyboardType="email" v-model="email" />
                        <TextField secure="true" hint="Пароль" v-model="password" />
                        <Button text="Login" @tap="login" class="btn-big btn-green" />
                        <Button text="Я уже зареган" @tap="sign_in" class="btn-big btn-green" />
                    </template>

                    <template v-else>
                        <Label textWrap="true" >
                            <FormattedString>
                                <Span text="Добро пожаловать, " class="h2 description-label" />
                                <Span :text="nickname" class="h2 description-label email" />
                            </FormattedString>
                        </Label>
                        <Button text="Logout" @tap="logout" class="btn-big btn-orange" />
                        <Button text="Фэйк логаут" @tap="logout_nf" class="btn-big btn-orange" />
                        <Button text="Отойти" @tap="test_sign_out" class="btn-big btn-orange" />
                    </template>

                </template>
                <ActivityIndicator v-else busy="true" />
                <Button text="Тест!" @tap="test_store" class="btn-common btn-blue" />
                <Label textWrap="true" :text="test" class="h2 description-label error-label" />

            </StackLayout>
        </ScrollView>
    </Page>
</template>

<script>
    import { HTTP, LOGIN_HTTP } from "../http-common";

    export default {
        data() {
            return {
                reqError: false,
                loading: false,
                title: "Авторизация",
                email: null,//"ermakov4as@gmail.com",
                password: null,//"H898E3us",
                authorized: false,
                nickname: null,
                test: "---"
            };
        },
        
        methods: {
            test_store() {
                this.test = this.$store.getters.name + ': ' + this.$store.getters.email;
            },

            logout_nf() {
                LOGIN_HTTP.post('/logout/')
                    .then((response) => {
                        //this.$store.dispatch('remove_user_data');
                        //this.$router.push('/login');
                        //this.test_email = this.$store.getters.email;
                        this.authorized = false;
                    })
                    .catch((error) => {
                        console.dir(error);
                    });
            },

            test_sign_out() {
                this.authorized = false;
            },

            sign_in() {
                HTTP.get('users/user/')
                    .then((response) => {
                            this.nickname = response.data.nickname;
                            this.authorized = true;
                            //this.loading = false;
                            //this.$store.commit('user', response.data);
                            //this.$router.push('/sciences/'); // TODO
                    })
                    .catch(error => {
                            this.loading = false;
                            this.reqError = true;
                            console.dir(error);
                    });
            },

            save(data) {
                this.$store.dispatch("user_data", data);
            },

            load() {
                this.$store.dispatch("query");
            },

            get_user_data() {
                HTTP.get('users/user/')
                    .then((response) => {
                            this.nickname = response.data.nickname;
                            this.authorized = true;
                            this.loading = false;
                            this.$store.commit('user', response.data);
                            //this.$router.push('/sciences/'); // TODO
                    })
                    .catch(error => {
                            this.loading = false;
                            this.reqError = true;
                            console.dir(error);
                    });
            },

            // Вход в аккаунт
            login() {
                if (this.email !== "" && this.password !== "") {
                    this.loading = true;
                    // Запрос на авторизацию
                    LOGIN_HTTP.post("login/", {
                            email: this.email,
                            password: this.password
                        })
                        .then(response => {
                            this.$store.commit('token', response.data['key']);
                            if (this.reqError) this.reqError = false;
                            this.get_user_data();
                            if (this.authorized) {
                                let user_data = {
                                    name: this.nickname,
                                    email: this.email,
                                    token: response.data['key']
                                }
                                this.save(user_data);
                            }
                        })
                        .catch(error => {
                            this.loading = false;
                            this.reqError = true;
                            console.dir(error);
                            this.password = null;
                        });
                }
            },

            // Выход из аккаунта
            logout() {
                LOGIN_HTTP.post('/logout/')
                    .then((response) => {
                        this.$store.dispatch('remove_user_data');
                        //this.$router.push('/login');
                        this.authorized = false;
                    })
                    .catch((error) => {
                        console.dir(error);
                    });
            }
        },

        mounted() {
            this.load();
            let tmp_token = this.$store.getters.token;
            if (tmp_token !== null & tmp_token !== "") {
                this.loading = true;
                this.get_user_data();
            }
        },

        created() {
            this.$store.dispatch("init");
        }
    };
</script>

<style scoped>
    .error-label {
        color: darkred;
        font-style: italic;
    }

    .email {
        text-decoration: underline;
        color: blue;
    }

    .animated-view-style{
        height: 50;
        width: 50;
        border-radius:50;
    }

    .home-panel {
        vertical-align: center;
        font-size: 20;
        margin: 15;
    }

    .description-label {
        margin-bottom: 15;
    }

    .btn-common, .btn-big {
        border-radius: 3px;
        font-weight: 500;
        color: white;
        margin: 3px;
    }

    .btn-common {
        font-size: 14px;
    }

    .btn-big {
        font-size: 20px;
    }

    .btn-green {
        background-color: #4ca64c;
    }

    .btn-orange {
        background-color: #ffb70f;
    }

    .btn-red {
        background-color: #e53142;
    }

    .btn-blue {
        background-color: lightblue;
    }
</style>