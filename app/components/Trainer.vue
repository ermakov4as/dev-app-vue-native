<template>
    <Page class="page">
        <ActionBar :title="title" class="action-bar" />
        <ScrollView>
            <StackLayout class="home-panel">

                <template v-if="!loading">
                    <template v-if="loadError">
                        <label textWrap="true" text="Ошибка при загрузке" class="h2 description-label error-label" />
                    </template>

                    <template v-else>

                        <template v-if="showLessons">
                            <label textWrap="true" text="Выберите урок:" class="h2 description-label" />
                            <ListView for="lesson in lessons" class="list-group">
                                <v-template>
                                    <!--Label :text="lesson.name" class="btn-list btn-grey" @tap="lessonChecked(lesson.id)" /-->
                                    <StackLayout class="list-group-item" v-if="lesson">
                                        <Button v-if="lesson.new" :text="lesson.name" 
                                                @tap="lessonChecked(lesson.id)" class="btn-list-red btn-grey" />
                                        <Button v-else :text="lesson.name" 
                                                @tap="lessonChecked(lesson.id)" class="btn-list btn-grey" />
                                    </StackLayout>
                                </v-template>
                            </ListView>
                        </template>

                        <StackLayout v-else-if="showCards">
                            <label textWrap="true" text="Выберите карточку:" class="h2 description-label" />
                            <ListView for="card in cards" class="list-group" row="1" col="0">
                                <v-template>
                                    <StackLayout class="list-group-item">
                                        <Button :text="card.name" @tap="cardChecked(card.id)" class="btn-list btn-grey" />
                                    </StackLayout>
                                </v-template>
                            </ListView>
                            <Button text="К выбору урока" @tap="reward('cards-lessons')" class="btn-common btn-violet" />
                        </StackLayout>

                        <StackLayout v-else-if="showPlayer">
                            <StackLayout class="border-red">
                                <StackLayout class="border-imitate">
                                    <label textWrap="true" :text="cardName + ` (${currentNum}/${maxNum})`" 
                                            class="h2 description-label no-bottom-mr" />
                                    <FlexboxLayout  class="switch-line" flexDirection="row-reverse">
                                        <Label text="EN-RU" />
                                        <Switch v-model="enRu" />
                                        <Label text="RU-EN" />
                                    </FlexboxLayout>

                                    <template v-if="enRu">
                                        <FlexboxLayout  class="label-margin">
                                            <Image src="~/assets/images/audio-volume.png" stretch="aspectFit" class="icon" width="50" 
                                                    @tap="playAudio(sentence.question_audio)" v-if="sentence.question_audio != null" />
                                            <Label :text="sentence.question" />
                                        </FlexboxLayout>
                                        <FlexboxLayout class="label-margin">
                                            <Image src="~/assets/images/audio-volume.png" stretch="aspectFit" class="icon" width="50" 
                                                    @tap="playAudio(sentence.answer_audio)" v-if="sentence.answer_audio != null" />
                                            <Label :text="sentence.answer" />
                                        </FlexboxLayout>
                                    </template>

                                    <template v-else>
                                        <FlexboxLayout class="label-margin">
                                            <Image src="~/assets/images/audio-volume.png" stretch="aspectFit" class="icon" width="50" 
                                                    @tap="playAudio(sentence.answer_audio)" v-if="sentence.answer_audio != null" />
                                            <Label :text="sentence.answer" />
                                        </FlexboxLayout>
                                        <FlexboxLayout  class="label-margin">
                                            <Image src="~/assets/images/audio-volume.png" stretch="aspectFit" class="icon" width="50" 
                                                    @tap="playAudio(sentence.question_audio)" v-if="sentence.question_audio != null" />
                                            <Label :text="sentence.question" />
                                        </FlexboxLayout>
                                    </template>

                                    <GridLayout rows="auto" columns="*, *, *">
                                        <Button text="<-" @tap="prevSentence" class="btn-common btn-white" row="0" col="0" />
                                        <Button text="Далее" @tap="further" class="btn-common btn-green" row="0" col="1" />
                                        <Button text="->" @tap="nextSentence" class="btn-common btn-white" row="0" col="2" />
                                    </GridLayout>

                                </StackLayout>
                            </StackLayout>
                            <!--Image src="~/assets/images/Swift English.png" stretch="aspectFill" /-->
                            <GridLayout rows="auto" columns="*, *">
                                <Button text="Карточки" @tap="reward('player-cards')" class="btn-common btn-violet" row="0" col="0" />
                                <Button text="Уроки" @tap="reward('player-lessons')" class="btn-common btn-violet" row="0" col="1" />
                            </GridLayout>
                        </StackLayout>

                    </template>

                </template>

                <ActivityIndicator v-else busy="true" />

                <Button text="На Главную" @tap="$router.push('/home')" class="btn-big btn-orange" />

            </StackLayout>
        </ScrollView>
    </Page>
