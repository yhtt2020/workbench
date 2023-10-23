<template>
 <div class="flex flex-col" style="width: 500px;height: 320px;">
   <div class="flex items-center justify-center w-full h-12 mb-5" style="position: relative;">
      <span v-if="validateObj.joinOption  === 'FreeAccess'" class="font-16-400" style="color:var(--primary-text);">
        加入群聊
      </span>
      <span v-if="validateObj.joinOption  === 'NeedPermission'" class="font-16-400" style="color:var(--primary-text);">
         申请加入
      </span>
   </div>

   <div class="flex px-6 flex-col mb-6">
      <span class="p-4 font-16-400 rounded-lg mb-4" style="width:452px;color:var(--secondary-text);background: var(--secondary-bg);" v-if="validateObj.joinOption  === 'FreeAccess'">
         暂未加入群聊，点击立即加入即可访问
      </span>
      <span class="p-4 font-16-400 rounded-lg mb-4" style="width:452px;color:var(--secondary-text);background: var(--secondary-bg);" v-if="validateObj.joinOption  === 'NeedPermission'">
         当前群聊需要申请加入，请提交申请后等待管理员审核
      </span>

     <div class="flex items-center p-4 rounded-lg" style="width:452px;background: var(--secondary-bg);">
      <a-avatar shape="square" size="48" :src="validateObj.avatar"></a-avatar>
      <div class="flex  flex-col ml-4">
        <span class="font-16-500 pb-2" style="color:var(--primary-text);"> {{ validateObj.name }} </span>
        <span class="font-14-400" style="color:var(--secondary-text);"> {{ validateObj.memberCount }}人 </span>
      </div>
     </div>
   </div>

   <div class="flex px-6 items-center justify-center">

     <XtButton class="ml-3" v-if="validateObj.joinOption  === 'FreeAccess'"
      style="width: 96px;background: var(--active-bg);color:var(--active-text);"
      @click="joinNow"
     >
      立即加入
     </XtButton>

     <XtButton class="ml-3" v-if="validateObj.joinOption  === 'NeedPermission'"
      style="width: 96px;background: var(--active-bg);color:var(--active-text);"
      @click="joinNow"
     >
      立即申请
     </XtButton>
   </div>
 </div>

</template>

<script>
import { defineComponent, onMounted, reactive,toRefs } from 'vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'

export default defineComponent({
 props:['data'],
 components:{
   CloseOutlined,
 },
 setup (props,ctx) {
  const router = useRouter()

  const data = reactive({
   validateObj:props.data,
  })
  // 立即加入
  const joinNow = async () =>{
   const option = {
      groupID:props.data.groupID
   }
   const res = await window.$chat.joinGroup(option)

   if(res.data.status === 'JoinedSuccess'){
      message.success('加群成功')
      router.push({name:'chatMain'})
      const name = `GROUP${props.data.groupID}`
      window.TUIKitTUICore.TUIServer.TUIConversation.getConversationProfile(name).then((imResponse)=>{
         // 通知 TUIConversation 添加当前会话
         // Notify TUIConversation to toggle the current conversation
         window.TUIKitTUICore.TUIServer.TUIConversation.handleCurrentConversation(imResponse.data.conversation);
      })
   }else if(res.data.status === 'WaitAdminApproval'){
      message.info('入群申请已经发出,需要等待群管理员审核通过')
   }
  }

  return {
   ...toRefs(data),
   joinNow
  }
 }
})
</script>

<style lang="scss" scoped>
.font-16-400{
  font-size: 16px;
  font-weight: 400;
}

.active-button{
   &:active{
      filter: brightness(0.8);
      opacity: 0.8;
   }
   &:hover{
      opacity: 0.8;
   }
}

.font-16-500{
 font-size: 16px;
 font-weight: 500;
}

.font-14-400{
 font-size: 14px;
 font-weight: 400;
}
</style>
