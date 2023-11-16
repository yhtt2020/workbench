<template>
  <div
    ref="draggable"
    :style="[draggableMode, draggablePos]"
    @mousedown.stop="yStartDraggableFn"
  >
    <slot>
      <div class="draggable">
        <div>长按开始</div>
        <div>拖拽!👋</div>
      </div>
    </slot>
  </div>
  <div v-if="showGridPos" :style="[draggableMode, gridPos]" class="grid"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, toRefs, computed, watch } from "vue";
import { useWindowSize } from "@vueuse/core";
import { useElementSize } from "@vueuse/core";
import { snapToGrid } from "./utils";
export interface DragProps {
  parent?: boolean;
  boundary?: boolean;
  collision?: boolean;
  magnet?: boolean;
  scale?: number;
  parentScale?: number;
  x?: number;
  y?: number;
  index?: number;
  afterDragging?: boolean;
  whileDragging?: boolean;
  showGrid?: boolean;
  grid?: any;
  margin?: number;
}
const props = withDefaults(defineProps<DragProps>(), {
  parent: false,
  boundary: true,
  collision: false,
  magnet: false,
  scale: 1,
  parentScale: 1,
  x: 0,
  y: 0,
  index: 20,
  afterDragging: false,
  whileDragging: false,
  showGrid: false,
  grid: [134, 96],
  margin: 6,
});
const {
  parent,
  boundary,
  collision,
  magnet,
  scale,
  parentScale,
  x,
  y,
  index,
  afterDragging,
  whileDragging,
  showGrid,
  grid,
  margin,
} = toRefs(props);

const draggable: any = ref(null); // 可拖拽元素
const boundarySize: any = ref(null); // 边缘大小
const draggableSize: any = ref(null); // 可拖拽元素大小
const isDragging = ref(false);

const initialMouseX = ref(0);
const initialMouseY = ref(0);
const initialTop = ref(0);
const initialLeft = ref(0);
const top = ref(y.value);
const left = ref(x.value);
const zIndex = ref(index.value);

