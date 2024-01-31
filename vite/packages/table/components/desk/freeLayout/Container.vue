<!-- 控制层 数据的处理 -->
<script setup lang="ts">
import {
  ref,
  watch,
  toRefs,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
} from "vue";
import { storeToRefs } from "pinia";
import { useFreeLayoutStore } from "./store";
import { message } from "ant-design-vue";
import "animate.css";
import { useDebounceFn } from "@vueuse/core";
import {
  useGridToWidth,
  useHeightToGrid,
  useElementSize,
} from "../../../ui/hooks/useCardSize";
// 初始化操作
const freeLayoutStore: any = useFreeLayoutStore();
const props = defineProps({
  currentDesk: {},
  currentID: {},
  isDrag: {},
});
const { proxy }: any = getCurrentInstance();

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

const firstLoading = ref(true);
onMounted(() => {
  // 等待滚动视图完成加载
  setTimeout(() => {
    updateCard(currentDesk.value?.cards);
  }, 2);

  proxy.$bus.on("adsorbGrid", () => {
    setTimeout(() => {
      snowDrag.value?.forEach((item) => {
        item.adsorbGrid();
      });
    }, 2);
  });
});

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

// 裁切画布
const cutCanvas = async () => {
  let minLeft: any = undefined;
  let minTop: any = undefined;
  let maxLeft: any = 0;
  let maxTop: any = 0;
  let minItem: any = {};
  let maxItem: any = {};
  Object.values(getFreeLayoutData.value).forEach((item: any) => {
    // 如果当前 item 的 top 小于 minTop，则更新 minTop
    if (minTop == undefined || item.top < minTop) {
      minTop = item.top;
      minItem = item;
    }
    // 如果当前 item 的 left 小于 minLeft，则更新 minLeft
    if (minLeft == undefined || item.left < minLeft) {
      minLeft = item.left;
      minItem = item;
    }

    // 如果当前 item 的 top 大于 maxTop，则更新 maxTop
    if (item.top > maxTop) {
      maxTop = item.top;
      maxItem = item;
    }

    // 如果当前 item 的 left 大于 maxLeft，则更新 maxLeft
    if (item.left > maxLeft) {
      maxLeft = item.left;
      maxItem = item;
    }
  });

  // 修正最大画布
  if (!currentData.value[maxItem.id]) return;
  let { width: canvasWidth, height: canvasHeight } =
    getFreeLayoutState.value.canvas;
  let maxSize = currentData.value[maxItem.id].customData.customSize;
  const { width: maxWidth, height: maxHeight } = useElementSize(maxSize);

  let { scrollHeight, scrollWidth } = freeLayoutEnv.value;

  if (
    Math.abs(canvasWidth - (maxItem.left + maxWidth + scrollWidth)) >
    scrollWidth
  ) {
    getFreeLayoutState.value.canvas.width =
      maxItem.left + maxWidth + scrollWidth;
  }

  if (
    Math.abs(canvasHeight - (maxItem.top + maxHeight + scrollHeight)) >
    scrollHeight
  ) {
    getFreeLayoutState.value.canvas.height =
      maxItem.top + maxHeight + scrollHeight;
  }
  // if (canvasHeight > maxItem.top + maxHeight + scrollHeight) {
  //   getFreeLayoutState.value.canvas.height =
  //     maxItem.top + maxHeight + scrollHeight;
  // }
};

/**
 * 更新自由布局数据
 */
const currentData: any = ref({});
async function updateCard(data) {
  console.log("--------------- 自由布局数据更新开始 ---------------");
  console.time("Free Layout Run Time");
  console.log("当前配置项 :>> \n", `桌面ID ${currentID.value}`);
  currentData.value = {};
  data.forEach((item) => {
    const { id, customData } = item;
    currentData.value[id] = {
      ...item,
      id,
    };

    if (getFreeLayoutData.value[id]?.id != id) {
      getPosition(item);
    }
  });

  console.timeEnd("Free Layout Run Time");
  console.log("--------------- 自由布局数据更新结束 ---------------");
  firstLoading.value = false;
}

