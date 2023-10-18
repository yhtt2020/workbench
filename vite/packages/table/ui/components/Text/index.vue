<template>
  <div
    class="w-full flex justify-between items-center relative"
    :class="[textClass]"
  >
    <div class="flex items-center">
      <slot></slot>
    </div>
    <div class="flex-1 w-0  text-center">
      <slot name="center"> {{ title }}</slot>
    </div>
    <div>
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  type: {
    default: 1,
  },
  title: {
    default: "",
  },
});

const textClass = computed(() => {
  const types = {
    1: "xt-text text-base",
    2: "xt-text-2 text-sm",
  };
  types[props.type];
  return types[props.type];
});
</script>

<style lang="scss" scoped></style>
