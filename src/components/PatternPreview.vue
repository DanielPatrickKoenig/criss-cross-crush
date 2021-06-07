<template>
  <div style="width:60px;height:60px;">
      <div v-for="(row, r) in pattern" :key="r" :style="`width:100%;height:${100/size}%;display:flex;`">
          <div v-for="(block, b) in row" :key="`${r}-${b}`" :style="`box-shadow:0 0 0 1px #ffffff inset;width:${100/size}%;height:100%;background-color:${block ? '#000000' : 'transparent'}`" />
      </div>
  </div>
</template>

<script>
export default {
    props: {
        pattern: {
            type: Array,
            required: true
        }
    },
    data () {
        return {
            size: this.pattern.length > this.pattern[0].length ? this.pattern.length : this.pattern[0].length
        }
    }
}
</script>

<style>

</style>