</template>

<script>
    import { HTTP } from "../http-common";
    const audio = require('nativescript-audio');

    export default {
        data() {
            return {
                title: "Тренажёр",
                loading: true,
                loadError: false,
                cardTitle: "",
                lessons: [],
                cards: [],
                currentNum: 0,
                maxNum: 0,
                cardName: "",
                showLessons: false,
                showCards: false,
                showPlayer: false,
                sentences: [],
                sentence: {},
                enRu: true
            };
        },
        
        methods: {
            further() {

            },

            prevSentence() {
                if (this.currentNum > 1) {
                    this.loading = true;
                    this.sentence = this.sentences[this.currentNum - 2];
                    this.currentNum -= 1;
                    this.loading = false;
                }
            },

            nextSentence() {
                if (this.currentNum < this.maxNum) {
                    this.loading = true;
                    this.sentence = this.sentences[this.currentNum];
                    this.currentNum += 1;
                    if (this.currentNum === this.maxNum) {
                        // TODO: /player/card/{id}/success/ (POST)
                    }
                    this.loading = false;
                }
            },

            playAudio(source) {
                const player = new audio.TNSPlayer();
                const playerOptions = {
                    audioFile: source,
                    loop: false,
                    completeCallback: function() {
                        console.dir('finished playing');
                    },
                    errorCallback: function(errorObject) {
                        console.dir(JSON.stringify(errorObject));
                    },
                    infoCallback: function(args) {
                        console.dir(JSON.stringify(args));
                    }
                };
                
                player
                    .playFromUrl(playerOptions)
                    .then(function(res) {
                        console.dir(res);
                    })
                    .catch(function(err) {
                        console.dir('something went wrong...', err);
                    });
            },

            reward(mode) {
                this.loading = true;
                if (mode === 'cards-lessons') {
                    this.showLessons = true;
                    this.showCards = false;
                } else if (mode === 'player-cards') {
                    this.showCards = true;
                    this.showPlayer = false;
                } else if (mode === 'player-lessons') {
                    this.showLessons = true;
                    this.showPlayer = false;
                }
                this.loading = false;
            },

            cardChecked(id) {
                this.cards.forEach((card, i, cards) => {
                    if (card.id === id) {
                        //console.dir(card);
                        this.maxNum = Number.parseInt(card.sentence_count);
                        this.cardName = card.name;
                        this.loading = true;
                        this.showCards = false;
                        this.getPlayerCard(id);
                    }
                });
            },
            
            lessonChecked(id) {
                this.lessons.forEach((lesson, i, lessons) => {
                    if (lesson.id === id) {
                        //console.dir(lesson);
                        this.cards = lesson.cards;
                        //this.mode = 'cards'
                        this.loading = true;
                        this.showLessons = false;
                        this.showCards = true;
                        this.loading = false;
                        console.dir(this.cards);
                    }
                });
            },

            getPlayerCard(id) {
                HTTP.get(`player/card/${id}/`)
                    .then((response) => {
                        this.showPlayer = true; // TODO: /player/settings/
                        this.loading = false;
                        this.sentences = response.data.sentences;
                        this.sentence = response.data.sentences[0];
                        this.currentNum = 1;
                        /*console.dir('SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS');
                        console.dir(response.data);
                        console.dir('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');*/
                    })
                    .catch(error => {
                        this.loading = false;
                        this.loadError = true;
                        console.dir(error);
                    });
            },

            getPlaylist() {
                HTTP.get('player/playlist/')
                    .then((response) => {
                        this.lessons = response.data.lessons;
                        //this.mode = 'lessons';
                        this.showLessons = true;
                        this.loading = false;
                        /*console.dir('SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS');
                        console.dir(response.data);
                        console.dir('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');*/
                    })
                    .catch(error => {
                        this.loading = false;
                        this.loadError = true;
                        console.dir(error);
                    });
            }
        },

        created() {
            this.getPlaylist();
        }
    };
</script>