<template>
 <div class="flex items-center flex-col" style="color: var(--primary-text);">
  <div class="flex items-center justify-center" style="margin-bottom: 24px;">
    <div class="rounded-lg pointer flex items-center justify-center" style="width: 64px;height: 64px;">
     <a-avatar shape="square" :size="40" :src="groupInfo?.groupProfile.avatar"></a-avatar>
    </div>
  </div>
  
  <a-input v-model:value="groupRef" style="color: var(--primary-text);border-radius: 12px !important;"></a-input>
  <a-button type="primary" @click="saveGroupName" style="width: 100%; height: 48px; margin-top: 24px;border-radius: 12px !important;">保存</a-button> 

 </div>
</template>

<script>
// import { mapActions,mapWritableState } from 'pinia'
import { defineComponent,toRefs,ref,reactive,computed} from 'vue'
import { noticeStore } from '../../../../../store/notice'
import { appStore } from '../../../../../store'

const groupName =  defineComponent({
 props:['groupInfo','server'],
  
 setup(props,ctx){
  const server = props.server.TUICore.TUIServer.TUIGroup
  const groupRef = ref(props.groupInfo?.groupProfile.name);

  const store = noticeStore()
  const nowUser = appStore()

  const saveGroupName = async () =>{  // 保存群组名称修改后的数据

    const option = {
      groupID:props.groupInfo?.groupProfile?.groupID,
      name:groupRef.value
    }
    
    const res = await server.updateGroupProfile(option)
    if(store.$state.noticeEnable && res.code === 0){
      const notice = {
        title:'群聊消息通知',
        body:`${nowUser.$state.userInfo.nickname}修改群名为${props.groupInfo?.groupProfile?.name}`,
        time: Date.now(),
        from:{
          username:`${props.groupInfo?.groupProfile?.name}`,
          avatarUrl:`${props.groupInfo?.groupProfile?.avatar}`
        },
        icon:`${props.groupInfo?.groupProfile?.avatar}`,
        level:'low'
      }
      window.$notice.sendNotice(notice)
    }
     
    ctx.emit('close')
    
  }

  return{
   saveGroupName,groupRef
  }
 }
})
export default groupName
</script>

<style lang="scss" scoped>

</style>