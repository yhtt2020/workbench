<template>
  <div class="box" :style="{ backgroundColor }" :role="role">
    <!-- <test :data="data" :role="role"></test> -->
    <!-- <CPULineChart></CPULineChart> -->
    {{ data.name }}
    <!-- <component
    :is="data?.name"
    :customIndex="data?.id"
    :customData="data?.customData"
  ></component> -->
  </div>
</template>

<script>
import test from "./test.vue";
import CPULineChart from "../../widgets/supervisory/CPULineChart.vue";
import CPUFourCard from "../../widgets/supervisory/CPUFourCard.vue";
import InternalList from "../../widgets/supervisory/InternalList.vue";
import SmallCPUCard from "../../widgets/supervisory/SmallCPUCard.vue";
import SmallGPUCard from "../../widgets/supervisory/SmallGPUCard.vue";
export default {
  components: {
    CPULineChart,
    CPUFourCard,
    InternalList,
    SmallCPUCard,
    SmallGPUCard,
    test,
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
      required: true,
    },
  },
  computed: {
    backgroundColor() {
      return this.yellow ? "yellow" : "white";
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
  cursor: move;
  padding: 1em;
  min-height: 100%;
  min-width: 100%;
}
</style>
