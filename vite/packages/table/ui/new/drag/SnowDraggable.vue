<template>
  <div
    ref="draggable"
    style="border: 0px solid red"
    :style="[draggableMode, draggablePos]"
    @mousedown.stop="yDragStartFn"
  >
    <div
      v-element-size="getElementSize"
      style="position: absolute; left: 50%; top: 50%; transform-origin: center"
      :style="{
        transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
      }"
    >
      <slot>
        <!-- <div class="draggable">
          <div>长按开始</div>
          <div>拖拽!👋</div>
        </div> -->
        <img src="./snow.svg" alt="" style="display: block" />
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
import { ref, onMounted, toRefs, computed, watch, onBeforeUnmount } from "vue";
import { useWindowSize } from "./useWindowSize";
import { useElementSize, vElementSize } from "./useElementSize";
import { snapGrid, isValidHandle, rotatedDimensions } from "./utils";
export interface DragProps {
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
  collisionRestore?: string;
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
}

const props = withDefaults(defineProps<DragProps>(), {
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
});
const {
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
} = toRefs(props);

onBeforeUnmount(() => {

});
const emits = defineEmits([
  "update:x",
  "update:y",
  "click",
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
const top = ref<number>(y.value);
const left = ref<number>(x.value);
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
  const [newWidth, newHeight] = rotatedDimensions(
    size.width,
    size.height,
    rotate.value
  );
  draggableSize.value = {
    width: newWidth,
    height: newHeight,
  };
}
onMounted(() => {
  // 父级窗口变化
  watch(
    parent,
    () => {
      if (parent.value) {
        parentSize.value = useElementSize(draggable.value.parentNode);
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
function yDragStartFn(event: MouseEvent) {
  if (disabled.value) return;
  if (event instanceof MouseEvent && event.button !== 0) {
    return;
  }
  // 手柄区域
  if (handle.value) {
    const handleElement = isValidHandle(event, handle.value);
    if (!handleElement) return;
  } else if (disabledHandle.value) {
    const isHandleDisabled = isValidHandle(event, disabledHandle.value);
    if (isHandleDisabled) return;
  }

  isDragging.value = true;
  initialMouseX.value = event.clientX;
  initialMouseY.value = event.clientY;
  initialTop.value = top.value;
  initialLeft.value = left.value;

  // 显示网格位置
  prevY.value = top.value;
  prevX.value = left.value;
  emits("onDragStart", dragData.value);
  window.addEventListener("mousemove", yDragFn, { capture: true });
  window.addEventListener("mouseup", yDragStopFn, { capture: true });
}
// 拖拽过程
function yDragFn(event: MouseEvent) {
  if (isDragging.value) {
    // 阻止默认事件
    if (disabledDefaultEvent.value) {
      event.preventDefault();
    }
    if (gridLocation.value) {
      showGridPos.value = true;
    }

    const { clientX, clientY } = event;

    // 计算鼠标在x轴上的移动距离
    const deltaX =
      (clientX - initialMouseX.value) / parentScale.value / scale.value;
    // 计算鼠标在y轴上的移动距离
    const deltaY =
      (clientY - initialMouseY.value) / parentScale.value / scale.value;

    let newTop = initialTop.value + deltaY;
    let newLeft = initialLeft.value + deltaX;

    const [snappedX, snappedY] = snapGrid(
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
}

// 拖拽结束
function yDragStopFn(event: MouseEvent) {
  isDragging.value = false;

  // 隐藏网格位置
  if (gridLocation.value) {
    showGridPos.value = false;
  }
  // 拖拽结束吸附网格
  if (afterDraggingAdsorbGrid.value) {
    const [snappedX, snappedY] = snapGrid(
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
  window.removeEventListener("mousemove", yDragFn, { capture: true });
  window.removeEventListener("mouseup", yDragStopFn, { capture: true });
}

// 重置元素位置
function ResetElementPosition() {
  if (resetPosition.value) {
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
    if (overlap) {
      return true;
    }
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
</script>
<style scoped>
@import "./style.css";
</style>
