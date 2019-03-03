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
                    </template>
                    <template v-else>
                        <Label textWrap="true" >
                            <FormattedString>
                                <Span text="Добро пожаловать, " class="h2 description-label" />
                                <Span :text="nickname" class="h2 description-label email" />
                            </FormattedString>
                        </Label>
                        <Button text="Logout" @tap="logout" class="btn-big btn-orange" />
                    </template>
                </template>
                <ActivityIndicator v-else busy="true" />
                <!--Label textWrap="true" :text="testInfo" class="h2 description-label error-label" /-->
                <TextView hint="Test Name" v-model="testName" />
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
                testName: ''/*,
                testInfo: "Test Info"*/
            };
        },
        
        methods: {
            // Вход в аккаунт
            login() {
                //console.log("Button was pressed");
                if (this.email !== "" && this.password !== "") {
                    this.loading = true;
                    this.testInfo = "Предзапрос"
                    // Запрос на авторизацию
                    LOGIN_HTTP.post("login/", {
                            email: this.email,
                            password: this.password
                        })
                        .then(response => {
                            this.testInfo = "OK"
                            this.$store.commit('token', response.data['key']);
                            if (this.reqError) this.reqError = false;
                            HTTP.get('users/user/')
                                    .then((response) => {
                                        this.nickname = response.data.nickname;
                                        this.authorized = true;
                                        this.loading = false;
                                        this.$store.commit('user', response.data);
                                        //this.$router.push('/sciences/'); //TODO
                                    })
                                    .catch(error => {
                                        this.loading = false;
                                        this.reqError = true;
                                        console.dir(error);
                                    });
                        })
                        .catch(error => {
                            this.loading = false;
                            this.reqError = true;
                            console.dir(error);
                            //this.set_errors(error.response.data);
                            this.password = null;
                            //this.state = "default";
                        });
                }
            },

            // Выход из аккаунта
            logout() {
                LOGIN_HTTP.post('/logout/')
                    .then((response) => {
                        this.$store.dispatch('logout');
                        //this.$router.push('/login');
                        this.authorized = false;
                    })
                    .catch((error) => {
                        console.dir(error);
                    });
            }
        },

        computed: {
            connected_to_server() {
                return this.$store.getters.connected_to_server;
            }
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