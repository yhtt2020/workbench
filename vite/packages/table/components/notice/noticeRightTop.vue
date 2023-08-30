<template>
 <div class="w-full h-11 flex justify-between mb-4" style="color: var(--primary-text);">
  <div v-if="appType === 'all'" class="flex items-center">
   <Icon icon="xiaoxi1" style="font-size: 1.5em;color: var(--primary-text);"></Icon>
   <span class="pl-3 font-500" style="color: var(--primary-text);">全部消息</span>
  </div>

  <div v-else class="flex items-center">
   <div style="width: 32px;height: 32px;">
    <img  :src="appItem.image" class="w-full h-full object-cover" alt="">
   </div>
   <span class="pl-3 font-400" style="color: var(--primary-text);">{{appItem.title}}</span>
  </div>

  <div class="flex items-center">
   <div class="w-8 pointer flex items-center justify-center h-8" @click="clear">
    <Icon icon="clear" style="font-size: 1.4em;color: var(--secondary-text);"></Icon>
   </div>
  </div>

 </div>
</template>

<script>
import { mapWritableState,mapActions } from 'pinia'
import { noticeStore } from '../../store/notice'

export default {
 props:['appType','appItem','list'],

 computed:{
  ...mapWritableState(noticeStore,['noticeSettings']),
  
 },

 methods:{
  ...mapActions(noticeStore,['removeIMChatData','loadNoticeDB']),
  async clear(){  // 清空历史消息通知记录   
   for(let i=0;i<this.list.length;i++){
    this.removeIMChatData(this.list[i])
   }
   await this.loadNoticeDB()
  },



 }
}
</script>

<style scoped>

</style>