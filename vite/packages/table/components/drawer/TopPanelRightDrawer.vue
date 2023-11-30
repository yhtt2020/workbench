<template>
 <a-drawer width="500" :closable="false" style="z-index:1000;" placement="right" class="no-drag"
  v-model:visible="rightVisible" :bodyStyle="{ padding: '0', overflow: 'hidden !important', }"
  @closeMessage="rightVisible = false"
 >
  <NoticeIndex @closeMessage="rightVisible = false"/>
 </a-drawer>
</template>

<script>
import {mapActions,mapWritableState} from 'pinia';

import NoticeIndex from '../../page/notice/noticeIndex.vue'

export default {
 name:'TopPanelRightDrawer',

 components:{
  NoticeIndex,
 },

 data(){
  return{
   rightVisible:false,
  }
 },

 computed:{
   
 },

 methods:{
  // 开启右侧抽屉菜单
  openRightDrawer(){
   this.rightVisible = true;
  }
 }

};
</script>

<style lang="scss" scoped>
</style>