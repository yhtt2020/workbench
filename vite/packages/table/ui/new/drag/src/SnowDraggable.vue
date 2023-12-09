<template>
  <div
    ref="draggable"
    style="border: 0px solid red"
    :style="[draggableMode, draggablePos]"
    @mousedown.stop.prevent="snowDragStart"
    @touchstart.stop.prevent="snowDragStart"
  >
    <div
      v-element-size="getElementSize"
      style="position: absolute; left: 50%; top: 50%; transform-origin: center"
      :style="{
        transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
      }"
    >
      <slot>
        <!-- <img src="./snow.svg" alt="" style="display: block" /> -->
      </slot>
    </div>
  </div>
  <div
    v-if="showGridPos"
    :style="[draggableMode, gridPos, gridStyle]"
    :class="gridClass"
  ></div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  toRefs,
  computed,
  watch,
  onBeforeUnmount,
  nextTick,
} from "vue";
import { useWindowSize } from "./hooks/useWindowSize";
import { useElementSize, vElementSize } from "./hooks/useElementSize";
import {
  getSnapGrid,
  getHandle,
  getRotatedDimensions,
  getClientCoordinates,
} from "./hooks/utils";
export interface DragProps {
  // 拖拽模式
  mode?: "all" | "mouse" | "touch";
  // 禁用组件拖拽
  disabled?: boolean;
  // 基于父级视图
  parent?: boolean;
  // 边缘检测
  boundary?: boolean;
  // 碰撞检测
  collision?: boolean;
  collisionName?: string | number;
  // 碰撞还原
  collisionRestore?: "before" | "init";
  // 磁吸检测
  magnet?: boolean;
  // 磁吸名称
  magnetName?: string | number;
  // 磁吸范围
  magnetRange?: number;
  // 磁吸边距
  magnetMargin?: number;
  // 双向绑定xyzr
  x?: number;
  y?: number;
  index?: number;
  rotate?: number;
  // 独立缩放
  scale?: number;
  // 父级缩放
  parentScale?: number;
  // 网格大小
  grid?: any;
  // 拖拽后吸附网格
  afterDraggingAdsorbGrid?: boolean;
  // 拖动时吸附网格
  whileDraggingAdsorbGrid?: boolean;
  // 拖动网格位置
  gridLocation?: boolean;
  // 网格边距
  gridMargin?: number;
  // 拖拽元素的选择器
  handle?: string | string[] | null;
  // 禁用拖拽元素的选择器
  disabledHandle?: string | string[] | null;
  // 禁用默认事件
  disabledDefaultEvent?: boolean;
  // 拖拽样式
  draggableClass?: string;
  draggableStyle?: object | null;
  // 网格样式
  gridClass?: string;
  gridStyle?: object | null;
  // 重置位置
  resetPosition?: boolean;
  // 用户数据
  data?: any;
  // 首次定位
  firstPosition?: any;
  // 测试模式
  test: boolean;
}

const props = withDefaults(defineProps<DragProps>(), {
  mode: "all",
  disabled: false,
  parent: false,
  boundary: true,
  collision: true,
  collisionName: "snow",
  collisionRestore: "before", // 'init'
  magnet: false,
  magnetRange: 10,
  magnetName: "snow",
  magnetMargin: 6,
  x: 0,
  y: 0,
  index: 20,
  rotate: 0,
  scale: 1,
  parentScale: 1,
  afterDraggingAdsorbGrid: false,
  whileDraggingAdsorbGrid: false,
  gridLocation: false,
  grid: [134, 96],
  gridMargin: 6,
  handle: null,
  disabledHandle: null,
  disabledDefaultEvent: true,
  draggableClass: "",
  draggableStyle: null,
  gridClass: "grid",
  gridStyle: null,
  resetPosition: true,
  data: {},
  firstPosition: null,
  test: true,
});
const {
  mode,
  disabled,
  parent,
  boundary,
  collision,
  collisionName,
  collisionRestore,
  magnet,
  magnetName,
  magnetRange,
  magnetMargin,
  x,
  y,
  index,
  rotate,
  scale,
  parentScale,
  afterDraggingAdsorbGrid,
  whileDraggingAdsorbGrid,
  gridLocation,
  grid,
  gridMargin,
  handle,
  disabledHandle,
  disabledDefaultEvent,
  resetPosition,
  data,
  firstPosition,
  test,
} = toRefs(props);

