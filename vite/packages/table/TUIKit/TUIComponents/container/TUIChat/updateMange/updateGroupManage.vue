<template>
 <div class="flex flex-col">

  <div class="rounded-lg px-4 py-3 flex flex-col font-14 mb-4" style="width: 468px;height:119px;background: var(--secondary-bg);">
   <span class="font-14" style="color: var(--primary-text);">群管理员</span>

   <div class="flex items-center mt-3">
    <div v-if="isAdminList.length === 0" class="font-12 mt-1 mr-3" style="color: var(--primary-text);">暂无群管理员</div>
    
    <div v-else v-for="item in isAdminList" class="flex flex-col items-center" style="margin-right: 16px;">
     <a-avatar :size="32" :src="item.avatar"></a-avatar>
     <div class="font-12 mt-1" style="color: var(--primary-text);">
      {{ item.nick }}
     </div>
    </div>
 
    <div class="flex" v-if="groupManageInfo.role === 'Owner'">
     <div class="flex pointer items-center justify-center active-button rounded-lg" 
      style="width: 32px; height: 32px; background: rgba(80,139,254,0.2);margin-right:24px;"
      @click="inviteAdmin"
     >
      <Icon icon="tianjia3" style="color: var(--active-bg);"></Icon>
     </div>
     <div class="flex pointer items-center justify-center active-button rounded-lg" 
      style="width: 32px; height: 32px; background: rgba(255,77,79,0.2);"
      @click="deleteAdmin"
     >
      <Icon icon="jinzhi-yin" style="color: var(--error);"></Icon>
     </div>
    </div>
   </div>
  </div>

  <div class="rounded-lg px-4 flex flex-col py-3 font-14" style="width: 468px;background: var(--secondary-bg);">
   <div class="flex items-center justify-between" style="height: 72px;">
     <div class="flex flex-col">
      <span class="font-14" style="color: var(--primary-text);">全员禁言</span>
      <span class="font-14" style="color: var(--secondary-text);">全员禁言开启后，只允许群主和管理员发言</span>
     </div>
     <a-switch></a-switch>
   </div>

   <a-divider style="height: 2px; background-color:var(--divider)" />

   <div style="height: 119px;">
    <!-- {{ groupManageInfo }} -->
   </div>
  </div>

 </div>

 <Modal v-if="isMemeberShow" v-model:visible="isMemeberShow" :blurFlag="true">
  <div class="flex" style="color: var(--primary-text);width: 650px;height: 534px;padding: 16px;">
    <div style="width:293px;">
     <vue-custom-scrollbar :settings="settingsScroller" style="height:100%; margin-bottom: 16px;">
      <div v-for="item in groupManageInfo.list" class="flex pointer" style="margin-bottom: 16px;" @click="selectAdmin(item)">
       <div class="flex">
        <a-avatar :size="32" :src="item.avatar"></a-avatar>
        <div class="font-16" style="color: var(--primary-text);margin-left: 16px;">
         {{ item.nick }}
        </div>
       </div>
      </div>
     </vue-custom-scrollbar>
    </div>

    <a-divider type="vertical" style="height: 502px; background-color:var(--divider);"></a-divider>

    <div class="flex flex-col" style="width: 293px;">
     <vue-custom-scrollbar :settings="settingsScroller" style="height:88%; margin-bottom: 16px;">
      <div v-for="item in adminList" class="flex items-center justify-between pointer" style="margin-bottom: 16px;" >
       
       <div class="flex">
        <a-avatar :size="32" :src="item.avatar"></a-avatar>
        <div class="font-16" style="color: var(--primary-text);margin-left: 16px;">
         {{ item.nick }}
        </div>
       </div>

       <div class="pointer" @click="clearAdmin(item)">
        <Icon icon="jinzhi-yin" style="color: var(--secondary-text);width: 20px;height: 20px;"></Icon>
       </div>

      </div>
     </vue-custom-scrollbar>

     <div class="flex justify-end">
      <a-button style="width: 100px; border-radius: 8px; height: 44px; background: var(--secondary-bg);color: var(--secondary-text);" @click="isMemeberShow = false">取消</a-button>
      <a-button type="primary" style="width: 100px;height: 44px;margin-left: 16px;border-radius: 8px;" @click="submit">确定</a-button>
     </div>

    </div>
  </div>
 </Modal>
</template>

<script>
import {computed, defineComponent, onMounted, reactive,toRefs} from 'vue'
import Modal from '../../../../../components/Modal.vue';
import _ from 'lodash-es'

export default defineComponent({
 props:['groupManageInfo','server'],
 
 components:{
  Modal
 },

 setup(props,ctx){
  const tim = props.server.TUICore.tim
  const TIM = props.server.TUICore.TIM

  const data = reactive({
   isMemeberShow:false,  // 显示邀请选中用户成为管理弹窗
   settingsScroller: {  // 滚动条配置 
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true
   },
   adminList:[], // 接收选中的群管理员数据
   adminData:[], // 接收群管理员数据
  })

  const inviteAdmin = () =>{ // 邀请用户成为管理员
   data.isMemeberShow = true
  }

  const selectAdmin = (item) =>{  // 选中管理员
   const index = _.findIndex(data.adminList,function(o){ return o.userID === item.userID})
   if(index === -1 && data.adminList.length < 1){
    data.adminList.push(item)
   }else{
    return;
   }
  }
 
  const  clearAdmin = (item) =>{  // 清除管理员
   const index = _.findIndex(data.adminList,function(o){ return o.userID === item.userID})
   data.adminList.splice(index,1)
  }

  const submit = async () =>{  // 添加管理员
   // const option = {
   //  groupID:props.groupManageInfo.groupID,
   //  userID:data.adminList[0].userID,
   //  role:TIM.TYPES.GRP_MBR_ROLE_ADMIN
   // }
 
   // await tim.setGroupMemberRole(option)
   // data.adminList = []
   // data.isMemeberShow = false
   // ctx.emit('close')
  }

  const deleteAdmin = async () =>{  // 取消管理员
   // data.isMemeberShow = true
   // const option = {
   //  groupID:props.groupManageInfo.groupID,
   //  userID:data.adminList[0]?.userID,
   //  role:TIM.TYPES.GRP_MBR_ROLE_MEMBER
   // }
   // console.log(option);
 
   // await tim.setGroupMemberRole(option)
   // data.adminList = []
   // data.isMemeberShow = false
   // ctx.emit('close')
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
 

  return{
   isAdminList,deleteAdmin,
   ...toRefs(data),inviteAdmin,selectAdmin,clearAdmin,submit,
  }
 },
})
</script>

<style lang="scss" scoped>
.font-14{
 font-family: PingFangSC-Regular;
 font-size: 14px;
 font-weight: 400;
}

.font-16{
 font-family: PingFangSC-Regular;
 font-size: 16px;
 font-weight: 400;
}

.font-12{
 font-family: PingFangSC-Regular;
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