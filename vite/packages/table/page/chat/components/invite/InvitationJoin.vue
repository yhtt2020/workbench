<template>
 <div class="flex flex-col mb-4" style="width:667px;height: 594px;">
  <div class="flex items-center justify-center" style="position: relative;line-height: 64px;">
    <div class="back-button w-10 h-10 pointer rounded-lg category-button flex items-center justify-center" @click="backButton">
     <DirectlyIcon icon="fluent:chevron-left-16-filled" style="font-size: 1.5rem;"/>
    </div>
    <span class="category-16-400" style="color:var(--primary-text);">邀请加入</span>
    <div class="close-button w-10 h-10 pointer rounded-lg category-button flex items-center justify-center" @click="closeButton">
     <DirectlyIcon icon="fluent:dismiss-16-filled" style="font-size: 1.25rem;" />
    </div>
  </div>

  <ContactSelector title="最近聊天" inviteMode="invite" :list="{teamData:recentlyChatList}" :no="no"/>

 </div>
</template>

<script>
import { ref,reactive,computed,onMounted,toRefs } from 'vue'
import { Icon as DirectlyIcon } from '@iconify/vue'
import ContactSelector from '../contact/ContactSelector.vue'

export default {
 components:{
  DirectlyIcon,
  ContactSelector,
 },

 props:['no'],

 setup(props,ctx){
  const server = window.$TUIKit

  const recentlyChatList = computed(()=>{
    const list = server.store?.store?.TUIConversation?.conversationList
    const mapList =  list.map((item)=>{ return item.userProfile || item.groupProfile })
    // console.log('获取最近聊天数据', mapList)
    return mapList
  })

  const backButton = () =>{
    ctx.emit('back')
  }

  const closeButton = () =>{
    ctx.emit('close')
  }

  return{
    recentlyChatList,
    backButton,closeButton,
  }
 }

}


</script>

<style lang="scss" scoped>
.back-button{
 position: absolute;
 top: 12px;
 left: 8px;
 background: var(--secondary-bg);
}

.close-button{
 position: absolute;
 top: 12px;
 right:8px;
 background: var(--secondary-bg);
}
</style>