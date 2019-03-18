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

                                    <template v-if="!cardSuccessMode">
                                        <label textWrap="true" :text="cardName + ` (${currentNum}/${maxNum})`" 
                                                class="h2 description-label no-bottom-mr" />
                                        <label v-if="cardSaved" textWrap="true" text="Карточка успешно сохранена!" 
                                                class="h2 description-label no-bottom-mr success-label" />
                                        <FlexboxLayout  class="switch-line" flexDirection="row-reverse">
                                            <Label text="EN-RU" />
                                            <Switch v-model="enRu" />
                                            <Label text="RU-EN" />
                                        </FlexboxLayout>

                                        <template v-if="enRu">
                                            <FlexboxLayout  class="label-margin">
                                                <Image src="~/assets/images/audio-volume.png" stretch="aspectFit" class="icon" width="50" 
                                                        v-show="showA" v-if="sentence.question_audio != null"
                                                        @tap="playAudio(sentence.question_audio)" />
                                                <Label v-if="sentence.question != null" :text="sentence.question" v-show="showA" />
                                                <Label text="" />
                                            </FlexboxLayout>
                                            <FlexboxLayout class="label-margin">
                                                <Image src="~/assets/images/audio-volume.png" stretch="aspectFit" class="icon" width="50" 
                                                        v-show="showB" v-if="sentence.answer_audio != null"
                                                        @tap="playAudio(sentence.answer_audio)" />
                                                <Label v-if="sentence.answer != null" :text="sentence.answer" v-show="showB" />
                                                <Label text="" />
                                            </FlexboxLayout>
                                        </template>

                                        <template v-else>
                                            <FlexboxLayout class="label-margin">
                                                <Image src="~/assets/images/audio-volume.png" stretch="aspectFit" class="icon" width="50" 
                                                        v-show="showA" v-if="sentence.answer_audio != null"
                                                        @tap="playAudio(sentence.answer_audio)" />
                                                <Label v-if="sentence.answer != null" :text="sentence.answer" v-show="showA" />
                                                <Label text="" />
                                            </FlexboxLayout>
                                            <FlexboxLayout  class="label-margin">
                                                <Image src="~/assets/images/audio-volume.png" stretch="aspectFit" class="icon" width="50" 
                                                        v-show="showB" v-if="sentence.question_audio != null"
                                                        @tap="playAudio(sentence.question_audio)" />
                                                <Label v-if="sentence.question != null" :text="sentence.question" v-show="showB"/>
                                                <Label text="" />
                                            </FlexboxLayout>
                                        </template>

                                        <GridLayout rows="auto" columns="*, *, *">
                                            <Button text="<-" @tap="prevSentence" class="btn-common btn-white" row="0" col="0" />
                                            <Button text="Далее" @tap="further" class="btn-common btn-green" row="0" col="1" />
                                            <Button text="->" @tap="nextSentence" class="btn-common btn-white" row="0" col="2" />
                                        </GridLayout>
                                    </template>

                                    <template v-else>
                                        <label textWrap="true" :text="`Отметить карточку '${cardName}' как прослушанную?`" 
                                                class="h2 description-label no-bottom-mr" />
                                        <label v-if="cardSaveError" textWrap="true" 
                                                text="Ошибка при сохранении" class="h2 description-label error-label" />
                                        <GridLayout rows="auto" columns="*, *">
                                            <Button text="Да" @tap="cardSuccess" class="btn-big btn-green" row="0" col="0" />
                                            <Button text="Нет" @tap="cardSuccessReject" class="btn-big btn-orange" row="0" col="1" />
                                        </GridLayout>
                                    </template>

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
                preLoading: 0,
                loadError: false,
                cardTitle: "",
                cardId: null,
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
                enRu: true,
                futherStage: 0,
                showA: false,
                showB: false,
                cardSuccessMode: false,
                cardSaved: false,
                cardSaveError: false
            };
        },
        
        methods: {
            cardSuccessReject() {
                this.cardSuccessMode = false;
                this.cardSaveError = false;
            },

            cardSuccess() {
                this.loading = true;
                HTTP.post(`player/card/${this.cardId}/success/`)
                    .then((response) => {
                        this.cardSaved = true;
                        this.cardSuccessMode = false;
                        this.loading = false;
                    })
                    .catch(error => {
                        this.cardSaveError = true;
                        this.loading = false;
                        console.dir(error);
                    });
                
            },

            further() {
                this.futherStage += 1;
                if (this.futherStage === 1) {
                    this.showA = true;
                } else if (this.futherStage === 2) {
                    if (this.enRu) {
                        if (this.sentence.question_audio !== null) this.playAudio(this.sentence.question_audio)
                        else this.further();
                    } else {
                        if (this.sentence.answer_audio !== null) this.playAudio(this.sentence.answer_audio)
                        else this.further();
                    }
                } else if (this.futherStage === 3) {
                    this.showB = true;
                } else if (this.futherStage === 4) {
                    if (!this.enRu) {
                        if (this.sentence.question_audio !== null) this.playAudio(this.sentence.question_audio)
                        else this.further();
                    } else {
                        if (this.sentence.answer_audio !== null) this.playAudio(this.sentence.answer_audio)
                        else this.further();
                    }
                } else if (this.futherStage === 5) {
                    this.nextSentence();
                }
            },

            prevSentence() {
                this.cardSaved = false;
                if (this.currentNum > 1) {
                    this.loading = true;
                    this.sentence = this.sentences[this.currentNum - 2];
                    this.currentNum -= 1;
                    this.futherStage = 0;
                    this.showA = false;
                    this.showB = false;
                    this.loading = false;
                }
            },

            nextSentence() {
                this.cardSaved = false;
                if (this.currentNum < this.maxNum) {
                    this.loading = true;
                    this.sentence = this.sentences[this.currentNum];
                    this.currentNum += 1;
                    this.futherStage = 0;
                    this.showA = false;
                    this.showB = false;
                    this.loading = false;
                } else if (this.currentNum === this.maxNum) {
                    this.cardSuccessMode = true;    
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
                this.cardSaved = false;
                this.cardSaveError = false;
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
                        this.maxNum = Number.parseInt(card.sentence_count);
                        this.cardName = card.name;
                        this.loading = true;
                        this.showCards = false;
                        this.cardId = id;
                        this.getPlayerCard(id);
                    }
                });
            },
            
            lessonChecked(id) {
                this.lessons.forEach((lesson, i, lessons) => {
                    if (lesson.id === id) {
                        this.cards = lesson.cards;
                        this.loading = true;
                        this.showLessons = false;
                        this.showCards = true;
                        this.loading = false;
                    }
                });
            },

            getPlayerCard(id) {
                HTTP.get(`player/card/${id}/`)
                    .then((response) => {
                        this.showPlayer = true;
                        this.sentences = response.data.sentences;
                        this.sentence = response.data.sentences[0];
                        this.currentNum = 1;
                        this.preLoading += 1;
                    })
                    .catch(error => {
                        this.loadError = true;
                        this.loading = false;
                        console.dir(error);
                    });
            },

            getPlaylist() {
                HTTP.get('player/playlist/')
                    .then((response) => {
                        this.lessons = response.data.lessons;
                        this.showLessons = true;
                        this.loading = false;
                    })
                    .catch(error => {
                        this.loadError = true;
                        this.loading = false;
                        console.dir(error);
                    });
            },

            getSettings() {                             // TODO: что означает несколько объектов в массивах ruen и enru?
                HTTP.get('player/settings/')            // TODO: соответственно, сделать получение и сохранение
                    .then((response) => {
                        console.dir('SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS');
                        console.dir(response.data);
                        console.dir('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
                        this.preLoading += 1;
                    })
                    .catch(error => {
                        this.loadError = true;
                        this.loading = false;
                        console.dir(error);
                    });
            }
        },

        watch: {
            enRu: {                             // TODO: и что здесь должно быть?
                handler(val, oldVal) {
                    console.dir(this.enRu);
                }
            },

            preLoading: {
                handler(val, oldVal) {
                    if (this.preLoading === 2) {
                        this.loading = false;
                    }
                }
            }
        },

        created() {
            this.getPlaylist();
            this.getSettings();
        }
    };
</script>