<template>
 <div style="height: 54px;background: var(--secondary-bg);padding: 11px 16px;margin-bottom: 16px;" class="flex  rounded-lg items-center">
  <a-avatar shape="square" :size="32" :src="group.avatar"></a-avatar>
  <span class="font-16 pl-4" style="color: var(--primary-text);">{{ group.name }}</span>
 </div>

 <div class="rounded-lg flex flex-col" style="background: var(--secondary-bg);margin-bottom: 16px;">
  <div class="flex items-center justify-between py-3 px-4">
   <span class="font-14" style="color: var(--primary-text);">群ID</span>
   <div class="flex items-center">
    <span  class="font-14" style="color: var(--secondary-text);">{{ group.groupID }}</span>
    <Icon icon="icon_copy" style="color: var(--secondary-text);font-size: 1.5em;cursor: pointer;" @click="handleGroupIDCopy"></Icon>
   </div>
  </div>

  <div class="flex items-center justify-between py-3 px-4">
   <span class="font-14" style="color: var(--primary-text);">群类型</span>
   <span class="font-14" style="color: var(--secondary-text);">{{ typeName[group.type] }}</span>
  </div>

  <div class="flex items-center justify-between py-3 px-4">
   <span class="font-14" style="color: var(--primary-text);">加群方式</span>
   <span class="font-14" style="color: var(--secondary-text);">{{ typeName[group.joinOption] }}</span>
  </div>
   <div class="flex items-center justify-between py-3 px-4">
     <span class="font-14" style="color: var(--primary-text);">群人数</span>
     <span class="font-14" style="color: var(--secondary-text);">  {{ group.memberCount}}</span>
   </div>

 </div>


 <div class="flex" v-if="group?.selfInfo?.role !== 'Member'">
  <div class="flex items-center pointer justify-center active-button rounded-lg mr-3 h-12 font-16"
   style="width: 148px;background: var(--secondary-bg);color: var(--primary-text);"
   @click="changeGroup('change')"
  >
   转让群聊
  </div>
  <div class="flex items-center pointer justify-center active-button rounded-lg mr-3 h-12 font-16"
   style="width: 148px; background: var(--error);color:var(--active-text);"
   @click="dismiss(group)"
  >
   解散群聊
  </div>
  <div class="flex items-center pointer rounded-lg justify-center active-button h-12 font-16"
   style="width: 148px; background: var(--active-bg);color: var(--active-text);"
   @click="enter(group.groupID,'GROUP')"
  >
   进入群聊
  </div>
 </div>

 <div class="flex items-center justify-center" v-else>
  <div class="flex items-center pointer justify-center active-button rounded-lg mr-3 h-12 font-16"
  style="width: 148px; background: var(--error);color:var(--active-text);"
  @click="quit(group.groupID)"
  >
   退出群聊
  </div>
  <div class="flex items-center pointer rounded-lg justify-center active-button h-12 font-16"
   style="width: 148px; background: var(--active-bg);color: var(--active-text);"
   @click="enter(group.groupID,'GROUP')"
  >
  进入群聊
  </div>
 </div>


 <Modal v-model:visible="groupDetailShow" v-if="groupDetailShow" :blurFlag="true">
   <UserSelect :type="type" :list="memeber" @close="close" @closeUser="close" :groupID="group.groupID"></UserSelect>
 </Modal>
</template>

<script >
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import useClipboard from 'vue-clipboard3';
import { message,Modal as antdModal } from 'ant-design-vue'
import { router } from '../../../../../router'
import Modal from '../../../../../components/Modal.vue';
import UserSelect from '../../../components/userselect/index.vue'

export default defineComponent({
 props:['group','memeber'],


 components:{ Modal,UserSelect },


 setup (props,ctx) {

  const types = window.$TUIKit.TIM.TYPES

  const data = reactive({
   typeName: {
    [types.GRP_WORK]: '好友工作群',
    [types.GRP_PUBLIC]: '陌生人社交群',
    [types.GRP_MEETING]: '临时会议群',
    [types.JOIN_OPTIONS_FREE_ACCESS]: '自由加入',
    [types.JOIN_OPTIONS_NEED_PERMISSION]: '需要验证',
    [types.JOIN_OPTIONS_DISABLE_APPLY]: '禁止加群',
   },
   groupDetailShow:false,  // 转让群聊触发按钮入口
   type:'',
   list:[],
  })

  const handleGroupIDCopy = async () => {  // 复制群组id
   const { toClipboard } = useClipboard();
   const res = await toClipboard(props.group.groupID);
   if(res.text !== ""){
    message.success('群聊ID成功复制');
   }
  }

  const enter = async (ID, type) => {  // 进入群聊
   router.push({name:'chatMain'})
   const name = `${type}${ID}`;
   window.$TUIKit.TUIServer.TUIConversation.getConversationProfile(name).then((imResponse) => {
     // 通知 TUIConversation 添加当前会话
     // Notify TUIConversation to toggle the current conversation
     window.$TUIKit.TUIServer.TUIConversation.handleCurrentConversation(imResponse.data.conversation);
   })

   ctx.emit('closeDrawer')
  }

  const dismiss = async (group) => {  // 解散群聊
    antdModal.confirm({
      content:'是否确认操作',
        okText:'确认',
        cancelText:'取消',
        onOk () {
          dismissGroup(group)
          ctx.emit('closeDrawer')
        }
    })
  }

  const dismissGroup = async (group) =>{
    const res =  await window.$chat.dismissGroup(group.groupID)
    const result =  await window.$chat.deleteConversation(`GROUP${group.groupID}`)
    if(res.code === 0 && result.code === 0){
      message.success(`${group.name}已被解散`)
    }
  }

  const changeGroup  = async (type) =>{  // 转让群聊
   data.type = type
   data.groupDetailShow = true
  }

  const close = () =>{
   data.groupDetailShow = false
   ctx.emit('closeDrawer')
  }

  const quit = async (group) => {
    antdModal.confirm({
      content:'是否确认操作',
        okText:'确认',
        cancelText:'取消',
        onOk () {
          quitGroup(group)
          ctx.emit('closeDrawer')
        }
    })
  }

  const quitGroup = async (group) =>{
    await window.$chat.quitGroup(group);
    const result =  await window.$chat.deleteConversation(`GROUP${group}`)
    if(res.code === 0 && result.code === 0){
      message.success(`${props.group.name}已退出`)
    }
  }

  return {
   ...toRefs(data),handleGroupIDCopy,enter,dismiss,changeGroup,close,
   quit,dismissGroup,quitGroup,
  }
 }
})
</script>

<style lang="scss" scoped>
.font-16{

 font-size: 16px;
 font-weight: 400;
}

.font-14{

 font-size: 14px;
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
</style>
