<template>
  <ModalWindow
    :closable="false"
  >
    <div>
        <slot>
            Are your sure?
        </slot>
        <div>
            <button @click="yesClicked">YES</button>
            <button @click="noClicked">NO</button>
        </div>
    </div>
  </ModalWindow>
</template>

<script>
import ModalWindow from './ModalWindow.vue';
export default {
    components: {
        ModalWindow
    },
    methods: {
        yesClicked(){
            this.$emit('yes');
        },
        noClicked(){
            console.log('!!! NO !!!')
            this.$emit('no');
        }
    }
}
</script>

<style>

</style>