<script setup>
import { ref, inject, onMounted, onBeforeUnmount, watch } from "vue";
import PerfectScrollbar from "perfect-scrollbar";

const ctrlSelectIndex = inject("ctrlSelectIndex");

const scrollbar = ref(null);
const searchScrollbar= ref(null);

watch(ctrlSelectIndex, (val) => {
  searchScrollbar.value.scrollTop = ctrlSelectIndex.value * 44;
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
  <div
    class="flex-1 w-full overflow-hidden relative p-3 h-[500px]"
    ref="searchScrollbar"
  >
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped></style>
