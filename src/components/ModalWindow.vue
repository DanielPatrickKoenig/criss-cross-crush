<template>
  <div class="modal-widnow">
      <div class="inner-window">
          <slot>
              WINDOW CONTENT
          </slot>
          <div 
            class="navigation"
            v-if="cta || closable"
          >
              <button v-if="cta" @click="ctaClicked">{{cta}}</button>
              <button v-if="closable" @click="close">{{cta ? 'cancel' : 'close'}}</button>
          </div>
      </div>
      
  </div>
</template>

<script>
export default {
    props: {
        cta: String,
        closable: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        ctaClicked () {
            this.$emit('cta-clicked');
        },
        close () {
            this.$emit('dismiss');
        }
    }
}
</script>

<style>

</style>