onBeforeUnmount(() => {});
const emits = defineEmits([
  "update:x",
  "update:y",
  "click",
  "onDisabled",
  "onDragStart",
  "onDrag",
  "onDragStop",
  "auxLine",
]);
const draggable: any = ref({}); // 可拖拽元素
const elementSize: any = ref({});
// const parentNode: any = ref(null)
const parentSize: any = ref({}); // 边缘大小
const draggableSize: any = ref({}); // 可拖拽元素大小
const isDragging = ref<boolean>(false);

const initialMouseX = ref<number>(0);
const initialMouseY = ref<number>(0);
const initialTop = ref<number>(0);
const initialLeft = ref<number>(0);

const top = ref<number>(0);
const left = ref<number>(0);

const zIndex = ref(index.value);

const prevX = ref<number>(0);
const prevY = ref<number>(0);
// 网格数据
const showGridPos = ref<boolean>(false);
const gridPosLeft = ref<number>(0);
const gridPosTop = ref<number>(0);

// 拖拽基础样式
const draggableMode: any = computed(() => {
  return {
    position: parent.value ? "absolute" : "fixed",
    width: draggableSize.value.width + "px",
    height: draggableSize.value.height + "px",
    zoom: scale.value,
  };
});

// 拖拽样式
const draggablePos: any = computed(() => {
  return {
    left: left.value + "px",
    top: top.value + "px",
    zIndex: zIndex.value,
  };
});

// 网格样式
const gridPos: any = computed(() => {
  return {
    left: gridPosLeft.value + "px",
    top: gridPosTop.value + "px",
    zIndex: zIndex.value - 1,
  };
});
const dragData = computed(() => {
  return {
    initX: initialLeft.value,
    initY: initialTop.value,
    x: left.value,
    y: top.value,
    width: draggableSize.value?.width || 0,
    height: draggableSize.value?.height || 0,
    scale: scale.value,
    index: index.value,
    data: data.value,
  };
});
// 同步最新的xy坐标
watch(
  [x, y, index],
  () => {
    zIndex.value = index.value;
    left.value = x.value;
    top.value = y.value;
  },
  { immediate: true }
);
// 返回最新的xy坐标
watch(
  [() => top.value, () => left.value],
  ([newTop, newLeft], [oldTop, oldLeft]) => {
    emits("update:x", newLeft);
    emits("update:y", newTop);
  }
);

watch(rotate, () => {
  getElementSize(elementSize.value);
});
function getElementSize(size: any) {
  elementSize.value = size;
  const [newWidth, newHeight] = getRotatedDimensions(
    size.width,
    size.height,
    rotate.value
  );
  draggableSize.value = {
    width: newWidth,
    height: newHeight,
  };
}

watch([() => parentSize.value, () => draggableSize.value], () => {
  if (
    parentSize.value?.width !== undefined &&
    draggableSize.value?.width !== undefined
  ) {
    setPosition();
  }
});
const isFirstPosition = ref(true);
function setPosition() {
  if (!isFirstPosition.value) return;
  isFirstPosition.value = false;
  if (!firstPosition.value || !firstPosition.value.length) {
    top.value = y.value;
    left.value = x.value;
    return;
  }

  if (typeof firstPosition.value[0] === "string") {
    switch (firstPosition.value[0]) {
      case "left":
        left.value = 0;
        break;
      case "right":
        left.value = parentSize.value.width - draggableSize.value.width;
        break;
      case "center":
        left.value = parentSize.value.width / 2 - draggableSize.value.width / 2;
        break;
      default:
        if (test.value) {
          console.error(
            "firstPosition参数错误！第一个值必须为字符串时只接受left、right、center"
          );
        }
    }
  } else if (typeof firstPosition.value[0] == "number") {
    left.value = firstPosition.value[0];
  } else {
    if (test.value) {
      console.error("firstPosition参数错误！第一个值必须为字符串或数字");
    }
  }
  if (typeof firstPosition.value[1] === "string") {
    switch (firstPosition.value[1]) {
      case "top":
        top.value = 0;
        break;
      case "bottom":
        top.value = parentSize.value.height - draggableSize.value.height;
        break;
      case "center":
        top.value =
          parentSize.value.height / 2 - draggableSize.value.height / 2;
        break;
      case "left":
      default:
        if (test.value) {
          console.error(
            "firstPosition参数错误！第二个值必须为字符串时只接受top、bottom、center"
          );
        }
    }
  } else if (typeof firstPosition.value[1] === "number") {
    top.value = firstPosition.value[1];
  } else {
    if (test.value) {
      console.error("firstPosition参数错误！第二个值必须为字符串或数字");
    }
  }

  if (
    firstPosition.value.length == 3 &&
    typeof firstPosition.value[2] === "number"
  ) {
    left.value += firstPosition.value[2];
    top.value += firstPosition.value[2];
  } else if (
    firstPosition.value.length == 4 &&
    typeof firstPosition.value[2] === "number" &&
    typeof firstPosition.value[3] === "number"
  ) {
    left.value += firstPosition.value[2];
    top.value += firstPosition.value[3];
  } else {
    if (test.value) {
      console.error("firstPosition参数错误！第三、第四个值必须为数字");
    }
  }
  snowDragEnd();
}

