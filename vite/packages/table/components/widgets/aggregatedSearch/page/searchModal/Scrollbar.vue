<script setup>
import { ref, inject, onMounted, onBeforeUnmount, watch } from "vue";
import PerfectScrollbar from "perfect-scrollbar";

const ctrlSelectIndex = inject("ctrlSelectIndex");

const scrollbar = ref(null);
const searchScrollbar = ref(null);

watch(ctrlSelectIndex, (val, oldVal) => {
  if (Math.abs(val - oldVal) > 1) {
    searchScrollbar.value.scrollTop = val * 48;
  } else if (val > 3) {
    searchScrollbar.value.scrollTop += 48;
  } else if (val < 3) {
    searchScrollbar.value.scrollTop = 0;
  }
});
const initScrollbar = () => {
  scrollbar.value = new PerfectScrollbar(searchScrollbar.value, {});
};
onMounted(() => {
  initScrollbar();
});

onBeforeUnmount(() => {
  scrollbar.value?.destroy();
  scrollbar.value = null;
});
</script>

<template>
  <div class="flex-1 w-full overflow-hidden relative" ref="searchScrollbar">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped></style>