let updateCardTimer: any;
watch(currentDesk.value?.cards, (card) => {
  if (firstLoading.value) return;
  clearTimeout(updateCardTimer);
  updateCardTimer = setTimeout(() => {
    updateCard(card);
  }, 10);
  console.log("watch数据更新了 :>> ");
});

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
  freeLayoutStore.copyData();
};

// 元素拖拽结束
const dragStop = (item) => {
  let { width: canvasWidth, height: canvasHeight } =
    getFreeLayoutState.value.canvas;
  let { scrollHeight, scrollWidth, scrollLeft, scrollTop } =
    freeLayoutEnv.value;
  // 如果画布宽度小于拖动元素的宽度，则调整画布宽度
  if (Math.abs(canvasWidth - (item.x + item.width)) <= 400) {
    message.success("已拓展画布区域");
    getFreeLayoutState.value.canvas.width += scrollWidth * 0.8;
  }
  // 如果画布高度小于拖动元素的高度，则调整画布高度
  if (Math.abs(canvasHeight - (item.y + item.height)) <= 400) {
    message.success("已拓展画布区域");
    getFreeLayoutState.value.canvas.height += scrollHeight * 0.8;
  }

  if (item.x < 200) {
    Object.values(getFreeLayoutData.value).forEach((item: any) => {
      item.left += scrollWidth * 0.8;
    });
    message.success("已拓展画布区域");
    proxy.$bus.on("updateFreeLayoutScrollX", scrollLeft + scrollWidth * 0.8);
    getFreeLayoutState.value.canvas.width += scrollWidth * 0.8;
  }
  if (item.y < 200) {
    Object.values(getFreeLayoutData.value).forEach((item: any) => {
      item.top += scrollHeight * 0.8;
    });
    message.success("已拓展画布区域");
    proxy.$bus.on("updateFreeLayoutScrollX", scrollLeft + scrollHeight * 0.8);
    getFreeLayoutState.value.canvas.height += scrollHeight * 0.8;
  }

  cutCanvas();

  if (!isSelectAll.value) return;
  snowDrag.value.forEach((item) => {
    item.snowDragEnd();
  });
};

const disabledInfo = (data) => {
  if (data.code == 1) {
    message.info(data.info);
  }
};

onBeforeUnmount(() => {
  let data = {
    ...currentData.value,
  };
  const freeLayout = freeLayoutStore.getOneFreeLayoutData(currentID.value);

  for (const id in freeLayout) {
    if (data[id]?.id.toString() != id.toString()) {
      console.log("删除数据 :>> ", id);
      delete freeLayout[id];
    }
  }
  console.log("自由布局销毁操作 :>> ", getFreeLayoutData.value);
});
</script>

<template>
  <div
    ref="waterfallFlow"
    class="xt-theme-b h-full flex flex-wrap absolute"
    style="align-content: flex-start !important; visibility: hidden"
    :style="{
      width: freeLayoutEnv.scrollWidth + 'px',
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
      v-if="!getFreeLayoutState.system.hide && item?.id"
      :test="false"
      @onDisabled="disabledInfo"
      mode="all"
      ref="snowDrag"
      resetPosition
      parent
      boundary
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
      <transition
        name="animate__animated animate__bounce"
        :appear="true"
        enter-active-class="animate__bounceIn"
        leave-active-class="animate__bounceIn"
      >
        <div
          v-if="item.id"
          class="rounded-xl"
          :style="{
            border: isSelectAll ? '3px solid var(--active-bg) ' : '',
          }"
          :key="item.id"
          ref="test"
        >
          <slot name="box" :data="currentData[item?.id]"></slot>
        </div>
      </transition>
    </xt-drag>
  </template>
</template>