onMounted(() => {
  // 父级窗口变化
  watch(
    parent,
    () => {
      if (parent.value) {
        useElementSize(draggable.value.parentNode, (size: any) => {
          parentSize.value = size;
          setTimeout(() => {
            ResetElementPosition();
          }, 200);
        });
      } else {
        useWindowSize((size: any) => {
          parentSize.value = size;
          ResetElementPosition();
        }, 200);
      }
    },
    {
      immediate: true,
    }
  );
  // 边缘检测 磁吸变化
  watch(
    [() => collision, () => magnet],
    ([newCollision, newMagnet], []) => {
      if (newCollision) {
        draggable.value.setAttribute(
          `data-collision-${collisionName.value}`,
          true
        );
      } else {
        draggable.value.removeAttribute(
          `data-collision-${collisionName.value}`
        );
      }
      if (newMagnet) {
        draggable.value.setAttribute(`data-magnet-${magnetName.value}`, true);
      } else {
        draggable.value.removeAttribute(`data-magnet-${magnetName.value}`);
      }
    },
    {
      immediate: true,
    }
  );
  // 独立缩放
  watch(
    scale,
    () => {
      draggable.value.setAttribute("data-scale", scale.value);
    },
    {
      immediate: true,
    }
  );
});

// 拖拽开始
function snowDragStart(event: MouseEvent | TouchEvent) {
  if (disabled.value) {
    emits("onDisabled", {
      code: 0,
      info: "当前处于禁用模式",
    });
    if (test.value) {
      console.error("onDisabled :>> 当前处于禁用模式");
    }
    return;
  }

  if (event instanceof MouseEvent && event.button !== 0) {
    return;
  } else if (event instanceof TouchEvent && event.touches.length < 1) {
    return;
  }

  if (mode.value !== "all") {
    if (mode.value == "mouse" && event instanceof TouchEvent) {
      emits("onDisabled", {
        code: 1,
        info: "非鼠标模式下禁止拖拽",
      });
      if (test.value) {
        console.error("onDisabled :>> 非鼠标模式下禁止拖拽");
      }
      return;
    }
    if (mode.value == "touch" && event instanceof MouseEvent) {
      emits("onDisabled", {
        code: 2,
        info: "非手柄模式下禁止拖拽",
      });
      if (test.value) {
        console.error("onDisabled :>> 非手柄模式下禁止拖拽");
      }
      return;
    }
  }
  // 手柄区域
  if (handle.value) {
    const handleElement = getHandle(event, handle.value);
    if (!handleElement) {
      emits("onDisabled", {
        code: 3,
        info: "非正确手柄下禁止拖拽",
      });
      if (test.value) {
        console.error("onDisabled :>> 非正确手柄下禁止拖拽");
      }
      return;
    }
  } else if (disabledHandle.value) {
    const isHandleDisabled = getHandle(event, disabledHandle.value);
    if (isHandleDisabled) {
      emits("onDisabled", {
        code: 4,
        info: "禁用手柄下禁止拖拽",
      });
      if (test.value) {
        console.error("onDisabled :>> 禁用手柄下禁止拖拽");
      }
      return;
    }
  }

  isDragging.value = true;
  const { clientX, clientY } = getClientCoordinates(event);
  initialMouseX.value = clientX;
  initialMouseY.value = clientY;
  initialTop.value = top.value;
  initialLeft.value = left.value;

  // 显示网格位置
  prevY.value = top.value;
  prevX.value = left.value;
  emits("onDragStart", dragData.value);
  window.addEventListener("mousemove", snowDrag, { capture: true });
  window.addEventListener("mouseup", snowDragEnd, { capture: true });

  window.addEventListener("touchmove", snowDrag, {
    capture: true,
    passive: false,
  });
  window.addEventListener("touchend", snowDragEnd, {
    capture: true,
    passive: false,
  });
}
// 拖拽过程
function snowDrag(event: MouseEvent | TouchEvent) {
  if (!isDragging.value) return;
  // 阻止默认事件
  if (disabledDefaultEvent.value) {
    event.preventDefault();
  }
  if (gridLocation.value) {
    showGridPos.value = true;
  }
  const { clientX, clientY } = getClientCoordinates(event);

  // 计算鼠标在x轴上的移动距离
  const deltaX =
    (clientX - initialMouseX.value) / parentScale.value / scale.value;
  // 计算鼠标在y轴上的移动距离
  const deltaY =
    (clientY - initialMouseY.value) / parentScale.value / scale.value;
  let newTop = initialTop.value + deltaY;
  let newLeft = initialLeft.value + deltaX;
  const [snappedX, snappedY] = getSnapGrid(
    grid.value,
    newLeft,
    newTop,
    parentSize.value.width / scale.value,
    parentSize.value.height / scale.value,
    gridMargin.value
  );
  // 拖拽时吸附网格
  if (whileDraggingAdsorbGrid.value) {
    newLeft = snappedX;
    newTop = snappedY;
  }

  // 边缘检测
  if (boundary.value) {
    const [boundaryX, boundaryY] = boundaryDetection(newLeft, newTop);
    newLeft = boundaryX;
    newTop = boundaryY;
  }

  // 冲突检测
  if (collision.value) {
    requestAnimationFrame(() => {
      const collisionRes = collisionDetection();
      if (!collisionRes) {
        if (afterDraggingAdsorbGrid.value || whileDraggingAdsorbGrid.value) {
          prevX.value = snappedX;
          prevY.value = snappedY;
          gridPosLeft.value = snappedX;
          gridPosTop.value = snappedY;
        } else {
          prevY.value = top.value;
          prevX.value = left.value;
        }
      }
    });
  } else {
    gridPosLeft.value = snappedX;
    gridPosTop.value = snappedY;
  }
  top.value = newTop;
  left.value = newLeft;
  // 磁吸检测
  if (magnet.value) {
    magnetDetection(newLeft, newTop);
  }
  emits("onDrag", dragData.value);
}

