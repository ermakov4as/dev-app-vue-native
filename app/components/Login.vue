<template>
    <Page class="page">
        <ActionBar :title="title" class="action-bar" />
        <ScrollView>
            <StackLayout class="home-panel">

                <!-- Отображается если не идёт загрузка -->
                <template v-if="!loading">

                    <!-- Блок сообщения об ошибке -->
                    <template v-if="reqError">
                        <label textWrap="true" text="Ошибка регистрации" class="h2 description-label error-label" />
                    </template>

                    <!-- Форма для авторизации -->
                    <TextView hint="Логин (email)" keyboardType="email" v-model="email" />
                    <TextField secure="true" hint="Пароль" v-model="password" />
                    <Button text="Login" @tap="login" class="btn-big btn-green" />

                </template>

                <!-- Индикатор загрузки -->
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
            // Сохранение данных пользователя
            save(data) {
                this.$store.dispatch("user_data", data);
            },

            // Запрос на получение данных пользователя с сервера
            get_user_data(token) {
                HTTP.get('users/user/')
                    .then((response) => {
                            this.loading = false;
                            if (token !== null) {
                                let user_data = {
                                    name: response.data.nickname,
                                    email: this.email,
                                    token
                                }
                                this.save(user_data);
                            }
                            // Переход на главную страницу приложения
                            this.$router.push('/home');
                    })
                    .catch(error => {
                            this.loading = false;
                            this.reqError = true;
                            console.dir(error);
                    });
            },

            // Авторизация
            login() {
                // Проверка, что поля логина и пароля не пустые
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
        }
    };
</script>