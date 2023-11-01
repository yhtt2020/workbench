<template>
 <div class="flex flex-col rounded-md p-2 dropdown-container" :style="`top: ${position.y}px; left: ${position.x}px`">
  <div class="p-3 pointer dropdown-item rounded-md flex items-center " v-for="item in list" @click.stop="selectItem(item)">
   <DropIcon :icon="item.icon" style="font-size: 1.25rem;"></DropIcon>
   <span class="pl-3 font-16 font-400" :style="item.type === 'deletePacket' || item.type === 'deleteApp' ? {color:'var(--error)'} :{color:'var(--primary-text)'}">{{ item.title }}</span>
  </div> 
 </div>
 

 <teleport to='body' >
  <Modal v-if="menuDropShow" v-model:visible="menuDropShow" :blurFlag="true" style="z-index:1000 !important;">
    <PacketSetting v-if="type === 'packetSet'" :item="item" :no="no" @close="menuDropShow = false" ></PacketSetting>
    <AddLeftChildChannel v-if="type === 'addNewApp'" :id="id" :no="no" @close="menuDropShow = false"></AddLeftChildChannel>
    <LinkSetting v-if="type === 'linkSet'" :item="item" :no="no" :id="id" @close="menuDropShow = false"/>
  </Modal>
 </teleport>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia'
import { Icon as DropIcon } from '@iconify/vue'
import { message,Modal as DropModal } from 'ant-design-vue'
import { communityStore } from '../../store/communityStore'

import PacketSetting from '../knownCategory/PacketSettings.vue'
import Modal from '../../../../components/Modal.vue'
import AddLeftChildChannel from '../AddLeftChildChannel.vue'
import LinkSetting from '../knownCategory/LinkSetting.vue'


export default {
 props:['list','id','no','position','item'],

 components:{
  DropIcon,PacketSetting,Modal,AddLeftChildChannel,LinkSetting
 },

 data(){
  return{
    menuDropShow:false,
    type:'',
  }
 },

 methods:{
  ...mapActions(communityStore,['removeCategory','getCategoryData','getChannelList']),

  selectItem(item){
   this.type = item.type
   switch (item.type) {
    case 'packetSet':
     this.menuDropShow = true
     break;
    case 'linkSet':
     this.menuDropShow = true
     break;
    case 'deleteApp':
     //  console.log('获取id::>>',this.id);
     DropModal.confirm({
      content:'删除应用操作不可撤销,是否确定删除？',
      centered:true,
      onOk: async ()=>{
        const result = await this.removeCategory(this.id)
        // console.log('返回结果',result);
        if(result?.status === 1){
          // console.log('查看社群号',this.no);
          await this.getChannelList(this.no)
          await this.getCategoryData(this.no)
        }
      }
     })
     break;
    case 'deletePacket':
     //  console.log('查看id',this.id);
     DropModal.confirm({
      content:'删除分类操作不可撤销，分类被删除后，子应用将被移动到顶层。是否确定删除？',
      centered:true,
      onOk: async ()=>{
        const result = await this.removeCategory(this.id)
        if(result?.status === 1){
          message.success(`${result.info}`)
          await this.getChannelList(this.no)
          await this.getCategoryData(this.no)
        }
      }
     })
     break;
    case 'addNewApp':
      this.menuDropShow = true
      break;
   } 


  }
 }
}
</script>

<style lang="scss" scoped>
.dropdown{
 &-container{
  width:200px;
  background: var(--secondary-bg);
  position: fixed;
  z-index: 1000;
 }
 &-item{
  &:hover{
   background: var(--active-secondary-bg);
  }
 }
}
</style>