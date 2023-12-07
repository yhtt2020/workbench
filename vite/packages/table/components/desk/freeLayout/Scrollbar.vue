<!-- 滚动条视图和事件 -->
<template>
  <div
    ref="scrollbar"
    class="no-drag relative w-full h-full"
    style="
      padding-right: 10px;
      padding-bottom: 10px;
      margin-bottom: 12px;

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

// 初始化操作
const freeLayoutStore = useFreeLayoutStore();
const {
  getFreeLayoutState,
  dragData,
  freeLayoutEnv,
  getFreeLayoutData,
  getCurrentDesk,
  isSelectAll
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
    document.body.addEventListener("keydown", ignoreSpace);
  }, 1);
});
function ignoreSpace(event) {
  var e = window.event || event;
  if (e.keyCode === 32) {
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      window.event.returnValue = false;
    }
  }
}

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
    try {
      scrollbar.value.scrollTop -= dy;
      scrollbar.value.scrollLeft -= dx;
    } catch (error) {
      scrollbar.value.scrollTop -= dy;
      scrollbar.value.scrollLeft -= dx;
    }

    initialMousePosition.value = { x: event.clientX, y: event.clientY };
  }
}

// 鼠标抬起
function handleMouseUp(event) {
  isDragging.value = false;
}

// 键盘按下
function handleKeyDown(event) {
  if (event.code === "Space") {
    isKey.value = true;
    event.preventDefault();
    event.stopPropagation();
  }
  if ((event.ctrlKey && event.key === "A") || event.key === "a") {
    isSelectAll.value = !isSelectAll.value;
  }
}
// 键盘抬起
function handleKeyUp(event) {
  isKey.value = false;
  if (event.code === "Space") {
    event.preventDefault();
    event.stopPropagation();
  }
}
// 重置中心区域
const { width, height } = useElementSize(scrollbar);
function redirect() {
  let w, h;
  if (getFreeLayoutState.value.line.centerPosition.x == "top") {
    w = getFreeLayoutState.value.line.centerLine.x;
  } else {
    w = getFreeLayoutState.value.line.centerLine.x - width.value / 2;
  }
  scrollbar.value.scrollLeft = w;
  if (getFreeLayoutState.value.line.centerPosition.y == "top") {
    h = getFreeLayoutState.value.line.centerLine.y;
  } else {
    h = getFreeLayoutState.value.line.centerLine.y - height.value / 2;
  }
  scrollbar.value.scrollTop = h;
  freeLayoutEnv.value.scrollLeft = w;
  freeLayoutEnv.value.scrollTop = h;
}
// 页面缩放更新布局
function update() {
  perfectScrollbar.value.update();
}

// 鼠标滚动

let isDragging = ref(false);
let isKey = ref(false);
let initialMousePosition = ref(null);

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
  document.body.removeEventListener("keydown", ignoreSpace);
});
defineExpose({
  redirect,
  update,
});
</script>

<style lang="scss" scoped></style>
