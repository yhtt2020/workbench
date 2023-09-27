<template>
  <div class="flex" style="color: var(--primary-text);width: 650px;height: 534px;padding: 16px;">
    <div style="width:293px;">
     <vue-custom-scrollbar :settings="settingsScroller" style="height:100%; margin-bottom: 16px;">
      <div v-for="(item,index) in userList" class="flex pointer rounded-lg px-4 py-3" :class="{'select-bg':isSelected(index)}" style="margin-bottom: 16px;" @click="selectAdmin(item)">
       <div class="flex items-center">
        <a-avatar :size="32" :src="item.avatar"></a-avatar>
        <div class="font-16 flex items-center" style="color: var(--primary-text);margin-left: 16px;">
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
       <div class="flex items-center">
        <a-avatar :size="32" :src="item.avatar"></a-avatar>
        <div class="font-16 flex items-center" style="color: var(--primary-text);margin-left: 16px;">
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
import { defineComponent,reactive,toRefs,computed } from 'vue'
import _ from 'lodash-es'

export default defineComponent({
 props:['type','list','groupID','updateGroup'],

 setup (props,ctx) {
  const tim = window.$chat

  const data = reactive({
   settingsScroller: {  // 滚动条配置 
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true
   },
   adminList:[],
  })
 
  const selectAdmin = (item) =>{  // 选中指定群管理候选人
   const index = _.findIndex(data.adminList,function(o){ return o.userID === item.userID})
   if(index === -1 ){
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
      case 'remove':
        const keys = data.adminList.map((item)=>{return item.userID});
        const removeMemberOption = {
          groupID:props.groupID,
          userIDList:keys,
        }
        await tim.deleteGroupMember(removeMemberOption)
        props.updateGroup()
        ctx.emit('closeUser')
        break;
      case 'add':
        const userList = data.adminList.map((item)=>{return item.userID});
        const addOption = {
          groupID:props.groupID,
          userIDList:userList,
        }
        await tim.addGroupMember(addOption)
        props.updateGroup()
        ctx.emit('closeUser')
        break;
      default:
        break;
    }
  }


  const userList = computed(()=>{  // 通过计算属性将群主去掉,不作为群管理员的候选人
    const list = []
    for(let i=0;i<props.list.length;i++){
     if(props.list[i].role !== 'Owner'){
      list.push(props.list[i])
     }
    } 
    return list 
  })

  const cancel = () =>{  // 取消弹窗
    ctx.emit('closeUser')
  }

  const isSelected = (index) =>{
    return data.adminList.includes(userList.value[index])
  }


  return {
   userList,
   ...toRefs(data),cancel,selectAdmin,clearAdmin,submit,isSelected
  }
 }

})
</script>

<style lang="scss" scoped>
.select-bg{
  background: var(--active-secondary-bg) !important;
  border:1px solid var(--active-bg) !important;
}
</style>