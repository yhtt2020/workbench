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
  if (getFreeLayoutState.value.position == "top center") {
    scrollbar.value.scrollLeft = Math.abs(
      (width.value - getFreeLayoutState.value.width) / 2
    );
    scrollbar.value.scrollTop = 0;
  } else if (getFreeLayoutState.value.position == "center") {
    scrollbar.value.scrollLeft = Math.abs(
      (width.value - getFreeLayoutState.value.width) / 2
    );
    scrollbar.value.scrollTop = Math.abs(
      (height.value - getFreeLayoutState.value.height) / 2
    );
  } else {
    scrollbar.value.scrollLeft = 0;
    scrollbar.value.scrollTop = 0;
  }
}
// 页面缩放更新布局
function update() {
  perfectScrollbar.value.update();
}
// 鼠标滚动
const scrollThreshold = 300; // 边缘滚动阈值
const scrollAmount = 100; // 每次滚动的距离

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
