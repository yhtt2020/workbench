<template>
  <teleport to='body'>
    <Modal v-model:visible="largeShow" v-if="largeShow" :blurFlag="true" style="z-index:400;">
      <LargeCourierDetail :route="detailRoute" @change-route="changeRoute" :mode="mode" @close="handleClose"/>
    </Modal>
  </teleport>
</template>

<script>
import Modal from '../../../Modal.vue'
import LargeCourierDetail from './content/LargeCourierDetail.vue'

export default {
  components: {
    Modal, LargeCourierDetail
  },

  data () {
    return {
      largeShow: true,
      detailRoute: 'list'
    }
  },

  methods: {
    openLargeCourier () {
      this.largeShow = true
    },
    handleClose () {
      this.$emit('close-modal', false)
    },
    changeRoute (route) {
      console.log('切换的路由', route)
      this.detailRoute = route
    }
  },
  mounted () {
    this.detailRoute = this.route
  },
  props: {
    show: Boolean,
    mode: {
      type: String,
      default: 'large'
    },
    route: {
      type: String,
      default: 'list'
    }
  },
  computed: {
    largeShow () {
      return this.show
    }
  }

}
</script>

<style lang="scss" scoped>
</style>
