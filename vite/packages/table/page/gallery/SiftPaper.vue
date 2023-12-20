<template>
  <div class="w-full h-full flex flex-col">
    <div class="w-full flex justify-between items-center mb-2" :class="isModal ? '' :'h-10'">
      <div class="flex items-center justify-center" :class="isModal ? '' :'h-10'">
        <xt-new-icon icon="fluent:emoji-smile-slight-24-regular" class="mr-2" :size="isModal ? 20 : 32" style="color: var(--primary-text) !important;"></xt-new-icon>
        <span class="xt-font xt-text" :class="isModal ? 'font-14 font-400' : 'font-16 font-600'">精选壁纸</span>
      </div>
      <ClosePaperButton v-if="isModal"/>
    </div>

    <div class="flex-1 h-4/5">
      <PaperDetail :paperList="selectWallPaper" :isModal="isModal"/>
    </div>
  </div>
</template>

<script>
import ClosePaperButton from './components/close/ClosePaperButton.vue';
import PaperDetail from './components/content/PaperDetail.vue';

import { selectWallPaper } from '../../page/gallery/data/gallery';

export default {
  props:['isModal'],

  components:{
    ClosePaperButton,PaperDetail,
  },

  data(){
    return{
      selectWallPaper,
    }
  },

  methods:{
    closeSiftPaper(){
      this.$bus.emit('closePaper');
    },
  }
}
</script>

<style lang="scss" scoped>

</style>