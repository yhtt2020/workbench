<template>
 <a-drawer v-model:visible="rightVisible" placement="right" :width="500"  title="导入本地图片"  class="no-drag" style="z-index:1010;">
  <Import :loadStaticPaper="loadStaticPaper" :getLoadLively="getLoadLively"/>
 </a-drawer>
</template>

<script>
import Import from '../../Import.vue';

export default {
 name:'PaperRightDrawer',

 props:['loadStaticPaper','getLoadLively'],

 components:{ Import },

 data(){
  return{
   rightVisible:false,
  }
 },
 
 methods:{
  openRightDrawer(){ this.rightVisible = true;},

 },
}
</script>

<style lang="scss" scoped>

</style>