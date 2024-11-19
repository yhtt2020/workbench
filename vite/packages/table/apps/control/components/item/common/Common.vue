<!-- 在没有编辑情况的控制中心列表页 -->
<template>
  <div class="flex mt-3 h-full w-full">
    <XtScrollbar :y="true" style="height: 100%; width: 100%">
      <Vuuri
        v-model="controlList"
        group-id="id"
        item-key="id"
        :options="option"
        :drag-enabled="false"
        :get-item-height="getHeight"
      >
        <template #item="{ item }">
          <CommonDetail
            class="tt-container-box-1234"
            :controlIndex="item.id"
            :controlItem="item"
          />
        </template>
      </Vuuri>
    </XtScrollbar>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { controlStore } from "../../../hooks/controlStore";

import Vuuri from "../../../../../components/vuuri/Vuuri.vue";
import CommonDetail from "./CommonDetail.vue";

const control = controlStore();
const { currentControlList } = storeToRefs(control);

// 配置项
const option = ref({
  layout: { horizontal: false },
});

// 获取高度
const getHeight = () => {
  return 120 + "px";
};

// 过滤控制中心列表在web端显示
const controlList = computed(() => {
  // console.log('测试',currentControlList.value);
  if (window.$usePlat('client')) return currentControlList.value;
  const arr = [
    "window-control",
    "assist-mode",
    "audio",
    "energy-save-mode",
    "shake",
    "window-size-position",
  ];
  let filterList = currentControlList.value.filter(
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
  height: 400px !important;
}

:deep(.muuri-item-content) {
  background: transparent !important;
}

:deep(.muuri-item) {
  width: auto !important;
  margin: 0 12px 12px 0 !important;
}

:deep(.ps__rail-y){
  display: none !important;
}
</style>
