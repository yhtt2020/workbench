<script setup lang="ts">
import { ref, watch, toRefs, reactive } from "vue";
import { storeToRefs } from "pinia";

import DraggableBox from "./DraggableBox.vue";
import DragPreview from "./DragPreview.vue";
import Canvas from "./Canvas.vue";
import { useFreeLayoutStore } from "./store";
// 初始化操作
const freeLayoutStore: any = useFreeLayoutStore();
const props = defineProps({
  currentDesk: {},
});

const { currentDesk }: any = toRefs(props);
const { freeLayoutData, getCurrentDeskId, getFreeLayoutData } =
  storeToRefs(freeLayoutStore);

freeLayoutStore.initFreeLayoutState();
/**
 * 更新自由布局数据
 */
let updateCardTimer: any = null;

function updateCards(cards) {
  let obj = {};
  cards.forEach((item) => {
    const { id, name, customData } = item;
    obj[item.id] = {
      left: getFreeLayoutData.value[item.id]?.left || 0,
      top: getFreeLayoutData.value[item.id]?.top || 0,
      id,
      name,
      customData,
    };

  });
  freeLayoutData.value[getCurrentDeskId.value] = obj;
  console.log("更新了数据 :>> ");
}
watch(currentDesk.value?.cards, (cards) => {
  clearTimeout(updateCardTimer);
  updateCardTimer = setTimeout(() => {
    updateCards(cards);
  }, 200);
});
</script>

<template>
  <!-- 拖拽层 -->
  <DragPreview>
    <template #preview="{ data }">
      <slot name="preview" :data="{ data }"></slot>
    </template>
  </DragPreview>
  <Canvas>
    <DraggableBox
      v-for="item in getFreeLayoutData"
      :id="item.id"
      :top="item.top"
      :left="item.left"
      :key="item.id"
      :data="item"
    >
      <template #box="{ data }">
        <slot name="box" :data="{ data }"></slot>
      </template>
    </DraggableBox>
  </Canvas>
</template>