// 网格数据
const showGridPos = ref(false);
const gridPosLeft = ref(0);
const gridPosTop = ref(0);
const emits = defineEmits(["update:x", "update:y", "click"]);
// 同步最新的xy坐标
watch(
  [x, y, index],
  () => {
    zIndex.value = index.value;
    // left.value = x.value;
    // top.value = y.value;
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
// 同步最新的独立缩放
watch(scale, () => {
  if (collision.value) {
    draggable.value.setAttribute("data-scale", scale.value);
  }
});
// 处理冲突检测数据
watch(collision, (val) => {
  if (val) {
    draggable.value.setAttribute("data-collision", true);
    draggable.value.setAttribute("data-scale", scale.value);
  } else {
    draggable.value.removeAttribute("data-collision");
    draggable.value.removeAttribute("data-scale");
  }
});
// 拖拽基础样式
const draggableMode: any = computed(() => {
  return {
    position: parent.value ? "absolute" : "fixed",
    zoom: scale.value,
    zIndex: zIndex.value,
  };
});

// 拖拽样式
const draggablePos: any = computed(() => {
  if (parent.value) {
    return {
      transform: `translate(${left.value}px, ${top.value}px)`,
    };
  } else {
    return {
      left: left.value + "px",
      top: top.value + "px",
    };
  }
});

// 网格样式
const gridPos: any = computed(() => {
  if (parent.value) {
    return {
      transform: `translate(${gridPosLeft.value}px, ${gridPosTop.value}px)`,
      width: draggableSize.value.width + "px",
      height: draggableSize.value.height + "px",
      zIndex: -1,
    };
  } else {
    return {
      left: gridPosLeft.value + "px",
      top: gridPosTop.value + "px",
      width: draggableSize.value.width + "px",
      height: draggableSize.value.height + "px",
      zIndex: -1,
    };
  }
});
onMounted(() => {
  if (parent.value) {
    boundarySize.value = useElementSize(draggable.value.parentNode);
  } else {
    boundarySize.value = useWindowSize();
  }
  draggableSize.value = useElementSize(draggable.value);
  draggable.value.setAttribute("data-scale", scale.value);
  draggable.value.setAttribute("data-magnet", true);

  if (collision.value) {
    draggable.value.setAttribute("data-collision", true);
    draggable.value.setAttribute("data-scale", scale.value);
  }
});

// 拖拽开始
function yStartDraggableFn(event: MouseEvent) {
  console.log('1 :>> ', 1);
  event.preventDefault();
  event.stopPropagation();
  if (event instanceof MouseEvent && event.button !== 0) {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  isDragging.value = true;
  initialMouseX.value = event.clientX;
  initialMouseY.value = event.clientY;
  initialTop.value = top.value;
  initialLeft.value = left.value;
  // 显示网格位置
  if (showGrid.value) {
    showGridPos.value = true;
  }

  window.addEventListener("mousemove", yDraggableFn, { capture: true });
  window.addEventListener("mouseup", yStopDraggableFn, { capture: true });
}
// 拖拽过程
const yDraggableFn = (event: MouseEvent) => {
console.log('2 :>> ', 2);
  event.preventDefault();
  event.stopPropagation();
  if (isDragging.value) {
    const { clientX, clientY } = event;

    // 计算鼠标在x轴上的移动距离。
    const deltaX =
      (clientX - initialMouseX.value) / parentScale.value / scale.value;
    // 计算鼠标在y轴上的移动距离
    const deltaY =
      (clientY - initialMouseY.value) / parentScale.value / scale.value;

    let newTop = initialTop.value + deltaY;
    let newLeft = initialLeft.value + deltaX;

    const [snappedX, snappedY] = snapToGrid(
      grid.value,
      newLeft,
      newTop,
      boundarySize.value.width / scale.value,
      boundarySize.value.height / scale.value,
      margin.value
    );

    // 拖拽时吸附网格
    if (whileDragging.value) {
      newLeft = snappedX;
      newTop = snappedY;
    }
    // 拖拽时显示网格
    if (showGrid.value) {
      gridPosLeft.value = snappedX;
      gridPosTop.value = snappedY;
    }
    // 边缘检测
    if (boundary.value) {
      const [boundaryX, boundaryY] = boundaryFn(newLeft, newTop);
      newLeft = boundaryX;
      newTop = boundaryY;
    }

    // 冲突检测
    if (collision.value && showGrid.value) {
      const collisionRes = collisionFn();
      if (collisionRes) {
        showGridPos.value = false;
      } else {
        showGridPos.value = true;
      }
    }

    top.value = newTop;
    left.value = newLeft;
    // magnetFn(newLeft, newTop);
  }
};

// 拖拽结束
const yStopDraggableFn = (event: MouseEvent) => {
  console.log("event 33333333333>> ", event);

  event.preventDefault();
  event.stopPropagation();
  isDragging.value = false;

  // 隐藏网格位置
  if (showGrid.value) {
    showGridPos.value = false;
  }
  // 拖拽结束吸附网格
  if (afterDragging.value) {
    const [snappedX, snappedY] = snapToGrid(
      grid.value,
      left.value,
      top.value,
      boundarySize.value.width / scale.value,
      boundarySize.value.height / scale.value,
      margin.value
    );

    // 更新位置
    left.value = snappedX;
    top.value = snappedY;
  }
  // 冲突检测
  if (collision.value) {
    requestAnimationFrame(() => {
      const collisionRes = collisionFn();

      if (collisionRes) {
        left.value = initialLeft.value;
        top.value = initialTop.value;
      }
    });
  }
  window.removeEventListener("mousemove", yDraggableFn, { capture: true });
  window.removeEventListener("mouseup", yStopDraggableFn, { capture: true });
};

// 边缘检测实现
const boundaryFn = (x: number, y: number) => {
  x = Math.min(
    boundarySize.value.width / scale.value - draggableSize.value.width,
    Math.max(0, x)
  );
  y = Math.min(
    boundarySize.value.height / scale.value - draggableSize.value.height,
    Math.max(0, y)
  );
  return [x, y];
};

// 冲突检测实现
function collisionFn() {
  const nodes = draggable.value.parentNode.childNodes;
  for (let item of nodes) {
    if (
      !(item instanceof HTMLDivElement) ||
      item.getAttribute("data-collision") == null ||
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

// 磁吸元素实现

function magnetFn(x: number, y: number) {
  const nodes = draggable.value.parentNode.childNodes;
  const parentNode = draggable.value.parentNode.getBoundingClientRect();
  const parentLeft = parentNode.left;
  const parentTop = parentNode.top;
  console.log("parentNode :>> ", parentNode);
  for (let item of nodes) {
    if (
      !(item instanceof HTMLDivElement) ||
      item.getAttribute("data-magnet") == null ||
      item == draggable.value
    ) {
      continue;
    }
    const rect1 = draggable.value.getBoundingClientRect();
    const scale1 = draggable.value.getAttribute("data-scale");
    const rect1Width = rect1.width * scale1;
    const rect1Height = rect1.height;
    const rect1Top = y * scale1;
    const rect1Bottom = y + rect1.height;
    const rect1Right = (x + rect1.width) * scale1;
    const rect1Left = x * scale1;
    const rect1CenterX = rect1Width / 2;
    const rect1CenterY = rect1Height / 2;

    const rect2 = item.getBoundingClientRect();
    const scale2: any = item.getAttribute("data-scale");
    const rect2Width = rect2.width;
    const rect2Height = rect2.height;
    const rect2Top = rect2.top * scale2;
    const rect2Bottom = rect2.bottom;
    const rect2Left = rect2.left * scale2;
    const rect2Right = rect2.right;
    const rect2CenterX = rect2Width / 2;
    const rect2CenterY = rect2Height / 2;
    const num = 10;
    // 右边对齐左边
    if (Math.abs(rect1Right - rect2Left) <= num) {
      left.value = rect2Left - rect1Width - margin.value;
    }
    // 左边对齐右边
    if (Math.abs(rect1Left - rect2Right) <= num) {
      left.value = rect2Right + margin.value;
    }
    // 上边对齐下边
    if (Math.abs(rect1Top - rect2Bottom) <= num) {
      top.value = rect2Bottom + margin.value;
    }
    // 下边对齐上边
    if (Math.abs(rect1Bottom - rect2Top) <= num) {
      top.value = rect2Top - rect1Height - margin.value;
    }
    // 上边对齐上边
    if (Math.abs(rect1Top - rect2Top) <= num) {
      top.value = rect2.top;
    }
    // 下边对齐下边
    if (Math.abs(rect1Bottom - rect2Bottom) <= num) {
      top.value = rect2Bottom - rect1Height;
    }
    // 左边对齐左边
    if (Math.abs(rect1Left - rect2Left) <= num) {
      left.value = rect2Left;
    }
    // 右边对齐右边
    if (Math.abs(rect1Right - rect2Right) <= num) {
      left.value = rect2Right - rect1Width;
    }
    // 垂直方向对齐
    if (
      Math.abs(rect1Left + rect1CenterX - (rect2Left + rect2CenterX)) <= num
    ) {
      left.value = rect2Left + rect2CenterX - rect1CenterX;
    }
    // 水平方向对齐
    if (Math.abs(rect1Top + rect1CenterY - (rect2Top + rect2CenterY)) <= num) {
      top.value = rect2Top + rect2CenterY - rect1CenterY;
    }
  }
  return;
}
</script>
<style scoped>
.draggable {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  text-align: center;
  cursor: move;
  border: 1px solid #ccc;
  background-color: #f0f0f0;
  width: 60px;
  height: 60px;
  padding: 12px;
  font-size: 14px;
  border-radius: 12px;
}

.grid {
  border: 1px solid red;
  border-radius: 12px;
}
</style>
