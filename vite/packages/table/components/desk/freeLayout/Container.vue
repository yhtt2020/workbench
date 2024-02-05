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
import _, { iteratee } from "lodash";
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
    }, 1);
  });
  proxy.$bus.on("cutCanvas", () => {
    setTimeout(() => {
      cutCanvas({
        extend: false,
      });
      freeLayoutStore.updateLocation();
    }, 1);
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
const defaultConfig = {
  extend: true,
  id: null,
};
const cutCanvas = async (config) => {
  // console.log('123 :>> ', 123);
  const mergedOptions = _.merge({}, defaultConfig, config);
  const { extend, id } = mergedOptions;
  if (!getFreeLayoutState.value.canvas.autoExtend) return;

  // const  = currentDesk.value.cards
  console.log("currentData.value :>> ", currentData.value);
  let left: any = Infinity;
  let top: any = Infinity;
  let right: any = 0;
  let bottom: any = 0;
  let minItem: any = {};
  let maxItem: any = {};

  let rightItem: any = {};
  let bottomItem: any = {};
  let leftItem: any = {};
  let topItem: any = {};

  // 找最大最小元素
  Object.values(getFreeLayoutData.value).forEach((item: any) => {
    if (item.top < top) {
      top = item.top;
      topItem = item;
    }

    if (item.left < left) {
      left = item.left;
      leftItem = item;
    }

    let size = currentData?.value[item.id]?.customData?.customSize;
    let width = 0;
    let height = 0;
    if (size) {
      let sizeObj = useElementSize(size);
      width = sizeObj.width;
      height = sizeObj.height;
    }

    if (item.left + width > right) {
      right = item.left + width;
      rightItem = item;
    }
    if (item.top + height > bottom) {
      bottom = item.top + height;
      bottomItem = item;
    }
  });

  console.log("bottom :>> ", bottom);
  console.log("top :>> ", top);
  console.log("right :>> ", right);
  console.log("left :>> ", left);

  // 获取画布大小
  let { width: canvasWidth, height: canvasHeight } =
    getFreeLayoutState.value.canvas;
  // 获取当前窗口大小
  let { scrollHeight, scrollWidth } = freeLayoutEnv.value;
  // 比例
  const proportion = 0.75;
  // 当前屏幕宽度
  let viewWidth = scrollWidth * proportion;
  let viewHeight = scrollHeight * proportion;
  /**
   * @description: 空白画布回收
   */
  // 右边
  if (canvasWidth - right > viewWidth) {
    console.log("右边空白画布回收 :>> ");
    getFreeLayoutState.value.canvas.width = right + viewWidth;
  }
  // 左边
  if (left > viewWidth) {
    let diff = left - viewWidth;
    getFreeLayoutData.value = Object.values(getFreeLayoutData.value).map(
      (item: any) => {
        item.left -= diff;
        return item;
      }
    );
    console.log("左边空白画布回收 :>> ");
    getFreeLayoutState.value.canvas.width -= diff;
  }
  // 上边
  if (top > viewHeight) {
    let diff = top - viewHeight;
    getFreeLayoutData.value = Object.values(getFreeLayoutData.value).map(
      (item: any) => {
        item.top -= diff;
        return item;
      }
    );
    console.log("上边空白画布回收 :>> ");
    getFreeLayoutState.value.canvas.height -= diff;
  }
  // 下边
  if (canvasHeight - bottom > viewHeight) {
    getFreeLayoutState.value.canvas.height = bottom + viewHeight;
    console.log("下边空白画布回收 :>> ");
  }
  /**
   * @description: 空白画布拓展
   */
  // 右边
  if (canvasWidth - right < viewWidth) {
    message.success("已为您自动拓展右边画布");
    getFreeLayoutState.value.canvas.width = right + viewWidth;
  }
  // 左边
  if (left < viewWidth) {
    let diff = viewWidth - left;
    getFreeLayoutData.value = Object.values(getFreeLayoutData.value).map(
      (item: any) => {
        item.left += diff;
        return item;
      }
    );
    message.success("已为您自动拓展左边画布");
    getFreeLayoutState.value.canvas.width += diff;
  }
  // 上边
  if (top < viewHeight) {
    let diff = viewHeight - top;
    getFreeLayoutData.value = Object.values(getFreeLayoutData.value).map(
      (item: any) => {
        item.top += diff;
        return item;
      }
    );
    message.success("已为您自动拓展上边画布");
    getFreeLayoutState.value.canvas.height += diff;
  }
  // 下边
  if (canvasHeight - bottom < viewHeight) {
    message.success("已为您自动拓展下边画布");
    getFreeLayoutState.value.canvas.height = bottom + viewHeight;
  }
  // 定位修改
  setTimeout(() => {
    getFreeLayoutState.value.mode.align = "custom";
    const zoom = getFreeLayoutState.value.canvas.zoom;
    getFreeLayoutState.value.line.centerLine.y = top / zoom;
    getFreeLayoutState.value.line.centerLine.x =
      (left + scrollWidth / 2) / zoom;
    freeLayoutStore.restoreLocation();
    setTimeout(() => {}, 500);
  }, 100);
  // getFreeLayoutState.value.line.centerLine.x =
  //   (freeLayoutEnv.value.scrollLeft +
  //     freeLayoutEnv.value.scrollData.width / 2) /
  //   zoom;
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
  const freeLayout = freeLayoutStore.getOneFreeLayoutData(currentID.value);
  for (const id in freeLayout) {
    if (currentData.value[id]?.id.toString() != id.toString()) {
      console.log("删除数据 :>> ", id);
      delete freeLayout[id];
    }
  }
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
  cutCanvas({ id: item.data.id });

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
