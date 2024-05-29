<!-- 滚动条视图和事件 -->
<template>
  <div
    @wheel="handleWheelEvent"
    v-show="isFreeLayout"
    ref="scrollbar"
    class="no-drag relative w-full h-full"
    style="padding-right: 10px; padding-bottom: 10px; margin-bottom: 12px"
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
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
  computed,
  getCurrentInstance,
} from "vue";
import { storeToRefs } from "pinia";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import { useElementBounding } from "@vueuse/core";
import { useFreeLayoutStore } from "./store";
import { useElementSize } from "../../../ui/new/drag/src/hooks/useElementSize";
import { useWindowSize } from "../../../ui/new/drag/src/hooks/useWindowSize";
import { useWidgetStore } from "../../card/store";
const widgetStore = useWidgetStore();
const { edit } = storeToRefs(widgetStore);
const { proxy } = getCurrentInstance();
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
  isSelectAll,
  isFreeLayout,
} = storeToRefs(freeLayoutStore);
const scrollbar = ref(null);
const perfectScrollbar = ref(null);

const scrollSize = ref();
onBeforeMount(() => {
  // 关键步骤 初始化自由布局状态数据
  freeLayoutStore.initFreeLayoutState();
  // 初始化自由布局环境
  // freeLayoutStore.initFreeLayoutEnv();
});

onMounted(() => {
  freeLayoutEnv.value.scrollData = useElementBounding(scrollbar.value);

  // 实例化滚动条
  perfectScrollbar.value = new PerfectScrollbar(scrollbar.value, {});
  useElementSize(scrollbar.value, (size) => {
    scrollSize.value = size;
    if (size.width == 0 || size.height == 0) return;
    freeLayoutEnv.value.scrollWidth = size.width;
    freeLayoutEnv.value.scrollHeight = size.height;
  });
  // 事件监听
  scrollbar.value.addEventListener("ps-scroll-x", () => {
    freeLayoutEnv.value.scrollLeft = scrollbar.value?.scrollLeft;
  });
  scrollbar.value.addEventListener("ps-scroll-y", () => {
    freeLayoutEnv.value.scrollTop = scrollbar.value?.scrollTop;
  });
  // 监听窗口大小变化
  useWindowSize((size) => {
    redirect();
  });
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
  // 监听用于更新滚动条X轴滚动事件
  // proxy.$bus.on("updateFreeLayoutScrollX", (x) => {
  //   scrollbar.value.scrollLeft = x;
  // });
  // // 监听用于更新滚动条Y轴滚动事件
  // proxy.$bus.on("updateFreeLayoutScrollY", (y) => {
  //   scrollbar.value.scrollTop = y;
  // });
  proxy.$bus.on("updateFreeLayoutScroll", () => {
    perfectScrollbar.value.update();
  });
  proxy.$bus.on("restoreLocation", () => {
    redirect();
  });

  scrollbar.value.scrollLeft += 0;
});
const lock = ref(false);
watch([isFreeLayout, () => scrollSize.value], ([state, size]) => {
  if (!state) lock.value = false;
  if (lock.value) return;
  if (!size) return;
  const { width, height } = size;
  // 等待状态和画布同时加载成功
  if (state && width && height) {
    // 初始化自由布局定位
    let scrollMode = getFreeLayoutState.value?.mode.scroll
      ? getFreeLayoutState.value.mode.scroll
      : "free";
    updateScroll(scrollMode);
    lock.value = true;
  }
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

// 鼠标滚动
let isDragging = ref(false);
let isKey = ref(false);
let initialMousePosition = ref(null);

/**
 * 2023-12-21
 */
//滚动方式
const updateScroll = async (newV) => {
  redirect();
  scrollbar.value.scrollLeft = 0;
  scrollbar.value.scrollLeft = 0;
  if (newV === "free") {
    perfectScrollbar.value.settings.suppressScrollX = false;
    perfectScrollbar.value.settings.suppressScrollY = false;
  } else if (newV === "vertical") {
    perfectScrollbar.value.settings.suppressScrollX = true;
    perfectScrollbar.value.settings.suppressScrollY = false;
  } else if (newV === "horizontal") {
    perfectScrollbar.value.settings.suppressScrollX = false;
    perfectScrollbar.value.settings.suppressScrollY = true;
  } else if (newV === "lock") {
    perfectScrollbar.value.settings.suppressScrollX = true;
    perfectScrollbar.value.settings.suppressScrollY = true;
  }
  setTimeout(() => {
    redirect();
  }, 1);
};
watch(
  () => getFreeLayoutState.value?.mode?.scroll,
  (val) => {
    if (!isFreeLayout.value) return;
    updateScroll(val);
  }
);

// 重置中心区域
async function redirect() {
  const res = await freeLayoutStore?.restoreLocation();
  const { w, h, left } = res;
  scrollbar.value.scrollLeft += 0;
  scrollbar.value.scrollLeft = w;
  scrollbar.value.scrollTop = h;
  freeLayoutEnv.value.scrollLeft = w;
  freeLayoutEnv.value.scrollTop = h;
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
const handleWheelEvent = (event) => {
  let scrollMode = getFreeLayoutState.value?.mode.scroll;
  if (scrollMode != "horizontal") return;
  // 获取滚动位置
  const scrollPosition = event.deltaY;
  scrollbar.value.scrollLeft += scrollPosition;
};
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
  if (edit.value && event.ctrlKey && (event.key === "A" || event.key === "a")) {
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
// 页面缩放更新布局
function update() {
  perfectScrollbar.value.update();
}
// 2023-12-21 结束

onBeforeUnmount(() => {
  freeLayoutStore.initFreeLayoutEnv();

  // scrollbar.value.removeEventListener("ps-scroll-x", () => {}, {
  //   capture: true,
  // });
  // scrollbar.value.removeEventListener("ps-scroll-x", () => {}, {
  //   capture: true,
  // });
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("keyup", handleKeyUp);
  window.removeEventListener("mousedown", handleMouseDown);
  window.removeEventListener("mousemove", handleMouseMove);
  window.removeEventListener("mouseup", handleMouseUp);
  document.body.removeEventListener("keydown", ignoreSpace);

  proxy.$bus.off("updateFreeLayoutScroll");
});
defineExpose({
  redirect,
  update,
});
</script>

<style lang="scss" scoped></style>
