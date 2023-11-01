<template>
  <teleport to='body'>
    <Modal v-if="courierShow" v-model:visible="courierShow" :blurFlag="true">
      <SmallCourierDetail :list="list" @close="handleClose" />
    </Modal>
  </teleport>
</template>
 
<script>
import { courierDetailList } from './modalMock'

import Modal from '../../../Modal.vue';
import SmallCourierDetail from './content/SmallCourierDetail.vue';

export default {
  components: {
    Modal, SmallCourierDetail
  },

  data() {
    return {
      // courierShow: true,
      list: courierDetailList,
    }
  },
  props: {
    show: Boolean
  },
  methods: {
    openSmallCourierDetail() {
      this.courierShow = true
    },
    handleClose(){
     let closeModal=false
     this.$emit('close-modal',closeModal)
   }

  },
  computed:{
    courierShow(){
      return this.show
    }
  }
}
</script>
 
<style lang="scss" scoped></style>