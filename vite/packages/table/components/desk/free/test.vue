<template>
  {{data}}
  <component

    :is="data?.name"
    :customIndex="data?.id"
    :customData="data?.customData"
  ></component>
</template>

<script setup>
import Widget from "../../card/Widget.vue";

import CPULineChart from "../../widgets/supervisory/CPULineChart.vue";
import CPUFourCard from "../../widgets/supervisory/CPUFourCard.vue";
import InternalList from "../../widgets/supervisory/InternalList.vue";
import SmallCPUCard from "../../widgets/supervisory/SmallCPUCard.vue";
import SmallGPUCard from "../../widgets/supervisory/SmallGPUCard.vue";

const props = defineProps({
  data: {},
});
</script>

<style lang="scss" scoped></style>
