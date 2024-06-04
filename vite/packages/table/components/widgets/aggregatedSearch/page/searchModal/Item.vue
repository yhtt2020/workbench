<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  data: {},
  index: {},
  select: {},
});
const currentIndex = ref(props.index);
watch(
  () => props.index,
  (val) => {
    currentIndex.value = val;
  }
);
</script>

<template>
  <div
    class="w-full flex items-center h-11 p-2.5 cursor-pointer rounded-xl hover:tt-theme-bg-2 mb-1"
    :class="{
      'xt-theme-bg-2': select,
    }"
  >
    <xt-mix-icon :icon="data.icon" type="select" size="24" class="mr-2.5" />
    <div class="mr-2.5">{{ data?.name }}</div>
    <div class="flex-1 truncate text-sm tt-text-2">
      {{ data?.text }}
    </div>
    <div class="ml-1 text-xs tt-text-3">
      <slot name="type">
        {{ data?.type }}
      </slot>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
