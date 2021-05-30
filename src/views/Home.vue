<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <button v-on:click="loadTest">TEST</button>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
// import {createCrossword, Directions} from '@/utils/GameLogic.js'
import axios from 'axios';
export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  methods: {
    // ccTest () {
    //   console.log(createCrossword(7,8,[
    //     {text: 'apple', direction: Directions.ACROSS, column: 1, row: 5},
    //     {text: 'grape', direction: Directions.DOWN, column: 3, row: 2}
    //   ]));
    // },
    async loadTest () {
      let output = {};
      await axios.get('dictionary.csv').then((result) => {
        // console.log(result.data.split('\n"').length);
        const fullList = result.data.split('\n"');
        for(let i = 1; i < fullList.length; i++){
          const word = fullList[i].split('","')[0];
          output[word.split('')[0].toUpperCase() + (i.toString())] = {word: word, defenition: fullList[i].split('","')[2]};
        }
      });
      // console.log(JSON.stringify(output));
      return output;
    }
  }
}
</script>
