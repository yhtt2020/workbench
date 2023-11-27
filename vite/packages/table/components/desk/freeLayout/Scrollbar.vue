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
    :style="{
      cursor: dragStyle,
    }"
  >
    <slot> </slot>
  </div>
</template>
<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
  computed,
} from "vue";
import { storeToRefs } from "pinia";
import { useElementSize } from "@vueuse/core";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import { useElementBounding } from "@vueuse/core";
import { useFreeLayoutStore } from "./store";
const dragStyle = computed(() => {
  if (isKey.value && isDragging.value) {
    return "grabbing";
  } else if (isKey.value) {
    return "grab";
  }
});

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

onMounted(async () => {
  // 初始化自由布局环境
  freeLayoutStore.initFreeLayoutEnv();
  // 实例化滚动条
  perfectScrollbar.value = new PerfectScrollbar(scrollbar.value, {});
  freeLayoutEnv.value.scrollData = useElementBounding(scrollbar.value);

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
    // redirect();

    // 监听键盘按下事件
    window.addEventListener("keydown", handleKeyDown);
    // 监听键盘抬起事件
    window.addEventListener("keyup", handleKeyUp);
    // 监听鼠标按下事件
    window.addEventListener("mousedown", handleMouseDown);
    // 监听鼠标移动事件
    window.addEventListener("mousemove", handleMouseMove);
    // 监听鼠标抬起事件;
    window.addEventListener("mouseup", handleMouseUp);
  }, 1);
});

// 鼠标按下

function handleMouseDown(event) {
  if (event.buttons === 1) {
    isDragging.value = true;
    initialMousePosition.value = {
      x: event.clientX,
      y: event.clientY,
    };
  }
}
// 鼠标移动
function handleMouseMove(event) {
  if (isDragging.value && isKey.value) {
    const dx = event.clientX - initialMousePosition.value.x;
    const dy = event.clientY - initialMousePosition.value.y;
    scrollbar.value.scrollTop -= dy;
    scrollbar.value.scrollLeft -= dx;

    initialMousePosition.value = { x: event.clientX, y: event.clientY };
  }
}

// 鼠标抬起
function handleMouseUp(event) {
  isDragging.value = false;
}

// 键盘按下
function handleKeyDown(event) {
  if (event.key == "Alt") {
    isKey.value = true;
  }
}
// 键盘抬起
function handleKeyUp(event) {
  isKey.value = false;
}
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

let isDragging = ref(false);
let isKey = ref(false);
let initialMousePosition = ref(null);
let scrollElement = ref(null);

// 鼠标拖拽元素 被zoom影响了位置

onBeforeUnmount(() => {
  freeLayoutStore.initFreeLayoutEnv();
  scrollbar.value.removeEventListener("ps-scroll-x", () => {}, {
    capture: true,
  });
  scrollbar.value.removeEventListener("ps-scroll-x", () => {}, {
    capture: true,
  });
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("keyup", handleKeyUp);
  window.removeEventListener("mousedown", handleMouseDown);
  window.removeEventListener("mousemove", handleMouseMove);
  window.removeEventListener("mouseup", handleMouseUp);
});
defineExpose({
  redirect,
  update,
});
</script>

<style lang="scss" scoped></style>
