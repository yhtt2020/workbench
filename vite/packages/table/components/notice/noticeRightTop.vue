<template>
 <div class="w-full h-11 flex justify-between mb-4 ml-2" style="color: var(--primary-text);">
  <div v-if="appType === 'all'" class="flex items-center">
   <Icon icon="xiaoxi1" style="font-size: 1.4em;"></Icon>
   <span class="pl-3 font-500" style="color: var(--primary-text);">全部消息</span>
  </div>

  <div v-else class="flex items-center">
   <div style="width: 32px;height: 32px;">
    <img  :src="appItem.image" class="w-full h-full object-cover" alt="">
   </div>
   <span class="pl-3 font-400" style="color: var(--primary-text);">{{appItem.title}}</span>
  </div>

  <div class="flex items-center">
   <div class="w-11 pointer flex items-center justify-center h-11" @click="clear">
    <Icon icon="clear" style="font-size: 1.5em;"></Icon>
   </div>
   <div class="w-11 pointer flex items-center justify-center h-11" @click="setNoticeOnOff(noticeSettings.enable = !noticeSettings.enable)">
    <Icon icon="notification" style="font-size: 1.5em;color: var(--secondary-text);" v-if="noticeSettings.enable"></Icon>
    <Icon icon="notification-off" style="font-size: 1.5em;color: var(--secondary-text);" v-else></Icon>
   </div>
  </div>

 </div>
</template>

<script>
import { mapWritableState,mapActions } from 'pinia'
import { noticeStore } from '../../store/notice'

export default {
 props:['appType','appItem'],

 computed:{
  ...mapWritableState(noticeStore,['noticeSettings']),
  
 },

 methods:{
  ...mapActions(noticeStore,['setNoticeOnOff']),
  clear(){  // 清空历史消息通知记录   

  },



 }
}
</script>

<style scoped>

</style>