// 拖拽结束
function snowDragEnd(event?: MouseEvent | TouchEvent) {
  isDragging.value = false;

  // 隐藏网格位置
  if (gridLocation.value) {
    showGridPos.value = false;
  }
  // 拖拽结束吸附网格
  if (afterDraggingAdsorbGrid.value) {
    const [snappedX, snappedY] = getSnapGrid(
      grid.value,
      left.value,
      top.value,
      parentSize.value.width / scale.value,
      parentSize.value.height / scale.value,
      gridMargin.value
    );

    // 更新位置
    left.value = snappedX;
    top.value = snappedY;
  }
  // 冲突检测
  if (collision.value) {
    requestAnimationFrame(() => {
      const collisionRes = collisionDetection();
      if (collisionRes) {
        if (collisionRestore.value == "before") {
          left.value = prevX.value;
          top.value = prevY.value;
        } else {
          left.value = initialLeft.value;
          top.value = initialTop.value;
        }
      }
    });
  }

  emits("onDragStop", dragData.value);
  window.removeEventListener("mousemove", snowDrag, { capture: true });
  window.removeEventListener("mouseup", snowDragEnd, { capture: true });

  window.removeEventListener("touchmove", snowDrag, { capture: true });
  window.removeEventListener("touchend", snowDragEnd, { capture: true });
}

// 重置元素位置
function ResetElementPosition() {
  if (!resetPosition.value) return;
  if (left.value < 0 || top.value < 0) {
    left.value = 0;
    top.value = 0;
  } else if (
    left.value + draggableSize.value.width > parentSize.value.width ||
    top.value + draggableSize.value.height > parentSize.value.height
  ) {
    // 视图大小
    let vW = parentSize.value.width;
    let vH = parentSize.value.height;
    // 元素坐标
    let posX = left.value;
    let posY = top.value;
    // 元素大小
    let menuW = draggableSize.value.width;
    let menuH = draggableSize.value.height;

    posX = posX > vW - menuW ? vW - menuW : posX;
    posY = posY > vH - menuH ? vH - menuH : posY;

    left.value = posX;
    top.value = posY;
  }
}

// 边缘检测实现
const boundaryDetection = (x: number, y: number) => {
  x = Math.min(
    parentSize.value.width / scale.value - draggableSize.value.width,
    Math.max(0, x)
  );
  y = Math.min(
    parentSize.value.height / scale.value - draggableSize.value.height,
    Math.max(0, y)
  );
  return [x, y];
};

