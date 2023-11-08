<!-- 滚动条视图和事件 -->
<template>
  <div
    v-show="freeLayoutEnv.loading"
    ref="scrollbar"
    class="no-drag relative w-full"
    style="
      padding-right: 10px;
      padding-bottom: 10px;
      margin-bottom: 12px;
      height: 100%;
    "
    @mouseover="handleMouseMove"
  >
    <slot> </slot>
    <!-- <div
      @click="handleClick($event)"
      class="absolute w-full h-full xt-theme-bg top-0 left-0"
      style="z-index: 1000"
    >
      112
    </div> -->
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { useElementSize } from "@vueuse/core";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

import { useFreeLayoutStore } from "./store";

// 初始化操作
const freeLayoutStore = useFreeLayoutStore();
const { getFreeLayoutState, dragData, freeLayoutEnv } =
  storeToRefs(freeLayoutStore);
const scrollbar = ref(null);
const perfectScrollbar = ref(null);
onMounted(() => {
  // 初始化自由布局环境
  freeLayoutStore.initFreeLayoutEnv();
  // 实例化滚动条
  perfectScrollbar.value = new PerfectScrollbar(scrollbar.value, {});

  setTimeout(async () => {
    // 初始化自由布局定位
    await redirect();

    let { width, height } = scrollbar.value?.getBoundingClientRect();
    freeLayoutEnv.value.scrollWidth = width;
    freeLayoutEnv.value.scrollHeight = height;
    // 监听自由布局滚动事件
    scrollbar.value.addEventListener("ps-scroll-x", () => {
      freeLayoutEnv.value.scrollLeft = scrollbar.value.scrollLeft;
    });
    scrollbar.value.addEventListener("ps-scroll-y", () => {
      freeLayoutEnv.value.scrollTop = scrollbar.value.scrollTop;
    });

    // 完成操作 开启
    freeLayoutEnv.value.loading = true;
  }, 100);
});
// 重置中心区域
const { width, height } = useElementSize(scrollbar);
function redirect() {
  console.log("222 :>> ", 222);
  const zoom = getFreeLayoutState.value.zoom;
  // const scrollTop = (height.value - getFreeLayoutState.value.height * zoom) / 2;
  // const scrollLeft = (width.value - getFreeLayoutState.value.width * zoom) / 2;

  // scrollbar.value.scrollLeft =
  //   getFreeLayoutState.value.position.x -
  //   (getFreeLayoutState.value.width * zoom) / 2;

  // console.log("scrollbar.value.scrollLeft :>> ", scrollbar.value.scrollLeft);
  // scrollbar.value.scrollTop =
  //   getFreeLayoutState.value.position.y -
  //   (getFreeLayoutState.value.height * zoom) / 2;

  //   console.log("scrollbar.value.scrollLeft :>> ", scrollbar.value.scrollLeft);

  /**
   * 居中X坐标 = (可见视图区宽度 - 滚动区宽度 * 缩放比例) / 2 + 滚动区指定的X坐标 * 缩放比例
   * 居中Y坐标 = (可见视图区高度 - 滚动区高度 * 缩放比例) / 2 + 滚动区指定的Y坐标 * 缩放比例
   */
  const x =
    (width.value - getFreeLayoutState.value.width * zoom) / 2 +
    getFreeLayoutState.value.line.centerLine.x * zoom;
  const y =
    (height.value - getFreeLayoutState.value.height * zoom) / 2 +
    (getFreeLayoutState.value.line.centerLine.y + 205) * zoom;
  scrollbar.value.scrollLeft = x;

  scrollbar.value.scrollTop = y;

  // scrollbar.value.scrollLeft = desiredScrollLeft;

  // scrollbar.value.scrollTop = desiredScrollTop;
  return;
  // const scrollTop = (height.value - getFreeLayoutState.value.height * zoom) / 2;
  // const scrollLeft = (width.value - getFreeLayoutState.value.width * zoom) / 2;
  if (getFreeLayoutState.value.position == "top center") {
    scrollbar.value.scrollLeft = Math.abs(scrollLeft);
    scrollbar.value.scrollTop = 0;
  } else if (getFreeLayoutState.value.position == "center") {
    scrollbar.value.scrollLeft = Math.abs(scrollLeft);
    scrollbar.value.scrollTop = Math.abs(scrollTop);
  } else {
    scrollbar.value.scrollLeft = 0;
    scrollbar.value.scrollTop = 0;
  }
}
// 页面缩放更新布局
function update() {
  perfectScrollbar.value.update();
}

function handleClick(e) {
  console.log("e :>> ", e);
}

// 监听画布缩放情况
watch(
  () => getFreeLayoutState.value?.zoom,
  () => {
    // console.log(
    //   "freeLayoutEnv.value.loading :>> ",
    //   freeLayoutEnv.value.loading
    // );
    // if (!freeLayoutEnv.value.loading) {
    //   console.log("222222222 :>> ", 222222222);
    //   return;
    // }
    // let { width, height } = scrollbar.value.getBoundingClientRect();
    // let currentWidth =
    //   getFreeLayoutState.value?.width * getFreeLayoutState.value?.zoom;
    // let currentHeight =
    //   getFreeLayoutState.value?.height * getFreeLayoutState.value?.zoom;
    // if (currentWidth < width && getFreeLayoutState.value?.width < 10000) {
    //   console.log("宽度增加 :>> ", 222);
    //   getFreeLayoutState.value.width += 1000;
    // }
    // if (currentHeight < height && getFreeLayoutState.value.height < 10000) {
    //   console.log("gao度增加 :>> ", 222);
    //   getFreeLayoutState.value.height += 1000;
    // }
  }
);
// 鼠标滚动
const scrollThreshold = 300; // 边缘滚动阈值
const scrollAmount = 100; // 每次滚动的距离

// 鼠标拖拽元素 被zoom影响了位置

function handleMouseMove(event) {
  return;
  if (scrollbar.value && Object.keys(dragData.value).length !== 0) {
    const { clientX, clientY } = event;
    const { left, top, right, bottom } =
      scrollbar.value.getBoundingClientRect();

    // 向左滚动
    if (clientX <= left + scrollThreshold) {
      console.log("左 :>> ", 2222);
      scrollbar.value.scrollLeft -= scrollAmount;
    }

    // 向右滚动
    if (clientX >= right - scrollThreshold) {
      console.log("右 :>> ", 1111);
      scrollbar.value.scrollLeft += scrollAmount;
    }

    // 向上滚动
    if (clientY <= top + scrollThreshold) {
      console.log("上 :>> ", 4444);
      scrollbar.value.scrollTop -= scrollAmount;
    }

    // 向下滚动
    if (clientY >= bottom - scrollThreshold) {
      console.log("下 :>> ", 3333);
      // scrollbar.value.scrollTop += scrollAmount;
      scrollbar.value.scrollBy({ top: scrollAmount });
    }
  }
}
onBeforeUnmount(() => {
  freeLayoutStore.initFreeLayoutEnv();
  scrollbar.value.removeEventListener("ps-scroll-x", () => {}, {
    capture: true,
  });
  scrollbar.value.removeEventListener("ps-scroll-x", () => {}, {
    capture: true,
  });
});
defineExpose({
  redirect,
  update,
});
</script>

<style lang="scss" scoped></style>
