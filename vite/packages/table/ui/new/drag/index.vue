<template>
  <div
    ref="draggableElement"
    :style="[
      draggableStyle,
      {
        zIndex: index,
      },
    ]"
    @mousedown="startDrag"
  >
    <slot>
      <div class="draggable">
        <div>长按开始</div>
        <div>拖拽!👋</div>
      </div>
    </slot>
  </div>

  <div
    :style="gridPosStyle"
    v-if="showGridPos"
    style="border: 1px solid red; border-radius: 12px; z-index: -1"
  ></div>
</template>

<script setup lang="ts">
import { ref, onMounted, toRefs, computed, watch } from "vue";
import { useWindowSize } from "@vueuse/core";
import { useElementSize } from "@vueuse/core";
import { snapToGrid } from "./utils";
export interface DragProps {
  // 基于父级视图
  parent?: boolean;
  // 边缘检测
  boundaryDetection?: boolean;
  // 冲突检测
  collisionDetection?: boolean;
  // 缩放比例
  scale?: number;
  // 初始位置
  initTop?: number;
  initLeft?: number;
  initIndex?: number;
  // 拖拽结束吸附网格
  afterDragging?: boolean;
  // 拖拽过程吸附网格
  whileDragging?: boolean;
  // 拖拽显示网格位置
  showGrid?: boolean;
  // 网格大小
  grid?: any;
}

const props = withDefaults(defineProps<DragProps>(), {
  parent: false,
  boundaryDetection: false,
  collisionDetection: false,
  scale: 1,
  initTop: 20,
  initLeft: 20,
  initIndex: 10,
  afterDragging: false,
  whileDragging: false,
  showGrid: false,
  grid: [68, 68],
});

const {
  parent,
  boundaryDetection,
  collisionDetection,
  scale,
  initTop,
  initLeft,
  initIndex,
  afterDragging,
  whileDragging,
  showGrid,
  grid,
} = toRefs(props);

// 拖拽样式
const draggableStyle: any = computed(() => {
  if (parent.value) {
    return {
      position: "absolute",
      transform: `translate(${left.value}px, ${top.value}px)`,
    };
  } else {
    return {
      position: "fixed",
      left: left.value + "px",
      top: top.value + "px",
    };
  }
});
// 网格样式
const gridPosStyle: any = computed(() => {
  if (parent.value) {
    return {
      position: "absolute",
      transform: `translate(${gridPosLeft.value}px, ${gridPosTop.value}px)`,
      width: grid.value[0] + "px",
      height: grid.value[1] + "px",
    };
  } else {
    return {
      position: "fixed",
      left: gridPosLeft.value + "px",
      top: gridPosTop.value + "px",
      width: grid.value[0] + "px",
      height: grid.value[1] + "px",
    };
  }
});
const gridPosLeft = ref(0);
const gridPosTop = ref(0);
const showGridPos = ref(false);
onMounted(() => {
  if (parent.value) {
    boundarySize.value = useElementSize(draggableElement.value.parentNode);
  } else {
    boundarySize.value = useWindowSize();
  }
  elementSize.value = useElementSize(draggableElement.value);
  draggableElement.value.setAttribute("data-collision-detection", true);
});
const elementSize = ref();
const isDragging = ref(false);
const initialMouseX = ref(0);
const initialMouseY = ref(0);
const initialTop = ref(0);
const initialLeft = ref(0);
const top = ref(initTop.value);
const left = ref(initLeft.value);
const index = ref(initIndex.value);
const emits = defineEmits(["floatPosition", "update:initIndex"]);
watch(
  [() => top.value, () => left.value],
  ([newTop, newLeft], [oldTop, oldLeft]) => {
    emits("floatPosition", {
      top: newTop,
      left: newLeft,
    });
  }
);
watch(index, () => {
  emits("update:initIndex", index.value);
});
const boundarySize: any = ref({ width: 0, height: 0 });
const draggableElement: any = ref(null);
const startDrag = (event: MouseEvent) => {
  index.value *= 100;
  event.stopPropagation();
  event.preventDefault();
  isDragging.value = true;
  initialMouseX.value = event.clientX;
  initialMouseY.value = event.clientY;
  initialTop.value = top.value;
  initialLeft.value = left.value;
  // 显示网格位置
  if (showGrid.value) {
    showGridPos.value = true;
  }
  window.addEventListener("mousemove", drag);
  window.addEventListener("mouseup", stopDrag);
};

const drag = (event: MouseEvent) => {
  if (isDragging.value) {
    event.stopPropagation();
    event.preventDefault();
    const deltaX = (event.clientX - initialMouseX.value) / scale.value;
    const deltaY = (event.clientY - initialMouseY.value) / scale.value;
    let newTop = initialTop.value + deltaY;
    let newLeft = initialLeft.value + deltaX;
    if (whileDragging.value || showGrid.value) {
      const [snappedX, snappedY] = snapToGrid(
        grid.value.size,
        newLeft,
        newTop,
        scale.value,
        boundarySize.value.width,
        boundarySize.value.height
      );
      // 拖拽过程吸附网格
      if (whileDragging.value) {
        newLeft = snappedX;
        newTop = snappedY;
      }
      // 显示网格位置
      if (showGrid.value) {
        gridPosLeft.value = snappedX;
        gridPosTop.value = snappedY;
      }
    }
    // 开启边缘检测
    if (boundaryDetection.value) {
      [newLeft, newTop] = boundaryDetectionFn(newLeft, newTop);
    }
    top.value = newTop;
    left.value = newLeft;
  }
};

const stopDrag = () => {
  index.value /= 100;
  isDragging.value = false;
  // 隐藏网格位置
  if (showGrid.value) {
    showGridPos.value = false;
  }
  if (afterDragging.value) {
    const [snappedX, snappedY] = snapToGrid(
      grid.value.size,
      left.value,
      top.value,
      scale.value,
      boundarySize.value.width,
      boundarySize.value.height
    );
    left.value = snappedX;
    top.value = snappedY;
  }
  if (collisionDetection.value) {
    collisionDetectionFn();
  }
  window.removeEventListener("mousemove", drag);
  window.removeEventListener("mouseup", stopDrag);
};

const boundaryDetectionFn = (x: number, y: number) => {
  x = Math.min(
    boundarySize.value.width - elementSize.value.width,
    Math.max(0, x)
  );
  y = Math.min(
    boundarySize.value.height - elementSize.value.height,
    Math.max(0, y)
  );
  return [x, y];
};

function collisionDetectionFn() {
  const nodes = draggableElement.value.parentNode.childNodes;
  for (let item of nodes) {
    if (
      item instanceof HTMLDivElement &&
      item != draggableElement.value &&
      item.getAttribute("data-collision-detection") !== null
    ) {
      const rect1 = draggableElement.value.getBoundingClientRect();
      const rect2 = item.getBoundingClientRect();
      const overlap = !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
      );
      if (overlap) {
        top.value = initialTop.value;
        left.value = initialLeft.value;
        break;
      }
    }
  }
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
</style>
