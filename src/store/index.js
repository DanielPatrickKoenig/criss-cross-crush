import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentLevel: 3,
    currentBadges: [],
    currentPattern: [],
    savedGames: {}
  },
  mutations: {
    updateGameData(state, data) {
      console.log('mutated !!!');
      for(let key in data){
        console.log(key);
        Vue.set(state, key, data[key]);
      }
    },
    updateSavedGames(state, {name, game}){
      state.savedGames[name] = game;
    }
  },
  actions: {
    setGameData ({commit}, data){
      console.log(data);
      commit('updateGameData', data);
    },
    loadGameData({commit}, name){
      const gameData = localStorage.getItem(name);
      commit('updateGameData', gameData);
    },
    saveGame({commit}, {name, game}){
      localStorage.setItem(name, game);
      commit('updateSavedGames', {name, game});
    }
  },
  modules: {

  }
})
