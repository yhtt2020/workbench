<script lang="ts">
import {defineComponent} from 'vue'
import VueCustomScrollbar from "../../../../../src/components/vue-scrollbar.vue";

export default defineComponent({
  name: "Scrollbar",
  components: {VueCustomScrollbar},
  props: {
    x: {
      type: Boolean,
      default: false
    },
    y: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
     settings:{
       useBothWheelAxes: true,
       swipeEasing: true,
       suppressScrollY: true,
       suppressScrollX: false,
       wheelPropagation: true
     }
    }
  },
  mounted() {
    this.settings.suppressScrollY = this.x
    this.settings.suppressScrollX = this.y
  }
})
</script>

<template>
  <vue-custom-scrollbar style="position:relative;" :settings="settings"  >
    <slot></slot>
  </vue-custom-scrollbar>
</template>

<style scoped lang="scss">

</style>
