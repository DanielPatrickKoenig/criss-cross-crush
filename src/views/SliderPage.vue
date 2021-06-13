<template>
    <div class="game-page">
        <div>
            <div style="display:flex;flex-wrap:wrap;"><button v-for="(group, key, i) in patterns" :key="i" @click="patternClicked(group)">{{key}}</button></div>
            <div style="display:flex;flex-wrap:wrap;">
                <div
                    v-for="(pattern, i) in activePatterns" 
                    :style="'margin:4px;'"
                    :key="i"
                >
                    <PatternPerview 
                        :style="{opacity: hasPattern(pattern) ? '1' : '.5'}"
                        :pattern="pattern"
                    />
                </div>
            </div>
            <div>moves: {{movesRemaining}}</div>
        </div>
        <SliderGame 
            v-if="selectedPattern" 
            :pattern="selectedPattern" 
            :loaded="hasSave"
            :matches="patternsToMatch"
            :blocked="blockedRows"
            @pattern-found="patternFound"
            @move="moveMade"
            @updated="onUpdated"
        />
        <button @click="saving = true">save game</button>
        <button @click="loading = true">load game</button>
        <ModalWindow 
            v-if="saving"
            cta="save"
            @cta-clicked="saveCurrentGame"
            @dismiss="saving = false;gameName = ''"
        >
            <input type="text" v-model="gameName" />
        </ModalWindow>
        <ModalWindow
            v-if="loading"
            @dismiss="loading = false"
        >
            <GameLoader @game-selected="gameSelected" />
        </ModalWindow>
        <YesNoModal
            v-if="showOverwriteWarning"
            @yes="overwrite"
            @no="showOverwriteWarning = false;gameName = ''"
        >
            You already have a game with the name ({{gameName}}). Do you want to replace it?
        </YesNoModal>
        <YesNoModal
            v-if="showLostProgressWarning"
            @yes="setCurrentGame"
            @no="showLostProgressWarning = false;"
        >
            You have not saved your current game. Do you want to continue?
        </YesNoModal>
    </div>
</template>

<script>
// /slider?game=14,12,A15700-0-5-1,G7712-1-2-3
// /slider?game=14,14,A7630-0-2-0,L5412-1-0-4,R2842-0-0-1,E7764-1-0-2,S29052-0-5-1,T5420-1-0-7,G122-1-5-6,O5682-1-4-9,D9128-0-7-6,F432-0-8-1,D16448-1-8-3,C9288-0-10-3,U42-1-9-8,S12186-1-6-11,V694-1-1-13,P29166-0-3-11,G10172-1-0-11,P12590-0-12-0,L9222-0-12-8
import {createLevel, patterns} from '../utils/GameLogic.js';
import SliderGame from '../components/SliderGame.vue';
import ModalWindow from '../components/ModalWindow.vue';
import YesNoModal from '../components/YesNoModal.vue';
import GameLoader from '../components/GameLoader.vue';
import PatternPerview from '../components/PatternPreview.vue';
import {mapState, mapActions} from 'vuex';
import {uniq} from 'lodash';
export default {
    components: {
        SliderGame,
        ModalWindow,
        GameLoader,
        YesNoModal,
        PatternPerview
    },
    data () {
        return {
            selectedPattern: null,
            level: 9,
            blocks: 3,
            badges: [],
            useSymbols: false,
            hasSave: false,
            saving: false,
            gameName: '',
            loading: false,
            showOverwriteWarning: false,
            showLostProgressWarning: false,
            gameToLoad: {},
            saved: true,
            patterns,
            allActivePatterns: [...patterns.blocks_3, ...patterns.blocks_4],
            patternsDisplayed: 6,
            foundPatterns: [],
            maxMoves: 10,
            movesRemaining: 0,
            blockedRows: 0
        }
    },
    computed: {
        ...mapState(['currentLevel', 'currentPattern', 'currentBadges', 'savedGames']),
        activePatterns () {
            return this.allActivePatterns.filter((item, index) => index < this.patternsDisplayed);
        },
        patternsToMatch () {
            return JSON.stringify(this.activePatterns);
        },
        hasPattern () {
            return pattern => this.foundPatterns.filter(item => JSON.stringify(item) === JSON.stringify(pattern)).length > 0
        }
    },
    methods: {
        ...mapActions(['setGameData', 'hasSavedGame', 'loadGameData', 'saveGame']),
        patternClicked (e) {
            console.log(e);
            this.acivePatterns = e;
        },
        onUpdated(e){
            console.log(e);
            if(e.levelComplete){
                alert('win');
                this.level++;
            }
            this.saved = e.setup;
            this.cyclePatterns();
            this.setGameData({currentPattern: e.gameState, currentLevel: this.level, currentBadges: this.badges});
        },
        moveMade() {
            this.movesRemaining--;
            if(this.movesRemaining <= 0){
                this.patternCheck();
                this.movesRemaining = this.maxMoves;
                this.cyclePatterns();
            }
        },
        saveCurrentGame(){
            if(this.savedGames[this.gameName]){
                this.showOverwriteWarning = true;
            }
            else{
                this.saveGame(this.gameName);
                this.saved = true;
                this.gameName = '';
            }
            this.saving = false;
        },
        gameSelected(e){
            
            this.gameToLoad = e;
            if(this.saved){
                this.setCurrentGame();
            }
            else{
                this.showLostProgressWarning = true;
            }
            this.loading = false;
            
            
        },
        setCurrentGame(game){
            this.selectedPattern = null;
            setTimeout(() => {
                this.selectedPattern = game ? game.currentPattern : this.gameToLoad.currentPattern;
                this.level = game ? game.currentLevel : this.gameToLoad.currentLevel;
                this.badges = game ? game.currentBadges : this.gameToLoad.currentBadges;
                this.showLostProgressWarning = false;
            }, 10);
            
        },
        overwrite(){
            this.saveGame(this.gameName);
            this.saved = true;
            this.gameName = '';
            this.showOverwriteWarning = false;
        },
        cyclePatterns () {
            for(let i = 0; i < this.patternsDisplayed; i++){
                const firtstPattern = this.allActivePatterns[0];
                this.allActivePatterns.splice(0, 1);
                this.allActivePatterns.push(firtstPattern);
            }
            this.foundPatterns = [];
        },
        patternFound(e){
            this.foundPatterns.push(e);
        },
        patternCheck () {
            const foundPatternLength = uniq(this.foundPatterns.map(item => JSON.stringify(item))).length;
            if(foundPatternLength < this.patternsDisplayed){
                this.blockedRows++;
            }
        }
    },
    created(){
        this.movesRemaining = this.maxMoves;
        this.loadGameData();
    },
    async mounted () {
        this.hasSave = await this.hasSavedGame();
        this.selectedPattern = this.hasSave ? this.currentPattern : createLevel(this.level, this.useSymbols); 
        // const targetedBlocks = scanBoard([[true, false], [false, true]], this.selectedPattern, this.level);
        // console.log(updatedBoard(targetedBlocks, this.selectedPattern));
        // console.log(findPattern([[true, false], [false, true]], this.selectedPattern, '2'));
    }
}
</script>

<style>

</style>