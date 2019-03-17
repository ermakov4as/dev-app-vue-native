<template>
    <Page class="page">
        <ActionBar :title="title" class="action-bar" />
        <ScrollView>
            <StackLayout class="home-panel">

                <template v-if="!loading">
                    <template v-if="reqError">
                        <label textWrap="true" text="Ошибка регистрации" class="h2 description-label error-label" />
                    </template>
                    <TextView hint="Логин (email)" keyboardType="email" v-model="email" />
                    <TextField secure="true" hint="Пароль" v-model="password" />
                    <Button text="Login" @tap="login" class="btn-big btn-green" />
                </template>

                <ActivityIndicator v-else busy="true" />

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
                email: null,
                password: null
            };
        },
        
        methods: {
            save(data) {
                this.$store.dispatch("user_data", data);
            },

            get_user_data(token) {
                HTTP.get('users/user/')
                    .then((response) => {
                            this.loading = false;
                            //this.$router.push('/sciences/'); // TODO:
                            if (token !== null) {
                                let user_data = {
                                    name: response.data.nickname,
                                    email: this.email,
                                    token
                                }
                                this.save(user_data);
                            }
                            this.$router.push('/home');
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
                            if (this.reqError) this.reqError = false;
                            this.get_user_data(response.data['key']);
                        })
                        .catch(error => {
                            this.loading = false;
                            this.reqError = true;
                            console.dir(error);
                            this.password = null;
                        });
                }
            }
        },

        mounted() {
            let tmp_token = this.$store.getters.token;
            if (tmp_token !== null & tmp_token !== "") { // TODO: в перспективе не будет нужно
                this.loading = true;
                this.get_user_data(null);
            }
        }
    };
</script>