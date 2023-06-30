<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "RayMedal",
  props: {
    src: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 60
    }
  }
})
</script>

<template>
  <div :style="{width:size+'px',height:size+'px'}" style="position: relative;display: inline-block">
    <img class="spin" src="/img/rays.png" style="width: 100%">
    <img style="width: 100%;position: absolute;transform: scale(50%);left: 0;top:-3%" :src="src">
  </div>
</template>

<style scoped lang="scss">
.spin{
  animation: spin 5s linear infinite
}
</style>
