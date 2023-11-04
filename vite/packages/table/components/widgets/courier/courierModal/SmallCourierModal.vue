<template>
  <teleport to='body'>
    <Modal v-if="courierShow" v-model:visible="courierShow" :blurFlag="true">
      <!-- {{ list }} -->
      <SmallCourierDetail :list="list" @close="handleClose" />
    </Modal>
  </teleport>
</template>
 
<script>
import { courierDetailList } from './modalMock'
import { courierStore } from '../../../../store/courier.ts'
import {mapActions,mapWritableState} from 'pinia'
import Modal from '../../../Modal.vue';
import SmallCourierDetail from './content/SmallCourierDetail.vue';

export default {
  components: {
    Modal, SmallCourierDetail
  },

  data() {
    return {
      // courierShow: true,
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
    ...mapWritableState(courierStore, ['couriersDetailMsg','courierDetailList']),
    courierShow(){
      return this.show
    }
  },
  async mounted() {
    this.getDbCourier()
    this.list = await this.courierDetailList
    console.log(this.list,'this.list');
  }
}
</script>
 
<style lang="scss" scoped></style>