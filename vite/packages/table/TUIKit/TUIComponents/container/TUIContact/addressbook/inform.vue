<template>
  <div class="flex flex-col" style="width: 100%;">
   <div class="flex justify-between">
    <!-- <HorizontalPanel :navList="informType" v-model:selectType="initInformType"></HorizontalPanel> -->
    <div class="font-16" style="color: var(--primary-text);">群聊通知</div>

    <div class="flex w-11 h-11 rounded-lg active-button pointer items-center justify-center" style="background: var(--secondary-bg);">
      <Icon icon="qingchu" style="font-size: 1.75em;"></Icon>
    </div>
   </div>
  </div>
</template>

<script>
import { defineComponent, computed,ref,toRefs,reactive,watch,onMounted } from 'vue'
import HorizontalPanel from '../../../../../components/HorizontalPanel.vue'

export default  defineComponent({
 props:['server'],
 
 components:{
  HorizontalPanel
 }, 

 setup(props,ctx){

  const TUIServer = props.server

  const data = reactive({
    noticeList:[],
    systemConversation:{
     unreadCount: 0,
    },

   // informType:[
   //  { title:'群聊通知',name:'notice' },
   //  // { title:'好友申请',name:'Application' }
   // ],
   // initInformType:{ title:'群聊通知',name:'notice' },

   // friendRequest:[] // 好友申请列表
  })
  

  const getSystemMessageList = async () =>{
   // console.log('测试::>>',data.systemConversation?.conversationID);
   // const res  = await TUIServer.getSystemMessageList()
   // console.log('获取通知',res);
  }

  onMounted(getSystemMessageList)

  // watch(() => data.initInformType, async (newVal) => {
  //  if(newVal.name === 'Application'){
  //   const res = await window.$chat.getFriendApplicationList()
  //   console.log('返回好友申请列表',res.data);
  //  }
  // })


  return{
   ...toRefs(data),getSystemMessageList,
  }
 }

})

</script>

<style lang="scss" scoped>
.active-button{
 &:active{
  filter: brightness(0.8);
  opacity: 0.8;
 }
 &:hover{
  opacity: 0.8;
 }
}

:deep(.nav-item){
 border-radius: 8px !important;
}

.font-16{
 font-family: PingFangSC-Regular;
 font-size: 16px;
 font-weight: 400;
}
</style>