<template>
  <div class="flex" style="color: var(--primary-text);width: 650px;height: 534px;padding: 16px;">
    <div style="width:293px;">
     <vue-custom-scrollbar :settings="settingsScroller" style="height:100%; margin-bottom: 16px;">
      <div v-for="item in userList" class="flex pointer"  style="margin-bottom: 16px;" @click="selectAdmin(item)">
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
      <a-button style="width: 100px; border-radius: 8px; height: 44px; background: var(--secondary-bg);color: var(--secondary-text);" @click="cancel">取消</a-button>
      <a-button type="primary" style="width: 100px;height: 44px;margin-left: 16px;border-radius: 8px;" @click="submit">确定</a-button>
     </div>

    </div>
   </div>
</template>

<script>
import { defineComponent,ref,reactive,toRefs, computed } from 'vue'
import _ from 'lodash-es'

export default defineComponent({
 props:['list','type','server','groupID'],

 setup(props,ctx){

  const TIM = props.server.TUICore.TIM
  const tim = props.server.TUICore.tim

  const data = reactive({
   settingsScroller: {  // 滚动条配置 
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true
   },
   adminList:[], // 接收选中用户数据
  })

  const userList = computed(()=>{  // 通过计算属性将群主去掉,不作为群管理员的候选人
    const list = []
    for(let i=0;i<props.list.length;i++){
     if(props.list[i].role !== 'Owner'){
      list.push(props.list[i])
     }
    } 
    return list 
  })

  const selectAdmin = (item) =>{  // 选中指定群管理候选人
   const index = _.findIndex(data.adminList,function(o){ return o.userID === item.userID})
   if(index === -1 && data.adminList.length < 1){
    data.adminList.push(item)
   }else{
    return;
   }
  }
 
  const  clearAdmin = (item) =>{  // 取消选中指定群管理候选人
   const index = _.findIndex(data.adminList,function(o){ return o.userID === item.userID})
   data.adminList.splice(index,1)
  }


  const submit = async () =>{
    switch (props.type) {
     case 'addAdmin':  // 添加管理员
       const adminOption = { 
        groupID:props.groupID,
        userID:data.adminList[0].userID,
        role:TIM.TYPES.GRP_MBR_ROLE_ADMIN
       } 
       await tim.setGroupMemberRole(adminOption)
       ctx.emit('close')
      break;
     case 'delAdmin':  // 删除管理员
       const option = { 
        groupID:props.groupID,
        userID:data.adminList[0].userID,
        role:TIM.TYPES.GRP_MBR_ROLE_MEMBER
       } 
       await tim.setGroupMemberRole(option)
       ctx.emit('close')
      break;
     case 'change':  // 转让群聊
       const options = {
        groupID:props.groupID,
        newOwnerID:data.adminList[0].userID,
       }
       await tim.changeGroupOwner(options)
       ctx.emit('close')
      break;
     case 'addmute':  // 新增禁言用户
       const muteOption = {
        groupID:props.groupID,
        muteTime:60 * 60 * 24 * 30,
        userID:data.adminList[0].userID
       }
       await tim.setGroupMemberMuteTime(muteOption);
       ctx.emit('close')
      break;
     case 'delmute':  // 取消禁言用户
       const mOption = {
        groupID:props.groupID,
        muteTime:0,
        userID:data.adminList[0].userID
       }
       await tim.setGroupMemberMuteTime(mOption);
       ctx.emit('close')
      break;
     default:
      break;
    }
  }


  const cancel = () =>{  // 取消弹窗
    ctx.emit('close')
  }

  return{
   userList,
   ...toRefs(data),selectAdmin,clearAdmin,submit,cancel
  }
 }
})
</script>

<style lang="scss" scoped>

</style>