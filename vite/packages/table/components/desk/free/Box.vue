<template>
  <!-- <div class="box" :style="{ backgroundColor }" :role="role"> -->
  <!-- <test :data="data" :role="role"></test> -->
  <!-- <CPULineChart></CPULineChart> -->
  <component
    :desk="currentDesk"
    class="box"
    :style="{ backgroundColor }"
    :role="role"
    :is="data?.name"
    :customIndex="data?.id"
    :customData="data?.customData"
  ></component>
  <!-- </div> -->
</template>

<script>
import CPULineChart from "../../widgets/supervisory/CPULineChart.vue";
import CPUFourCard from "../../widgets/supervisory/CPUFourCard.vue";
import InternalList from "../../widgets/supervisory/InternalList.vue";
import SmallCPUCard from "../../widgets/supervisory/SmallCPUCard.vue";
import SmallGPUCard from "../../widgets/supervisory/SmallGPUCard.vue";
import MyIcons from "../../widgets/myIcons/index.vue";

export default {
  components: {
    CPULineChart,
    CPUFourCard,
    InternalList,
    SmallCPUCard,
    SmallGPUCard,
    MyIcons,
  },
  props: {
    yellow: {
      type: Boolean,
      default: false,
    },
    preview: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
    },
    currentDesk: {},
  },
  computed: {
    backgroundColor() {
      return this.yellow ? "yellow" : "";
    },
    role() {
      return this.preview ? "BoxPreview" : "Box";
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  border: 1px dashed gray;
  border: 31px dashed red;
  cursor: move;
  padding: 1em;
  min-height: 100%;
  min-width: 100%;
}
</style>
