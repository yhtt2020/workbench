<template>
  <teleport to='body'>
    <Modal v-if="courierShow" v-model:visible="courierShow" :blurFlag="true" style="z-index:400;">
      <SmallCourierDetail @close="handleClose" />
    </Modal>
  </teleport>
</template>
 
<script>
import { courierStore } from '../../../../store/courier'
import {mapActions,mapWritableState} from 'pinia'
import Modal from '../../../Modal.vue';
import SmallCourierDetail from './content/SmallCourierDetail.vue';

export default {
  components: {
    Modal, SmallCourierDetail
  },

  data() {
    return {
      courierShow: false,
      list: [],
    }
  },
  props: {
    show: Boolean
  },
  methods: {
    ...mapActions(courierStore,['getDbCourier']),
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
  },
  async mounted() {
    this.getDbCourier()
  }
}
</script>
 
<style lang="scss" scoped></style>