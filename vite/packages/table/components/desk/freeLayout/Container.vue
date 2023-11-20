<!-- 控制层 数据的处理 -->
<script setup lang="ts">
import { ref, watch, toRefs } from "vue";
import { storeToRefs } from "pinia";
import { useFreeLayoutStore } from "./store";
// 初始化操作
const freeLayoutStore: any = useFreeLayoutStore();
const props = defineProps({
  currentDesk: {},
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

// 1 获取页面数据
// const scrollWidth = freeLayoutEnv.value.scrollWidth;
// const scrollHeight = freeLayoutEnv.value.scrollHeight;
// const scrollTop = freeLayoutEnv.value.scrollTop;
// const scrollLeft = freeLayoutEnv.value.scrollLeft;

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
async function drawGraph(item) {
  const { customData } = item;
  const { width, height } = customData.widgetSize;

  cards.value.push({
    width,
    height,
  });
}
const last = ref(true);
// 获取位置
async function getPosition(item) {
  await drawGraph(item);
  const childDiv = await waterfallFlow.value?.getElementsByTagName("div");
  const { left, top } =
    childDiv[cards.value.length - 1].getBoundingClientRect();

  const { left: waterfallFlowLeft, top: waterfallFlowTop } =
    waterfallFlow.value.getBoundingClientRect();
  const scrollTop = freeLayoutEnv.value.scrollTop;
  const scrollLeft = freeLayoutEnv.value.scrollLeft;
  return {
    left: left - waterfallFlowLeft + scrollLeft,
    top: top - waterfallFlowTop + scrollTop,
  };
}

/**
 * 更新自由布局数据
 */
let updateCardTimer: any = null;
function updateCards(data) {
  let obj = {};

  // 优化1 抽离删除过程
  let cardObj = {};
  data.forEach((item) => (cardObj[item.id] = item));
  for (const key in getFreeLayoutData.value) {
    if (!(key in cardObj)) {
      delete getFreeLayoutData.value[key];
    }
  }
  // 添加逻辑
  data.forEach(async (item) => {
    const { id, name, customData } = item;
    // 优化2 判断初始化还是更新
    if (getFreeLayoutData.value[id] && getFreeLayoutData.value[id].id == id) {
      if (last.value) {
        getFreeLayoutData.value[id] = {
          left: getFreeLayoutData.value[id].left || 0,
          top: getFreeLayoutData.value[id].top || 0,
          index: getFreeLayoutData.value[id].index || 1,
          id,
          name,
          customData,
        };
      }
      return;
    }
    // 优化3 抽离获取坐标过程
    // const { left, top } = await getPosition(item);
    getFreeLayoutData.value[item.id] = {
      left: 0,
      top: 0,
      index: 1,
      id,
      name,
      customData,
    };
    console.log("更新了数据 :>> ");
  });
  last.value = false;
}

watch(currentDesk.value?.cards, (cards) => {
  clearTimeout(updateCardTimer);
  updateCardTimer = setTimeout(() => {
    updateCards(cards);
  }, 200);
});
const emits = defineEmits(["editStart", "editEnd"]);
function drag() {
  emits("editStart");
}
function dragStop() {
  emits("editEnd");
}
const a = ref(true);
</script>

<template>
  <!-- <div    ref="waterfallFlow"
    class="xt-theme-b h-full flex flex-wrap absolute fixed"
    style="align-content: flex-start !important"
       :style="{
      width: freeLayoutEnv.scrollData?.width + 'px',
      height: 100 + '%',
      top: freeLayoutEnv?.scrollData?.top + 'px',
      left: freeLayoutEnv?.scrollData?.left + 'px',
    }"
  >
    <div
      class="rounded-xl xt-theme-b"
      v-for="item in cards"
      style="margin: 6px"
      :style="{
        width: item.width + 'px',
        height: item.height + 'px',
      }"
    ></div>
  </div> -->
  <xt-drag
    parent
    boundary
    v-for="item in getFreeLayoutData"
    v-model:y="item.top"
    v-model:x="item.left"
    v-model:index="item.index"
    :key="item.id"
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
  >

    <slot name="box" :data="{ ...item }"></slot>
  </xt-drag>
</template>
