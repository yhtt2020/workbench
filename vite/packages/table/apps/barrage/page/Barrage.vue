<script lang="ts">
import {defineComponent} from 'vue'
import BarragePanel from "../../../components/comp/BarragePanel.vue";

export default defineComponent({
  name: "Barrage",
  components: {BarragePanel}
})
</script>

<template>
  <div class="xt-bg xt-text" style="width:400px;margin:auto;height: 100%">
    <BarragePanel   ></BarragePanel>
  </div>

</template>

<style scoped lang="scss">

</style>
