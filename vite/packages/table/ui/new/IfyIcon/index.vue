<template>
  <div class="flex justify-center items-center" :style="iconSize">
    <myIcon :icon="icon" :style="iconSize" />
  </div>
</template>

<script setup>
import { Icon as myIcon } from "@iconify/vue";
import { computed } from "vue";
const props = defineProps({
  icon: {
    type: String,
    default: "majesticons:monitor-line",
  },
  size: {
    default: 20,
  },
});

const iconSize = computed(() => {
  let num = parseInt(props.size) + 5;
  return {
    width: num + "px !important",
    height: num + "px !important",
  };
});
</script>

<style lang="scss" scoped></style>
