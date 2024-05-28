<script setup lang="ts">
import { ref, computed, inject } from "vue";
import { openBrowser } from "../../utils/open";
import Scrollbar from "./Scrollbar.vue";
const data: any = inject("data");
const ctrlSelectIndex: any = inject("ctrlSelectIndex");
const currentOpenWith = inject("currentOpenWith");

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
  <div class="flex justify-between p-3">
    <div class="text-sm tt-text-2">最近</div>
    <xt-mix-icon
      size="20"
      icon="fluent:dismiss-circle-16-filled"
      @click="clear"
    />
  </div>

  <Scrollbar>
    <div
      v-for="(item, index) in data.historyList"
      @click="search(index)"
      class="text-sm p-3 w-full h-12 rounded-lg flex items-center justify-between hover:tt-theme-bg-2"
      :class="{
        'xt-theme-bg-2': index == historyIndex,
      }"
    >
      <div>{{ item.name }}</div>
      <a-dropdown
        placements="bottom"
        :overlayStyle="{
          'z-index': '999999999 !important',
        }"
      >
        <div class="flex items-center">
          <template v-if="historyIndex == index">
            <span class="tt-theme"> {{ currentOpenWith?.name }}</span>
            <xt-mix-icon
              icon="fluent:caret-down-12-filled"
              class="tt-no-bg ml-2"
              iconStyle="color: var(--active-bg)"
            />
          </template>
          <template v-else>
            <div class="tt-text-3">网页</div>
          </template>
        </div>
      </a-dropdown>
    </div>
  </Scrollbar>
</template>
<style lang="scss" scoped></style>
