<template>
    <div class="game-page">
        <SliderGame 
            v-if="selectedPattern" 
            :pattern="selectedPattern" 
            :loaded="hasSave"
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
import {createLevel} from '../utils/GameLogic.js';
import SliderGame from '../components/SliderGame.vue';
import ModalWindow from '../components/ModalWindow.vue';
import YesNoModal from '../components/YesNoModal.vue';
import GameLoader from '../components/GameLoader.vue';
import {mapState, mapActions} from 'vuex';
export default {
    components: {
        SliderGame,
        ModalWindow,
        GameLoader,
        YesNoModal
    },
    data () {
        return {
            selectedPattern: null,
            level: 9,
            badges: [],
            useSymbols: false,
            hasSave: false,
            saving: false,
            gameName: '',
            loading: false,
            showOverwriteWarning: false,
            showLostProgressWarning: false,
            gameToLoad: {},
            saved: true
        }
    },
    computed: {
        ...mapState(['currentLevel', 'currentPattern', 'currentBadges', 'savedGames'])
    },
    methods: {
        ...mapActions(['setGameData', 'hasSavedGame', 'loadGameData', 'saveGame']),
        onUpdated(e){
            if(e.levelComplete){
                alert('win');
                this.level++;
            }
            this.saved = e.setup;
            
            this.setGameData({currentPattern: e.gameState, currentLevel: this.level, currentBadges: this.badges});
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
        }
    },
    created(){
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