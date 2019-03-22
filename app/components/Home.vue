<template>
    <Page class="page" style="background-color:azure">
        <ActionBar title="Swift English" class="action-bar" />
        <ScrollView>
            <StackLayout class="home-panel">
                <Label textWrap="true" text="Swift English App" class="h2 description-label" />
                
                <template>
                    <!-- Приветствие -->
                    <Label textWrap="true" >
                        <FormattedString>
                            <Span text="Добро пожаловать, " class="h2 description-label" />
                            <Span :text="$store.getters.name" class="h2 description-label email" />
                        </FormattedString>
                    </Label>

                    <!-- Кнопки перехода к режимам работы -->
                    <Button text="Тренажёр" @tap="$router.push('/trainer')" class="btn-big btn-violet" />
                    <Button text="Logout" @tap="logout" class="btn-big btn-orange" />

                </template>

            </StackLayout>
        </ScrollView>
    </Page>
</template>

<script>
    import { LOGIN_HTTP } from "../http-common";

    export default {
        methods: {
             // Выход из аккаунта с удалением данных пользователя
            logout() {
                LOGIN_HTTP.post('/logout/')
                    .then((response) => {
                        this.$store.dispatch('remove_user_data');
                        this.$router.push('/login');
                    })
                    .catch((error) => {
                        console.dir(error);
                    });
            }
        },

        created() {
            // Проверка авторизации при загрузке страницы
            if (this.$store.getters.token === null) {
                this.$router.push('/login');
            }
        }
    }
</script>
