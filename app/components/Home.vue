<template>
    <Page class="page" style="background-color:azure">
        <ActionBar title="Swift English" class="action-bar" />
        <!--ActionBar :title="$route.path" /-->
        <!--ScrollView-->
            <StackLayout>
                <Label textWrap="true" text="Swift English App" class="h2 description-label" />
                <Button text="To Login/Logout" @tap="$router.push('/login')" />
            </StackLayout>
        <!--/ScrollView-->
    </Page>
</template>
