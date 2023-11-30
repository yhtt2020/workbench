<!-- 控制层 数据的处理 -->
<script setup lang="ts">
import { ref, watch, toRefs } from "vue";
import { storeToRefs } from "pinia";
import { useFreeLayoutStore } from "./store";
// 初始化操作
const freeLayoutStore: any = useFreeLayoutStore();
const props = defineProps({
  currentDesk: {},
  isDrag: {},
});

const { currentDesk }: any = toRefs(props);
const {
  freeLayoutData,
  getCurrentDeskId,
  getFreeLayoutData,
  freeLayoutEnv,
  getFreeLayoutState,
} = storeToRefs(freeLayoutStore);

// 调用自由画布初始化状态
freeLayoutStore.initFreeLayoutState();

// 滚动清除cards数据
watch(
  [() => freeLayoutEnv.value.scrollTop, () => freeLayoutEnv.value.scrollLeft],
  ([newScrollTop, newScrollLeft], [oldScrollTop, oldScrollLeft]) => {
    cards.value = [];
  }
);

// 绘制图形
const cards: any = ref([]);
const waterfallFlow: any = ref(null);
async function getPosition(item) {
  cards.value.push(item);
  const nodes = await waterfallFlow.value?.getElementsByTagName("div");
  for (let node of nodes) {
    if (
      !(node instanceof HTMLDivElement) ||
      node.getAttribute(`data-id`) != item.id.toString()
    ) {
      continue;
    }
    const { left: waterfallFlowLeft, top: waterfallFlowTop } =
      waterfallFlow.value.getBoundingClientRect();
    const { id, name, customData } = item;
    const { left, top } = node.getBoundingClientRect();
    const scrollTop = freeLayoutEnv.value.scrollTop;
    const scrollLeft = freeLayoutEnv.value.scrollLeft;
    getFreeLayoutData.value[item.id] = {
      left: left - waterfallFlowLeft + scrollLeft,
      top: top - waterfallFlowTop + scrollTop,
      index: 1,
      id,
      name,
      customData,
    };
  }
}

/**
 * 更新自由布局数据
 */
let updateCardTimer: any = null;
function updateCard(data) {
  let startTime = new Date().getTime();
  let cardObj = {};
  data.forEach((item) => (cardObj[item.id] = item));
  for (const key in getFreeLayoutData.value) {
    if (!(key in cardObj)) {
      delete getFreeLayoutData.value[key];
    }
  }
  data.forEach(async (item) => {
    const { id, name, customData } = item;
    // 优化2 判断初始化还是更新
    if (getFreeLayoutData.value[id] && getFreeLayoutData.value[id].id == id) {
      getFreeLayoutData.value[id] = {
        left: getFreeLayoutData.value[id].left || 0,
        top: getFreeLayoutData.value[id].top || 0,
        index: getFreeLayoutData.value[id].index || 1,
        id,
        name,
        customData,
      };
    } else {
      getPosition(item);
    }
  });
  var endTime = new Date().getTime();
  var executionTime = endTime - startTime; // 计算执行时间（毫秒）
  console.log(" time: " + executionTime + "ms");
}
watch(
  currentDesk.value?.cards,
  (card) => {
    clearTimeout(updateCardTimer);
    updateCardTimer = setTimeout(() => {
      updateCard(card);
    }, 500);
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div
    ref="waterfallFlow"
    class="xt-theme-b h-full flex flex-wrap absolute"
    style="align-content: flex-start !important; visibility: hidden"
    :style="{
      width: freeLayoutEnv.scrollData?.width + 'px',
      height: 100 + '%',
      top: 0 + 'px',
      left: 0 + 'px',
    }"
  >
    <div
      class="rounded-xl xt-theme-b"
      v-for="item in cards"
      :data-id="item.id"
      style="margin: 6px"
      :style="{
        width: item.width + 'px',
        height: item.height + 'px',
      }"
    >
      <slot name="box" :data="{ ...item }"></slot>
    </div>
  </div>
  <template v-for="item in getFreeLayoutData">
    <xt-drag
      parent
      boundary
      v-if="item.id != ''"
      :key="item.id"
      v-model:y="item.top"
      v-model:x="item.left"
      v-model:index="item.index"
      :parentScale="getFreeLayoutState.canvas.zoom"
      :afterDraggingAdsorbGrid="getFreeLayoutState.option.afterDragging"
      :whileDraggingAdsorbGrid="getFreeLayoutState.option.whileDragging"
      :gridLocation="getFreeLayoutState.option.afterDragging"
      :collision="getFreeLayoutState.option.collision"
      :magnet="getFreeLayoutState.option.magnet"
      :gridMargin="6"
      :magnetMargin="6"
      disabledDefaultEvent
      :grid="[134, 96]"
      :gridStyle="{
        border: '2px solid var(--active-bg)',
      }"
      :handle="isDrag ? '' : '.#123'"
    >
      <slot name="box" :data="{ ...item }"></slot>
    </xt-drag>
  </template>
</template>
