<!-- 添加控制中心页面 -->
<template>
  <!-- 判断是否已经添加数据,如果有显示分割线,没有就隐藏 -->
  <div class="my-4 pr-4" style="width: 100%" v-if="controlList.length !== 0">
    <div class="w-full mx-auto xt-bb"></div>
  </div>

  <!-- 添加控制中心的数据 -->
  <div v-if="controlList.length !== 0">
    <Vuuri
      v-model="controlList"
      group-id="id"
      item-key="id"
      :options="option"
      ref="addControlRef"
      :drag-enabled="false"
      :get-item-height="getHeight"
    >
      <template #item="{ item }">
        <AddControlDetail :controlIndex="item.id" :controlItem="item" />
      </template>
    </Vuuri>
  </div>
</template>

<script setup>
import { ref,computed } from "vue";
import { storeToRefs } from "pinia";
import { controlStore } from "../../../hooks/controlStore";

import Vuuri from "../../../../../components/vuuri/Vuuri.vue";
import AddControlDetail from "./AddControlDetail.vue";

const control = controlStore();
const { currentAdd } = storeToRefs(control);

const option = ref({
  layout: { horizontal: false },
});
// 获取高度
const getHeight = () => {
  return 120 + "px";
};

// 过滤控制中心列表在web端显示
const controlList = computed(() => {
  if (window.$usePlat('client')) return currentAdd.value;
  const arr = [
    "window-control",
    "assist-mode",
    "audio",
    "energy-save-mode",
    "shake",
  ];
  let filterList = currentAdd.value.filter(
    (item) => !arr.includes(item.id)
  );
  return filterList;
});

</script>

<style lang="scss" scoped>
:deep(.grid) {
  position: relative;
  width: 18em;
  display: inline-block;
  border: 5px solid transparent;
  border-radius: 8px;
  vertical-align: top;
}
:deep(.muuri-grid) {
  background: transparent !important;
  min-height: 400px !important;
}
:deep(.muuri-item-content) {
  background: transparent !important;
}
:deep(.muuri-item) {
  width: auto !important;
  margin: 0 12px 12px 0 !important;
}
</style>
