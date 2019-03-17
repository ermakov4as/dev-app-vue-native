<template>
    <Page class="page" style="background-color:azure">
        <ActionBar title="Swift English" class="action-bar">
            <!--ActionItem @tap="onTapShare"
                ios.systemIcon="9" ios.position="left"
                android.systemIcon="btn_dropdown" android.position="actionBar" /-->
            <!--NavigationButton android.systemIcon="res://ic_menu" *ngIf="isAndroid()" @tap=""></NavigationButton>
            <ActionItem-- ios.systemIcon="res://ic_menu" *ngIf="isIOS()" ios.position="left" @tap=""></ActionItem-->
            <!--GridLayout-- width="100%" columns="auto, *">
                <Label text="MENU" @tap="openDrawer()" col="0"/>
                <Label class="title" text="Welcome to NativeScript-Vue!"  col="1"/>
            </GridLayout-->
        </ActionBar>
        <!--ActionBar :title="$route.path" /-->
        <ScrollView>
            <StackLayout class="home-panel">
                <Label textWrap="true" text="Swift English App" class="h2 description-label" />
                <!--Button text="To Login/Logout" @tap="$router.push('/login')" /-->
                
                <template>
                    <Label textWrap="true" >
                        <FormattedString>
                            <Span text="Добро пожаловать, " class="h2 description-label" />
                            <Span :text="$store.getters.name" class="h2 description-label email" />
                        </FormattedString>
                    </Label>
                    <Button text="Тренажёр" @tap="$router.push('/trainer')" class="btn-big btn-violet" />
                    <Button text="Logout" @tap="logout" class="btn-big btn-orange" />
                </template>

            </StackLayout>
        </ScrollView>
    </Page>
</template>

<script>
    //import sideDrawer from '../mixins/sideDrawer.js';
    import { LOGIN_HTTP } from "../http-common";
    //import { setTimeout } from 'timers';

    export default {
        data() {
            return {
                //nickname: ""
            }
        },

        methods: {
             // Выход из аккаунта
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
            if (this.$store.getters.token === null) {
                this.$router.push('/login');
            } /*else {
                setTimeout(() => {
                    this.nickname = this.$store.getters.nickname;
                }, 4)
            }*/
        }
        /*mixins: [ sideDrawer ],
        data () {
            return {
            text: 'Hello Home Page!'
            }
        }*/
    }
</script>