// 冲突检测实现
function collisionDetection() {
  const nodes = draggable.value.parentNode.childNodes;
  for (let item of nodes) {
    if (
      !(item instanceof HTMLDivElement) ||
      item.getAttribute(`data-collision-${collisionName.value}`) == null ||
      item == draggable.value
    ) {
      continue;
    }
    const rect1 = draggable.value.getBoundingClientRect();
    const rect2 = item.getBoundingClientRect();

    const scale1 = draggable.value.getAttribute("data-scale");
    const scale2: any = item.getAttribute("data-scale");
    const overlap = !(
      rect1.right * scale1 < rect2.left * scale2 ||
      rect1.left * scale1 > rect2.right * scale2 ||
      rect1.bottom * scale1 < rect2.top * scale2 ||
      rect1.top * scale1 > rect2.bottom * scale2
    );
    if (overlap) return true;
  }
  return false;
}

// 磁吸检测实现
function magnetDetection(x: number, y: number) {
  const nodes = draggable.value.parentNode.childNodes;
  let parentLeft;
  let parentTop;
  if (parent.value) {
    const parentNode = draggable.value.parentNode.getBoundingClientRect();
    parentLeft = parentNode.left;
    parentTop = parentNode.top;
  } else {
    parentLeft = 0;
    parentTop = 0;
  }
  let objX: any = {
    left: null,
    center: null,
    right: null,
  };
  for (let item of nodes) {
    if (
      !(item instanceof HTMLDivElement) ||
      item.getAttribute(`data-magnet-${magnetName.value}`) == null ||
      item == draggable.value
    ) {
      continue;
    }
    const rect1 = draggable.value.getBoundingClientRect();
    const scale1 = draggable.value.getAttribute("data-scale");
    const rect1Width = rect1.width;

    const rect1Height = rect1.height;
    const rect1Top = y;
    const rect1Bottom = y + rect1.height;
    const rect1Right = x + rect1.width;
    const rect1Left = x;
    const rect1CenterX = rect1Width / 2;
    const rect1CenterY = rect1Height / 2;

    const rect2 = item.getBoundingClientRect();
    const scale2: any = item.getAttribute("data-scale");
    const rect2Width = rect2.width;
    const rect2Height = rect2.height;
    const rect2Top = rect2.top - parentTop;
    const rect2Bottom = rect2.bottom - parentTop;
    const rect2Left = rect2.left - parentLeft;
    const rect2Right = rect2.right - parentLeft;
    const rect2CenterX = rect2Width / 2;
    const rect2CenterY = rect2Height / 2;
    // // 右边对齐左边
    if (Math.abs(rect1Right - rect2Left) <= magnetRange.value) {
      left.value = rect2Left - rect1Width - magnetMargin.value;
      objX.right = left.value;
    }
    // // 左边对齐右边
    if (Math.abs(rect1Left - rect2Right) <= magnetRange.value) {
      left.value = rect2Right + magnetMargin.value;
      objX.left = left.value;
    }
    // // 上边对齐下边
    if (Math.abs(rect1Top - rect2Bottom) <= magnetRange.value) {
      top.value = rect2Bottom + magnetMargin.value;
    }
    // // 下边对齐上边
    if (Math.abs(rect1Bottom - rect2Top) <= magnetRange.value) {
      top.value = rect2Top - rect1Height - magnetMargin.value;
    }
    // 上边对齐上边
    if (Math.abs(rect1Top - rect2Top) <= magnetRange.value) {
      top.value = rect2Top;
    }
    // 下边对齐下边
    if (Math.abs(rect1Bottom - rect2Bottom) <= magnetRange.value) {
      top.value = rect2Bottom - rect1Height;
    }
    // 左边对齐左边
    if (Math.abs(rect1Left - rect2Left) <= magnetRange.value) {
      left.value = rect2Left;
    }
    // 右边对齐右边
    if (Math.abs(rect1Right - rect2Right) <= magnetRange.value) {
      left.value = rect2Right - rect1Width;
    }
    // 垂直方向对齐
    if (
      Math.abs(rect1Left + rect1CenterX - (rect2Left + rect2CenterX)) <=
      magnetRange.value
    ) {
      left.value = rect2Left + rect2CenterX - rect1CenterX;
      objX.center = left.value;
    }
    // 水平方向对齐
    if (
      Math.abs(rect1Top + rect1CenterY - (rect2Top + rect2CenterY)) <=
      magnetRange.value
    ) {
      top.value = rect2Top + rect2CenterY - rect1CenterY;
    }
  }
  emits("auxLine", objX);
  return;
}

defineExpose({
  snowDragEnd,
});
</script>
<style scoped>
@import "./assets/style.css";
</style>
