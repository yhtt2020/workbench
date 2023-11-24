<!-- 滚动条视图和事件 -->
<template>
  <div
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
    <!-- <template v-if="freeLayoutEnv.loading"> -->
    <slot> </slot>
    <!-- </template> -->
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { useElementSize } from "@vueuse/core";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import { useElementBounding } from "@vueuse/core";
import { useFreeLayoutStore } from "./store";

// import Container from "./FloatMenu/Container.vue";
const aa = ref(true);
// 初始化操作
const freeLayoutStore = useFreeLayoutStore();
const {
  getFreeLayoutState,
  dragData,
  freeLayoutEnv,
  getFreeLayoutData,
  getCurrentDesk,
} = storeToRefs(freeLayoutStore);
const scrollbar = ref(null);
const perfectScrollbar = ref(null);

onMounted(() => {
  // 初始化自由布局环境
  freeLayoutStore.initFreeLayoutEnv();
  // 实例化滚动条
  perfectScrollbar.value = new PerfectScrollbar(scrollbar.value, {});
  freeLayoutEnv.value.scrollData = useElementBounding(scrollbar.value);

  setTimeout(() => {
    // 初始化自由布局定位
    redirect();

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
    // redirect();
  }, 1);
});
// 重置中心区域
const { width, height } = useElementSize(scrollbar);
function redirect() {
  let w = getFreeLayoutState.value.line.centerLine.x - width.value / 2;
  scrollbar.value.scrollLeft = w;
  let h = getFreeLayoutState.value.line.centerLine.y - height.value / 2;
  scrollbar.value.scrollTop = h;
  freeLayoutEnv.value.scrollLeft = w;
  freeLayoutEnv.value.scrollTop = h;
}
// 页面缩放更新布局
function update() {
  perfectScrollbar.value.update();
}

// 监听画布缩放情况
watch(
  () => getFreeLayoutState.value?.canvas.zoom,
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
