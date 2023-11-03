<template>
 <teleport to='body'>
  <Modal v-if="settingVisible" v-model:visible="settingVisible" :blurFlag="true">
     
  </Modal>
 </teleport>
</template>

<script>

import Modal from '../../../Modal.vue';

export default {
 components:{
  Modal
 },

 data(){
  return{
   settingVisible:false,
  }
 },

 methods:{
  openSettingModal(){
   this.settingVisible = true
  }
 }
};
</script>

<style lang="scss" scoped>
</style>