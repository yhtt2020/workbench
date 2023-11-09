<!-- 控制层 数据的处理 -->
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
const { freeLayoutData, getCurrentDeskId, getFreeLayoutData, freeLayoutEnv } =
  storeToRefs(freeLayoutStore);

// 调用自由画布初始化状态
freeLayoutStore.initFreeLayoutState();
/**
 * 更新自由布局数据
 */
let updateCardTimer: any = null;

/**
 *
 * @param cards
 * 计算当前页面添加数据
 *
 */
watch(
  [() => freeLayoutEnv.value.scrollTop, () => freeLayoutEnv.value.scrollLeft],
  ([newScrollTop, newScrollLeft], [oldScrollTop, oldScrollLeft]) => {
    console.log("scrollTop changed:", newScrollTop, "old:", oldScrollTop);
    console.log("scrollLeft changed:", newScrollLeft, "old:", oldScrollLeft);
  }
);
// 记录以添加了的内容
let currentCard = ref([]);
// 实现添加
function addCardAtPosition(item) {
  // 获取当前宽度
  const scrollWidth = freeLayoutEnv.value.scrollWidth;
  // 获取卡片元素
  const { id, name, customData } = item;
}

function updateCards(cards) {
  let obj = {};
  cards.forEach((item) => {
    const { id, name, customData } = item;
    // addCardAtPosition(item);
    obj[item.id] = {
      left:
        getFreeLayoutData.value[item.id]?.left ||
        freeLayoutEnv.value.scrollLeft + 6,
      top:
        getFreeLayoutData.value[item.id]?.top ||
        freeLayoutEnv.value.scrollTop + 6,
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

/**
 * 实现瀑布流
 */

// 1 获取页面数据
// const scrollWidth = freeLayoutEnv.value.scrollWidth;
// const scrollHeight = freeLayoutEnv.value.scrollHeight;
// const scrollTop = freeLayoutEnv.value.scrollTop;
// const scrollLeft = freeLayoutEnv.value.scrollLeft;
// // 2 逐个添加
// let a = [];

// currentDesk.value.forEach((item) => {
//   console.log("item :>> ", item);
// });
</script>

<template>
  <!-- 拖拽层 -->
  <DragPreview>
    <template #box="{ data }">
      <slot name="box" :data="{ data }"></slot>
    </template>
  </DragPreview>
  <!-- 整体画布层 -->

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
