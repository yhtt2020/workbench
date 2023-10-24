<template>
  <div class="flex flex-col">

    <div v-if="groupManageInfo.conversation.type !== 'Private'" class="rounded-lg px-4 py-3 flex flex-col font-14 mb-4" style="width: 468px;height:119px;background: var(--secondary-bg);">
      <span class="font-14" style="color: var(--primary-text);">群管理员</span>



      <div class="flex  items-center mt-3">
        <!-- 群管理员列表 -->
        <div class="flex items-center">
          <div v-for="item in isAdminList" class="flex items-center justify-center flex-col mr-3">
           <a-avatar :size="32" :src="item.avatar"></a-avatar>
           <span class="mt-1"> {{  item.nick }}</span>
          </div>
        </div>

        <!-- 添加和删除群管理员按钮 -->
        <div class="flex" v-if="groupManageInfo.role !== 'Member'">
         <div class="flex pointer items-center justify-center active-button rounded-lg"   style="width: 32px; height: 32px; background: rgba(80,139,254,0.2);margin-right:24px;" @click="addAdmin('addAdmin')">
          <Icon icon="tianjia3" style="color: var(--success);font-size: 1.25em;"></Icon>
         </div>

         <div class="flex pointer items-center justify-center active-button rounded-lg" style="width: 32px; height: 32px; background: rgba(255,77,79,0.2);" @click="addAdmin('delAdmin')">
           <Icon icon="jinzhi-yin" style="color: var(--error);font-size: 1.25em;"></Icon>
         </div>
        </div>
      </div>
    </div>


    <div class="rounded-lg px-4 flex flex-col py-3 font-14" style="width: 468px;background: var(--secondary-bg);">
      <div class="flex items-center justify-between">
        <div class="flex flex-col">
         <span class="font-14" style="color: var(--primary-text);">全员禁言</span>
         <span class="font-14" style="color: var(--secondary-text);">全员禁言开启后，只允许群主和管理员发言</span>
        </div>

        <a-switch v-model:checked="groupManageInfo.conversation.muteAllMembers" @change="updateMute($event)"></a-switch>
      </div>


      <a-divider style="height: 2px; background-color:var(--divider)" />


      <div class="flex items-center">
        <div v-for="item in muteList" class="flex items-center justify-center flex-col mr-3">
          <a-avatar :size="32" :src="item.avatar"></a-avatar>
          <span class="mt-1"> {{  item.nick }}</span>
        </div>

        <div class="flex" v-if="groupManageInfo.role !== 'Member' ">
          <div class="flex pointer items-center justify-center active-button rounded-lg"   style="width: 32px; height: 32px; background: rgba(80,139,254,0.2);margin-right:24px;" @click="addMute('addMuteUser')">
           <Icon icon="tianjia3" style="color: var(--success); font-size: 1.25em;"></Icon>
          </div>

          <div class="flex pointer items-center justify-center active-button rounded-lg" style="width: 32px; height: 32px; background: rgba(255,77,79,0.2);" @click="addMute('removeMuteUser')">
            <Icon icon="jinzhi-yin" style="color: var(--error);font-size: 1.25em;"></Icon>
          </div>
        </div>
      </div>

    </div>
  </div>

  <Modal v-if="isMemeberShow" v-model:visible="isMemeberShow" :blurFlag="true">
    <UserSelect :list="type === 'addAdmin' ? addList : type === 'delAdmin' ?  userList  : type === 'addMuteUser' ?  addList : clearMute  "
    :type="type" :groupID="groupManageInfo.groupID"
    :server="server" @close="close"  @closeUser="isMemeberShow = false"
    >
    </UserSelect>
  </Modal>
</template>

<script>
import {computed, defineComponent, onMounted, reactive,toRefs} from 'vue'
import Modal from '../../../../../components/Modal.vue';
import UserSelect from '../../../components/userselect/index.vue'
import _ from 'lodash-es'

export default defineComponent({
 props:['groupManageInfo','server'],

 components:{
  Modal,UserSelect
 },

 setup(props,ctx){
  const tim = props.server.TUICore.tim
  const TIM = props.server.TUICore.TIM

  const data = reactive({
    isMemeberShow:false,  // 显示邀请选中用户成为管理弹窗
    type:'', // 接收是删除类型还是添加类型
    addList: [],  // 添加管理员数据
    userList:[],   // 清除管理员数据
    clearMute:[], // 清除禁言人员
  })


  const addAdmin = (type) => {  // 添加和删除群聊管理员
    switch (type) {
      case 'addAdmin':
        data.isMemeberShow = true
        data.type = type
        data.addList = props.groupManageInfo.list
        break;
      case 'delAdmin':

        if(isAdminList.value.length !== 0){
          data.isMemeberShow = true
          data.type = type
          data.userList = isAdminList
        }else{
          data.isMemeberShow = false
        }

        break;
      default:
        break;
    }
  }

  const addMute = (type) =>{  // 新增禁言用户
    if(type === 'addMuteUser'){
      data.isMemeberShow = true
      data.type = type
      data.addList = props.groupManageInfo.list
    }else{
      if(muteList.value.length !== 0){
        data.isMemeberShow = true
        data.type = type
        data.clearMute = muteList
      }else{
        data.isMemeberShow = false
      }
    }
  }

  const close = () =>{  // 关闭群聊管理弹窗
    data.isMemeberShow = false
    ctx.emit('close')
  }

  const isAdminList = computed(()=>{
   const list = []
   for(let i =0;i<props.groupManageInfo.list.length;i++){
     if(props.groupManageInfo.list[i].role === "Admin"){
      list.push(props.groupManageInfo.list[i])
     }
   }
   return list
  })

  const muteList = computed(()=>{
   const time = new Date().getTime();
   const list =  props.groupManageInfo.list.filter((item) => item?.muteUntil * 1000 - time > 0);
   return list
  })

  const updateMute = async (evt) =>{  // 设置全体禁言
    const options = {
      groupID: props.groupManageInfo.groupID,
      muteAllMembers: evt,
    }
    await tim.updateGroupProfile(options)
    ctx.emit('close')
  }

  return{
    isAdminList,muteList,

    addAdmin,...toRefs(data),
    close,updateMute,addMute
  }
 },
})
</script>

<style lang="scss" scoped>
.font-14{

 font-size: 14px;
 font-weight: 400;
}

.font-16{

 font-size: 16px;
 font-weight: 400;
}

.font-12{

 font-size: 12px;
 font-weight: 400;
}

:deep(.ant-divider-horizontal){
  margin: 12px 0 !important;
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

:deep(.dialog-main-content){
 width: 650px;
 height: 534px;
}


</style>
