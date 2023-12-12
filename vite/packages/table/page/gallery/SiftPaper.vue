<template>
 <div class="w-full flex justify-between items-center ">
  <div class="flex items-center justify-center">
    <xt-new-icon icon="fluent:emoji-smile-slight-24-regular" class="mr-2" size="16" style="color: var(--primary-text) !important;"></xt-new-icon>
    <span class="xt-font xt-text font-14 font-400">官方壁纸</span>
  </div>
  <ClosePaperButton v-if="isModal"/>
 </div>
</template>

<script>
import ClosePaperButton from './components/close/ClosePaperButton.vue';

export default {
  props:['isModal'],

  components:{
    ClosePaperButton
  },

  methods:{
    closeSiftPaper(){
      this.$mit.emit('closePaper');
    },
  }
}
</script>

<style lang="scss" scoped>

</style>