<template>
 <teleport to='body'>
  <Modal v-model:visible="largeShow" v-if="largeShow" :blurFlag="true" style="z-index:400;">
    <LargeCourierDetail @close="handleClose" />
  </Modal>
 </teleport>
</template>

<script>
import Modal from '../../../Modal.vue';
import LargeCourierDetail from './content/LargeCourierDetail.vue';

export default {
 components:{
  Modal,LargeCourierDetail
 },

 data() {
  return {
   largeShow:true,
  };
 },

 methods:{
   openLargeCourier(){
    this.largeShow = true
   },
   handleClose(){
    this.$emit('close-modal',false)
   }
 },
 props:{
  show:Boolean
 },
 computed:{
  largeShow(){
    return this.show
  }
 }

}
</script>

<style lang="scss" scoped>
</style>