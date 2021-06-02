import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const savedGamesID = 'gridslider_2_saved_games_d';
const gameMenifestTag = `${savedGamesID}_manifest`;
const levelTag = `${savedGamesID}_level`;
const badjesTag = `${savedGamesID}_badges`;
const patternTag = `${savedGamesID}_pattern`;
const baseLevel = 3;

export default new Vuex.Store({
  state: {
    currentLevel: baseLevel,
    currentBadges: [],
    currentPattern: [],
    savedGames: {}
  },
  mutations: {
    updateGameData(state, data) {
      for(let key in data){
        Vue.set(state, key, data[key]);
      }
      localStorage.setItem(levelTag, JSON.stringify(state.currentLevel));
      localStorage.setItem(badjesTag, JSON.stringify(state.currentBadges));
      localStorage.setItem(patternTag, JSON.stringify(state.currentPattern)); 
    },
    saveGames(state, name){
      state.savedGames[name] = {currentBadges: state.currentBadges, currentLevel: state.currentLevel, currentPattern: state.currentPattern, date: new Date().getTime()};
      console.log(state.savedGames);
      localStorage.setItem(gameMenifestTag, JSON.stringify(state.savedGames));
    },
    updateSavedGames(state, data){
      Vue.set(state, 'savedGames', data);
    }
  },
  actions: {
    setGameData ({commit}, data){
      commit('updateGameData', data);
    },
    loadGameData({commit}){
      const level = localStorage.getItem(levelTag);
      const badges = localStorage.getItem(badjesTag);
      const pattern = localStorage.getItem(patternTag); 
      commit('updateGameData', {currentLevel: level ? Number(level) : baseLevel, currentBadges: badges ? JSON.parse(badges) : [], currentPattern: pattern ? JSON.parse(pattern) : []});
    },
    loadGames({commit}){
      const savedGames = localStorage.getItem(gameMenifestTag)
      commit('updateSavedGames', savedGames ? JSON.parse(savedGames) : {});
    },
    saveGame({commit}, name){
      commit('saveGames', name);
    },
    hasSavedGame(){
      return localStorage.getItem(patternTag) !== undefined && localStorage.getItem(patternTag) !== null && localStorage.getItem(patternTag) !== '' && localStorage.getItem(patternTag) !== '[]';
    }
  },
  modules: {

  }
})
