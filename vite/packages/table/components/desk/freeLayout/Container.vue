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
import { useElementSize } from "../../../ui/hooks/useCardSize";
import _ from "lodash";
import { useCutLayout } from "./useCutLayout";
// 初始化操作
const freeLayoutStore: any = useFreeLayoutStore();
const props = defineProps({
  currentDesk: {},
  currentID: {},
  isDrag: {},
});
const { proxy }: any = getCurrentInstance();

const { currentDesk, currentID }: any = toRefs(props);
const { getFreeLayoutData, freeLayoutEnv, getFreeLayoutState, isSelectAll } =
  storeToRefs(freeLayoutStore);
const snowDrag = ref();

const firstLoading = ref(true);
onMounted(() => {
  // 等待滚动视图完成加载
  setTimeout(() => {
    updateCard(currentDesk.value?.cards);
  }, 2);
  proxy.$bus.on("cutCanvas", (position) => {
    loading.value = true;
    setTimeout(() => {
      cutCanvas({
        redirect: true,
        position,
      });
    }, 1000);
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
  if (!nodes) return;
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
  redirect: false,
  position: 0,
};
const loading = ref(false);
const cutCanvas = async (config) => {
  console.log("--------------- 处理画布开始 ---------------");
  console.time("Free Layout Run Time");
  // 前置代码 新功能请在后面添加
  const mergedOptions = _.merge({}, defaultConfig, config);
  const { redirect, position } = mergedOptions;

  if (!redirect) {
    if (!getFreeLayoutState.value.canvas.autoExtend) {
      console.log("被跳出了 :>> ");
      getFreeLayoutState.value.system.hide = false;
      loading.value = false;
      return;
    }
  }

  let left: any = Infinity;
  let top: any = Infinity;
  let right: any = 0;
  let bottom: any = 0;

  let width = 0;
  let height = 0;
  // 找最大最小元素
  Object.values(getFreeLayoutData.value).forEach((item: any) => {
    if (item.top < top) {
      top = item.top;
    }

    if (item.left < left) {
      left = item.left;
    }

    let size = currentData?.value[item.id]?.customData?.customSize;

    if (size) {
      let sizeObj = useElementSize(size);
      width = sizeObj.width;
      height = sizeObj.height;
    }

    if (item.left + width > right) {
      right = item.left + width;
    }
    if (item.top + height > bottom) {
      bottom = item.top + height;
    }
  });
  console.log("left :>> ", left);
  console.log("top :>> ", top);
  console.log("right :>> ", right);
  console.log("bottom :>> ", bottom);
  // 获取当前窗口大小
  let { scrollHeight, scrollWidth } = freeLayoutEnv.value;
  // 比例
  const HEIGHT_PROPORTION = 1;
  const WIDTH_PROPORTION = 1;
  const space = 50;
  // 当前屏幕宽度
  const viewWidth = scrollWidth * WIDTH_PROPORTION;
  const viewHeight = scrollHeight * HEIGHT_PROPORTION;
  let msgArr: any = [];

  // 左边
  if (Math.abs(left - viewWidth) > space) {
    let diff = viewWidth - left;
    if (left < viewWidth) {
    }
    if (left > viewWidth) {
      diff = -(left - viewWidth);
    }
    msgArr.push("左边");
    getFreeLayoutData.value = Object.values(getFreeLayoutData.value).map(
      (item: any) => {
        item.left += diff;
        return item;
      }
    );
    left += diff;
    right += diff;
    getFreeLayoutState.value.canvas.width += diff;
  }
  // 上边
  if (Math.abs(top - viewHeight) > space) {
    let diff = 0;
    if (top < viewHeight) {
      diff = viewHeight - top;
    }
    if (top > viewHeight) {
      diff = -(top - viewHeight);
    }
    msgArr.push("上边");
    getFreeLayoutData.value = Object.values(getFreeLayoutData.value).map(
      (item: any) => {
        item.top += diff;
        return item;
      }
    );
    top += diff;
    bottom += diff;
    getFreeLayoutState.value.canvas.height += diff;
  }
  // todo 可提供diff值 让滚动条进行移动

  // 右边
  const currentMaxRight = right + viewWidth;
  if (
    Math.abs(getFreeLayoutState.value.canvas.width - currentMaxRight) > space
  ) {
    msgArr.push("右边");
    getFreeLayoutState.value.canvas.width = currentMaxRight;
  }
  // 下边
  const currentMaxBottom = bottom + viewHeight;
  console.log('getFreeLayoutState.value.canvas.height :>> ', getFreeLayoutState.value.canvas.height);
  console.log('currentMaxBottom :>> ', currentMaxBottom);
  if (
    Math.abs(getFreeLayoutState.value.canvas.height - currentMaxBottom) > space
  ) {
    msgArr.push("下边");
    getFreeLayoutState.value.canvas.height = currentMaxBottom;
  }

  if (msgArr.length > 0) {
    console.log("msgArr :>> ", msgArr);
    message.success("已为您更新画布");
  }
  setTimeout(() => {
    // 处于吸附网格
    if (getFreeLayoutState.value.mode.arrange == "grid") {
      snowDrag.value?.forEach((item) => {
        item.adsorbGrid();
      });
    }
  }, 50);
  if (!redirect) return;
  console.log('111111111 :>> ', 111111111);
  let x = Infinity;
  let y = Infinity;
  setTimeout(() => {
    Object.values(getFreeLayoutData.value).forEach((item: any) => {
      if (item.top < y) {
        y = item.top;
      }

      if (item.left < x) {
        x = item.left;
      }
    });
    getFreeLayoutState.value.mode.align = "custom";
    const zoom = getFreeLayoutState.value.canvas.zoom;
    getFreeLayoutState.value.line.centerLine.y = y - 20;
    getFreeLayoutState.value.line.centerLine.x =
      (x * zoom - position + scrollWidth / 2) / zoom;
    proxy.$bus.emit("restoreLocation");
    getFreeLayoutState.value.system.hide = false;
    loading.value = false;
    console.timeEnd("Free Layout Run Time");
    console.log("--------------- 处理画布结束 ---------------");
  }, 100);
};

/**
 * 更新自由布局数据
 */
const currentData: any = ref({});
async function updateCard(data) {
  // console.log("--------------- 自由布局数据更新开始 ---------------");
  // console.time("Free Layout Run Time");
  // console.log("当前配置项 :>> \n", `桌面ID ${currentID.value}`);
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
  // console.timeEnd("Free Layout Run Time");
  // console.log("--------------- 自由布局数据更新结束 ---------------");
  firstLoading.value = false;
}

let updateCardTimer: any;

watch(
  () => currentDesk.value?.cards,
  (card) => {
    if (firstLoading.value) return;
    clearTimeout(updateCardTimer);
    updateCardTimer = setTimeout(() => {
      updateCard(card);
    }, 10);
    // console.log("watch数据更新了 :>> ");
  },
  {
    immediate: true,
    deep: true,
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
  freeLayoutStore.copyData();
};

// 元素拖拽结束
const dragStop = (item) => {
  setTimeout(() => {
    cutCanvas({});
  }, 10);

  if (!isSelectAll.value) {
    return;
  }
  // snowDrag.value.forEach((item) => {
  //   item.snowDragEnd();
  // });
};

const disabledInfo = (data) => {
  if (data.code == 1) {
    message.info(data.info);
  }
};

onBeforeUnmount(() => {
  proxy.$bus.off("cutCanvas");
  let data = {
    ...currentData.value,
  };

  // for (const id in freeLayout) {
  //   if (data[id]?.id.toString() != id.toString()) {
  //     console.log("删除数据 :>> ", id);
  //     delete freeLayout[id];
  //   }
  // }
  // console.log("自由布局销毁操作 :>> ", getFreeLayoutData.value);
});

const handleIntersection = (visible, item) => {
  console.log(`Element is intersecting: ${visible}`);
  console.log("item :>> ", item);
  if (visible) {
    item.visible = true;
    console.log("object :>> ", 111);
    // Do something when element is intersecting
  } else {
    item.visible = false;
    // Do something when element is not intersecting
  }
};
</script>

<template>
  <div
    v-if="loading"
    class="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center"
    style="z-index: 9999; font-size: 64px; background: rgba(0, 0, 0, 0)"
  >
    <a-spin size="large" style="zoom: 1.6" />
  </div>
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
      v-if="item?.id"
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
        <!-- v-intersection="(visible) => handleIntersection(visible, item)" -->

        <div
          class="rounded-xl"
          :style="{
            display: getFreeLayoutState.system.hide ? 'none' : 'block',
            border: isSelectAll ? '3px solid var(--active-bg) ' : '',
          }"
          :key="item.id"
          ref="test"
        >
          <!-- <xt-button>{{ item.visible }}</xt-button> -->
          <!-- <xt-button>id： {{ item.id }}</xt-button> -->
          <!-- <xt-button  w="280" h="400">  {{ freeLayoutEnv.scrollData }} </xt-button> -->
          <!-- <xt-button w="280">top {{ item.top }}</xt-button> -->
          <!-- <xt-button w="280">left {{ item.left }}</xt-button> -->
          <slot name="box" :data="currentData[item?.id]"></slot>
        </div>
      </transition>
    </xt-drag>
  </template>
</template>

<style lang="scss" scoped>
.refresh {
  animation: rotate 0.5s infinite linear;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
