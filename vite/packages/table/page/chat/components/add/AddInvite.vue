<template>
 <teleport to="body">
  <Modal v-model:visible="addVisible" v-if="addVisible" :blurFlag="true" style="z-index:10000 !important;">
    <div class="flex flex-col my-3" style="width: 500px ;height: 596px;">
     <ModalTop title="邀请其他人" @close="addVisible = false"/>

     
    </div>
  </Modal>
 </teleport>
</template>

<script>
import { Icon as NewIcon } from '@iconify/vue'

import Modal from '../../../../components/Modal.vue';
import ModalTop from '../ModalTop.vue';

export default {
 components:{
  NewIcon,Modal,ModalTop
 },

 props:['no'],

 data(){
  return{
   addVisible:false,
  }
 },

 methods:{
  openAddInvite(){
   this.addVisible = true
  },


 }



};
</script>

<style lang="scss" scoped>
</style>