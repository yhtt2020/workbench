<template>


  <div class="line-title  ">界面缩放</div>
  <ZoomUI></ZoomUI>
</template>

<script>
import ZoomUI from '../../components/comp/ZoomUI.vue'

export default {
  name: 'Common',
  components: { ZoomUI },
}
</script>

<style scoped>
.unfit {
  color: orangered
}
</style>
