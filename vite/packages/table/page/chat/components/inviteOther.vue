<template>
 <div class="flex flex-col mb-6" style="width:500px;">
  <div class="flex w-full items-center justify-center h-10 m-3">
   <span class="category-16-400" style="color:var(--primary-text);">邀请其他人</span>
   <div class="flex items-center category-button pointer rounded-lg justify-center w-10 h-10" 
    style="position: absolute; top:12px;right:8px;background: var(--secondary-bg);"
    @click="closeButton"
   >
    <InviteIcon  icon="fluent:dismiss-16-filled" style="font-size: 1.25rem;"/>
   </div>
  </div>

  <div class="px-6 flex flex-col">
   <div class="invite-bg p-4 flex flex-col pointer">
    <div class="flex w-full justify-between items-center mb-2.5">
      <span class="category-16-400" style="color: var(--primary-text);">直接添加</span>
      <InviteIcon icon="fluent:chevron-right-16-filled"  style="font-size:20px;color:var(--secondary-text);"/>
    </div>
    <div class="category-14-400" style="color: var(--secondary-text);">
     来自我的小队成员、组织成员和好友，确认选择后自动加入社群
    </div>
   </div>

   <div class="invite-bg p-4 my-4 flex flex-col pointer">
    <div class="flex w-full justify-between items-center mb-2.5">
      <span class="category-16-400" style="color: var(--primary-text);">邀请加入</span>
      <InviteIcon icon="fluent:chevron-right-16-filled"  style="font-size:20px;color:var(--secondary-text);"/>
    </div>
    <div class="category-14-400" style="color: var(--secondary-text);">
     支持批量发送邀请信息到群聊或好友，对方接受邀请后即可加入。
    </div>
   </div>

   <div class="invite-bg p-4">789</div>
  </div>
 </div>

 
</template>

<script>
import { Icon as InviteIcon } from '@iconify/vue'
export default {
 components:{
  InviteIcon,
 },

 props:['no'],

 methods:{
  closeButton(){
   this.$emit('close')
  }
 }

}
</script>

<style lang="scss" scoped>
</style>