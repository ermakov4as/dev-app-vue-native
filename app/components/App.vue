<template>
    <Page>
        <!--ActionBar title="Welcome to NativeScript-Vue!"/-->
        <ActionBar :title="$route.path" />
        <ScrollView>
            <router-view />
        </ScrollView>
        <!--router-viev></router-viev-->
        <!--GridLayout columns="*" rows="*">
            <Label class="message" :text="msg" col="0" row="0"/>
        </GridLayout-->
    </Page>
</template>

<script >
    //import Home from './Home.vue'

    export default {
        data() {
            return {
                //msg: 'Hello World!'
            }
        },

        /*components: {
            Home
        },*/

        mounted() {
            this.$router.replace('/home');
        },

        created() {
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
