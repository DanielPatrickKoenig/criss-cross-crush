<template>
    <div class="game-page">
        <SliderGame 
            v-if="selectedPattern" 
            :pattern="selectedPattern" 
            :loaded="false"
            @updated="onUpdated"
        />
    </div>
</template>

<script>
// /slider?game=14,12,A15700-0-5-1,G7712-1-2-3
// /slider?game=14,14,A7630-0-2-0,L5412-1-0-4,R2842-0-0-1,E7764-1-0-2,S29052-0-5-1,T5420-1-0-7,G122-1-5-6,O5682-1-4-9,D9128-0-7-6,F432-0-8-1,D16448-1-8-3,C9288-0-10-3,U42-1-9-8,S12186-1-6-11,V694-1-1-13,P29166-0-3-11,G10172-1-0-11,P12590-0-12-0,L9222-0-12-8
import {createLevel} from '../utils/GameLogic.js';
import SliderGame from '../components/SliderGame.vue';
import {mapState, mapActions} from 'vuex';
export default {
    components: {
        SliderGame
    },
    data () {
        return {
            selectedPattern: null,
            level: 3,
            useSymbols: false
        }
    },
    computed: {
        ...mapState(['currentLevel', 'currentPattern', 'currentBadges'])
    },
    methods: {
        ...mapActions(['setGameData']),
        onUpdated(e){
            if(e.levelComplete){
                alert('win');
                this.level++;
            }
            this.setGameData({currentPattern: e.gameState, currentLevel: this.level});
        }
    },
    mounted () {
        this.selectedPattern = createLevel(this.level, this.useSymbols); 
    }
}
</script>

<style>

</style>