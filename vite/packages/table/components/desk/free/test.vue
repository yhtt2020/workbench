<template>
  <component
    :is="data?.name"
    :customIndex="data?.id"
    :customData="data?.customData"
  ></component>
  <xt-button></xt-button>
  <!-- <Widget> 123 </Widget> -->
  <!-- <CPULineChart></CPULineChart> -->
</template>

<script>
import Widget from "../../card/Widget.vue";

import CPULineChart from "../../widgets/supervisory/CPULineChart.vue";
import CPUFourCard from "../../widgets/supervisory/CPUFourCard.vue";
import InternalList from "../../widgets/supervisory/InternalList.vue";
import SmallCPUCard from "../../widgets/supervisory/SmallCPUCard.vue";
import SmallGPUCard from "../../widgets/supervisory/SmallGPUCard.vue";
import componentsMinis from "../components";

export default {
  // mixins: [componentsMinis],
  props: {
    data: {},
  },
  components: {
    CPULineChart,
  },
};
</script>

<style lang="scss" scoped></style>
