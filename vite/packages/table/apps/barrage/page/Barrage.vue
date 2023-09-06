<script lang="ts">
import {defineComponent} from 'vue'
import BarragePanel from "../../../components/comp/BarragePanel.vue";
import BarrageSetting from "../../../page/settings/BarrageSetting.vue";

export default defineComponent({
  name: "Barrage",
  components: {BarrageSetting, BarragePanel}
})
</script>

<template>

  <div class="xt-text" style="width:800px;margin:auto;height: 100%">
    <a-row :gutter="10" style="height: 100%">
      <a-col style="height: 100%" :span="12" class="">
        <BarragePanel></BarragePanel>
      </a-col>
      <a-col :span="1">
        <div style="border-right: 1px solid var(--secondary-text);height:calc(100% - 40px);opacity: 0.5;width: 0;margin: auto;margin-top: 20px"></div>
      </a-col>
      <a-col :span="11" class="pt-2 pl-2">
        <BarrageSetting></BarrageSetting>
      </a-col>
    </a-row>

  </div>

</template>

<style scoped lang="scss">

</style>
