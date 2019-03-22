<template>
    <Page>
        <ActionBar :title="$route.path" />
        <ScrollView>

            <!-- Отображаем текущий компонент роутера -->
            <router-view />

        </ScrollView>
    </Page>
</template>

<script >
    export default {
        mounted() {
            // Инициируем переход на главную страницу
            this.$router.replace('/home');
        },

        created() {
            // При включении загружаем в хранилище данные пользователя
            this.$store.dispatch("init");
        }
    }
</script>

<style>
    ActionBar {
        background-color: #e53142;
        color: #ffffff;
    }

    .message {
        vertical-align: center;
        text-align: center;
        font-size: 20;
        color: #333333;
    }
</style>
