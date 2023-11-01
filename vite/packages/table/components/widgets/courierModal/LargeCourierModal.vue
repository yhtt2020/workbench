<template>
 <teleport to='body'>
  <Modal v-model:visible="largeShow" v-if="largeShow" :blurFlag="true">
    <LargeCourierDetail @close="largeShow = false" />
  </Modal>
 </teleport>
</template>

<script>
import Modal from '../../Modal.vue';
import LargeCourierDetail from './content/LargeCourierDetail.vue';

export default {
 components:{
  Modal,LargeCourierDetail
 },

 data() {
  return {
   largeShow:false,
  };
 },

 methods:{
   openLargeCourier(){
    this.largeShow = true
   }
 }

}
</script>

<style lang="scss" scoped>
</style>