<!-- 控制层 数据的处理 -->
<script setup lang="ts">
import { ref, watch, toRefs, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useFreeLayoutStore } from "./store";
import { message } from "ant-design-vue";
// 初始化操作
const freeLayoutStore: any = useFreeLayoutStore();
const props = defineProps({
  currentDesk: {},
  currentID: {},
  isDrag: {},
});

const { currentDesk, currentID }: any = toRefs(props);
const {
  freeLayoutData,
  getCurrentDeskId,
  getFreeLayoutData,
  freeLayoutEnv,
  getFreeLayoutState,
  isSelectAll,
} = storeToRefs(freeLayoutStore);
const snowDrag = ref();
onMounted(() => {
  // setTimeout(() => {
  //   snowDrag.value.forEach((item) => {
  //   console.log("item :>> ", item);
  // });
  // }, 10);
});
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
    getFreeLayoutData.value[id] = {
      left:
        scrollLeft / getFreeLayoutState.value.canvas.zoom +
        left -
        waterfallFlowLeft,
      top:
        scrollTop / getFreeLayoutState.value.canvas.zoom +
        top -
        waterfallFlowTop,
      index: 1,
      id,
    };
    if (getFreeLayoutData.value[id]) {
      console.log("新数据赋值成功 :>> ", getFreeLayoutData.value[id]);
    }
  }
}

/**
 * 更新自由布局数据
 */

let updateCardTimer: any = null;
const currentData: any = ref(null);
function updateCard(data) {
  console.log("--------------- 自由布局数据更新开始 ---------------");
  console.time("Free Layout Run Time");
  console.log("当前配置项 :>> \n", `桌面ID ${currentID.value}`);
  let dataObj = {};

  data.forEach((item) => (dataObj[item.id] = item));
  currentData.value = dataObj;
  for (const key in getFreeLayoutData.value) {
    if (!(key in dataObj)) {
      delete getFreeLayoutData.value[key];
    }
  }

  data.forEach((item) => {
    const { id,  customData } = item;
    // 优化2 判断初始化还是更新
    if (getFreeLayoutData.value[id] && getFreeLayoutData.value[id].id == id) {
      console.log("旧数据处理 :>> ");
      getFreeLayoutData.value[id] = {
        left: getFreeLayoutData.value[id].left || 0,
        top: getFreeLayoutData.value[id].top || 0,
        index: getFreeLayoutData.value[id].index || 1,
        id,
      };
    } else {
      getPosition(item);
    }
  });
  console.timeEnd("Free Layout Run Time");
  console.log("--------------- 自由布局数据更新结束 ---------------");
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
const test: any = ref(null);
const drag = (obj) => {
  if (isSelectAll.value) {
    const { initX, initY, x, y, data } = obj;
    // 偏移坐标
    const offsetX = x - initX;
    const offsetY = y - initY;
    freeLayoutStore.updatePositionX(offsetX);
    freeLayoutStore.updatePositionY(offsetY);
  }
};

const dragStart = () => {
  isDragging = false;
  freeLayoutStore.copyData();
};
let isDragging = false; // 添加一个标志位来表示当前是否正在拖动

const dragStop = () => {
  if (isDragging) return;
  isDragging = true; // 开始拖动时设置标志位为true
  if (!isSelectAll.value) return;
  snowDrag.value.forEach((item) => {
    item.snowDragEnd();
  });
};

const disabledInfo = (data) => {
  console.log("data :>> ", data);
  if (data.code == 1) {
    message.info(data.info);
  }
};
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
      :test="0"
      @onDisabled="disabledInfo"
      mode="all"
      ref="snowDrag"
      resetPosition
      parent
      boundary
      v-if="!getFreeLayoutState.system.hide"
      :data="item"
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
      :disabled="isDrag ? false : true"
      @onDragStart="dragStart"
      @onDrag="drag"
      @onDragStop="dragStop"
    >
      <template v-if="currentData">
        <div
          class="rounded-xl"
          :style="{
            border: isSelectAll ? '3px solid var(--active-bg) ' : '',
          }"
          ref="test"
        >
          <slot name="box" :data="currentData[item?.id]"></slot>
        </div>
      </template>
    </xt-drag>
  </template>
</template>
