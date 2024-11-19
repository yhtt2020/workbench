<!-- 控制中心删除页 -->
<template>
  <div class="mt-3">
    <Vuuri
      v-model="controlList"
      group-id="id"
      item-key="id"
      :options="option"
      ref="removeControlRef"
      :drag-enabled="true"
      :get-item-height="getHeight"
    >
      <template #item="{ item }">
        <RemoveControlDetail :controlIndex="item.id" :controlItem="item" :isClick="clickVisible"/>
      </template>
    </Vuuri>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { controlStore } from "../../../hooks/controlStore";

import Vuuri from "../../../../../components/vuuri/Vuuri.vue";
import RemoveControlDetail from "./RemoveControlDetail.vue";

const control = controlStore();
const { currentAdd, currentControlList } = storeToRefs(control);

// 配置项
const option = ref({
  layout: { horizontal: false },
});
const removeControlRef = ref(null);
const clickVisible = ref(true);

// 获取高度
const getHeight = () => {
  return 120 + "px";
};

// 过滤控制中心列表在web端显示
const controlList = computed(() => {
  if (window.$usePlat('client')) return currentControlList.value;
  const arr = [
    "window-control",
    "assist-mode",
    "audio",
    "energy-save-mode",
    "shake",
  ];
  let filterList = currentControlList.value.filter(
    (item) => !arr.includes(item.id)
  );
  return filterList;
});

onMounted(() => {
  // 拖拽移动中事件
  removeControlRef.value.muuri.on("dragMove", (item, event) => {
    clickVisible.value = false;
  });

  // 拖拽排序结束后
  removeControlRef.value.muuri.on('dragEnd',()=>{
    const updateItem = removeControlRef.value.muuri.getItems().map((mapItem)=>{
      return {
        id:mapItem.getElement().dataset.itemKey,
      }
    });
    control.updateControlList(updateItem);
  })

  // 拖拽结束后释放拖拽事件
  removeControlRef.value.muuri.on('dragReleaseEnd',(item,event)=>{
    clickVisible.value = true;
  });
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
