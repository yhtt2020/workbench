<template>
 <a-dropdown :trigger="['click']" placement="bottomLeft" :overlayStyle="{ zIndex:'10000 !important'}">
  <div class="flex pointer items-center justify-center">
   <DorpIcon icon="fluent:more-horizontal-16-filled" style="font-size: 1.5rem;"></DorpIcon>
  </div>


  <template #overlay>
   <a-menu class="custom-dropdown-menu flex-col flex items-center justify-center" style="background: var(--secondary-bg);">
     <template v-for="(item,index) in dropDownList">
       
       <a-menu-item v-if=" index <  dropDownList.length - 2 " style="color: var(--secondary-text);width:184px;margin-bottom: 8px;" class="rounded-lg flex items-center h-11 drop-item"
       @click="selectMenuItem(item,index)">
         <DorpIcon :icon="item.icon" style="font-size: 1.25rem;"/>
         <span class="pl-4 font-16" style="color:var(--primary-text);"> {{ item.title }}</span>
       </a-menu-item>
       
       <a-divider v-if="index ===  dropDownList.length - 2 && dropDownList.length === 5" style="height: 1px; margin: 0 0 8px 0;  background-color: var(--divider);"></a-divider>
       
       <a-menu-item v-if=" index >= dropDownList.length - 2 "  style="color: var(--secondary-text);width:184px;margin-bottom: 8px;" class="rounded-lg flex items-center h-11 drop-item"
         @click="selectMenuItem(item,index)">
         <DorpIcon :icon="item.icon" style="font-size: 1.25rem;"/>
         <span class="pl-4 font-16" :style="item.type === 'deletePacket' ? { color:'var(--error)' } : { color:'var(--primary-text)' }"> {{ item.title }}</span>
       </a-menu-item>
     </template>
   </a-menu>
  </template>
 </a-dropdown>


 <teleport to='body' >
  <Modal v-if="categoryShow" v-model:visible="categoryShow" :blurFlag="true" style="z-index:1000 !important;">
    <MenuCategory v-if="type === 'apply' " :no="no" @close="categoryShow = false"></MenuCategory>
    <CreateNewCategory v-if="type === 'category'" :no="no" @close="categoryShow = false"></CreateNewCategory>
    <InviteOther v-if="type === 'invited'" :no="no" @close="categoryShow = false"></InviteOther>
    <PacketSetting :no="no" v-if="type === 'packetSet'" :item="data" @close="categoryShow = false"></PacketSetting>
    <AddLeftChildChannel :no="no" v-if="type === 'addNewApp'" :id="data.id" @close="categoryShow = false"></AddLeftChildChannel>
   </Modal>
 </teleport>

</template>

<script>
import { defineComponent, reactive, toRefs,watchEffect} from 'vue'
import { chatStore } from '../../../../store/chat'
import { Icon as DorpIcon } from '@iconify/vue'
import { communityStore } from '../../store/communityStore'
import { message,Modal as DownModal } from 'ant-design-vue'

import Modal from '../../../../components/Modal.vue'
import CreateNewCategory from '../CreateNewCategory.vue'
import MenuCategory from '../MenusCategory.vue'
import InviteOther from '../InviteOthers.vue'
import PacketSetting from '../knownCategory/PacketSettings.vue'
import AddLeftChildChannel from '../AddLeftChildChannel.vue'

export default defineComponent({
 components:{
  DorpIcon,Modal,CreateNewCategory,MenuCategory,InviteOther,
  PacketSetting,AddLeftChildChannel
 },

 props:['list','no','data','id'],

 setup (props,ctx) {

  const chat = chatStore()
  const community = communityStore()

  const data = reactive({
   dropDownList:[],
   // dropDownIndex:-1,
   type:'',
   categoryShow:false,
  })

  watchEffect(()=>{
    data.dropDownList = props.list
  })

  const selectMenuItem = async (item,index) =>{
   // data.dropDownIndex = index;
   data.type = item.type;
   switch (item.type) {
    case 'change':
      chat.setDouble()
     //  console.log('测试',11)
      ctx.emit('updatePage')
      break;
    case 'show':
      chat.setFloatVisible(false)
      break;
    case 'hidden':
      chat.setFloatVisible(true)
      break;
    case 'apply':
      setTimeout(()=>{
        data.categoryShow = true
      },350)
      break;
    case 'category':
      setTimeout(()=>{
        data.categoryShow = true
      },350)
     break;
    case 'invited':
      setTimeout(()=>{
       data.categoryShow = true
      },350)
     break;
    case 'deletePacket':
     DownModal.confirm({
       content:'删除分类操作不可撤销，分类被删除后，子应用将被移动到顶层。是否确定删除？',
       centered:true,
       onOk: async ()=>{
         const res = await community.removeCategory(props.data.id)
         if(res?.status === 1){
          await community.getChannelList(props.no)
          await community.getCategoryData(props.no)
          message.success(`${res.info}`)
         }
       }
     })
     

     break;
    case 'packetSet':
     setTimeout(()=>{
       data.categoryShow = true
       console.log('获取data',props.data)
     },350)
     break;
    case 'addNewApp':
     setTimeout(()=>{
       data.categoryShow = true
     },350)
     break;
   }
 
  }

  return {
   ...toRefs(data),selectMenuItem,
  }
 }
})
</script>

<style lang="scss" scoped>
.custom-dropdown-menu{
 border-radius: 10px !important;
 background-color:var(--secondary-bg) !important;
 box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.5);
 width: 200px;
 padding: 8px 0;
}

:deep(.select){
 background: var(--active-secondary-bg);
 color: var(--active-text) !important;
}

:deep(.drop-item){
  &:last-of-type{
   margin-bottom:0 !important;
  }
}

:deep(.ant-dropdown-menu-title-content){
 display:flex;
 align-items:center;

}

.font-16{
 font-family: PingFangSC-Regular;
 font-size: 16px;
 font-weight: 400;
}


:deep(.ant-dropdown-menu-item){
 &:hover{
   background-color: var(--active-secondary-bg) !important;
 }
}

:deep(.ant-divider-horizontal){
 min-width:78% !important;
 width:78% !important;
}
</style>
