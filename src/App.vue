<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    methods: {
      ...mapActions(['loadGames'])
    },
    created () {
      this.loadGames();
    }
}
</script>


<style lang="css">
@import "./scss/partials/_vicky.css";
</style>
