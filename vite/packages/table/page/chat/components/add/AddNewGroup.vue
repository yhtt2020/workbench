<template>
 <teleport to='body' >
  <Modal v-model:visible="addVisible" v-if="addVisible" :blurFlag="true" style="z-index:200 !important;">
   <div class="flex flex-col justify-between my-3" style="width:500px;height:208px;">
    <ModalTop title="添加分组" @close="addVisible = false"/>

    <div class="flex flex-col px-6">
     <a-input placeholder="分组名称" v-model:value="categoryName" class="h-10 search" 
     style="border-radius: 8px;text-align: center;" @pressEnter="createCategory" />

     <div class="mt-4 flex items-center justify-end pt-4">
      <xt-button w="64" h="40" class="mr-3 category-button" @click="addVisible = false">取消</xt-button>
      <xt-button w="64" h="40" type="theme" @click="createCategory">确定</xt-button>
     </div>
    </div>
   </div>
  </Modal> 
 </teleport>
</template>

<script>
import { Icon as AddIcon } from '@iconify/vue'
import { mapActions,mapWritableState } from 'pinia'
import { communityStore } from '../../store/communityStore'
import { message } from 'ant-design-vue'

import Modal from '../../../../components/Modal.vue';
import ModalTop from '../ModalTop.vue'


export default {
 components:{
  Modal,AddIcon,ModalTop
 },

 props:['no'],

 data(){
  return{
   addVisible:false,
   categoryName:'',
  }
 },

 methods:{
  ...mapActions(communityStore,['createChannel']),
  // 开启弹窗
  openAddModal(){
   this.addVisible  = true
   this.$nextTick(()=>{
    const inputDom = document.querySelector('.search')
    inputDom.focus()
   })
  },

  // 创建
  async createCategory(){
   if(this.categoryName !== '' && this.no !== '1'){
    const option = {
      name:this.categoryName,
      communityNo:this.no,
      type:'category',
      role:'category',
    }
    const res = await this.createChannel(option,this.no)
    if(res.status === 1){
      message.success(`${res.info}`) ;
      this.addVisible = false   
      this.categoryName = ''
    }
   }else{
    message.success('添加分组的参数不能缺少')
   }
  }
 }
};
</script>

<style lang="scss" scoped>
:deep(.ant-input){
 color: var(--secondary-text) !important;
 font-size:0.9rem;
 &::placeholder{
   color: var(--secondary-text) !important;
 }
}
</style>