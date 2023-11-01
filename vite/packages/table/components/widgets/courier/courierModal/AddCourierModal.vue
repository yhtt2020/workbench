<template>
  <teleport to="body">
    <Modal v-model:visible="courierShow" v-if="courierShow" :blurFlag="true">
      <ModalContent @close="courierShow = false"></ModalContent>
    </Modal>
  </teleport>
</template>

<script>

import Modal from '../../Modal.vue';
import ModalContent from './content/AddContent.vue';

export default {
 components:{
  Modal,
  ModalContent,
 },

 data(){
   return{
    courierShow:false,
   }
 },

 methods:{
  /**
   * 这里需要在使用组件时绑定一个ref属性来触发此方法 
   * 例如: ref="xxx",使用this.$refs.xxx.来调用此方法
   * **/
  openCourierModel(){
   this.courierShow = true
  },
  
 },
}
</script>

<style lang="scss" scoped>
</style>