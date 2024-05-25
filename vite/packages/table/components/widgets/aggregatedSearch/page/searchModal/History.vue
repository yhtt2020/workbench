<script setup lang="ts">
import { ref, computed, inject } from "vue";
import { openBrowser } from "../../utils/open";
const data: any = inject("data");
const ctrlSelectIndex: any = inject("ctrlSelectIndex");
const emit = defineEmits(["update:ctrlSelectIndex"]);
const clear = () => {
  data.value.historyList = [];
};
ctrlSelectIndex.value = 0;

const historyIndex = computed(() => {
  let index = ctrlSelectIndex.value;
  if (index < 0) {
    index = data.value.historyList.length - 1;
  }
  if (index > data.value.historyList.length - 1) {
    index = 0;
  }
  ctrlSelectIndex.value = index;

  return index;
});
const search = (index: string) => {
  let item = data.value.historyList[index];
  openBrowser(item.value, item.openWith);
};
defineExpose({
  clear,
  search,
});
</script>

<template>
  <div class="flex justify-between pb-3">
    <div class="text-sm tt-text-2">最近</div>
    <xt-mix-icon
      size="20"
      icon="fluent:dismiss-circle-16-filled"
      @click="clear"
    />
  </div>

  <div
    v-for="(item, index) in data.historyList"
    @click="search(index)"
    class="text-sm p-2 w-full h-12 rounded-lg flex items-center justify-between hover:tt-theme-bg-2"
    :class="{
      'xt-theme-bg-2': index == historyIndex,
    }"
  >
    <div class="flex items-center">
      <xt-mix-icon
        size="24"
        class="mr-3"
        :icon="item.source.icon"
        type="select"
      />
      {{ item.name }}
    </div>
    <div>{{ item.type }}</div>
  </div>
</template>
<style lang="scss" scoped></style>
