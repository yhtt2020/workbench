<!-- 拖拽层 -->
<script setup lang="ts">
import { XYCoord, useDragLayer } from "vue3-dnd";
import { ItemTypes } from "./types";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { toRefs } from "@vueuse/core";
import { useFreeLayoutStore } from "./store";
// 初始化操作
const freeLayoutStore: any = useFreeLayoutStore();
const { dragData, getFreeLayoutState }: any = storeToRefs(freeLayoutStore);

function getItemStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null,
  isSnapToGrid?: boolean
) {
  if (!initialOffset || !currentOffset) {
    return {
      display: "none",
    };
  }

  let { x, y } = currentOffset;
  // 计算鼠标的移动距离
  const deltaX = x - initialClientOffset.value.x;
  const deltaY = y - initialClientOffset.value.y;
  // 修正移动距离，考虑缩放比例
  const correctedDeltaX = deltaX / getFreeLayoutState.value.zoom;
  const correctedDeltaY = deltaY / getFreeLayoutState.value.zoom;

  // 计算拖拽元素应该位于的新坐标
  x = initialClientOffset.value.x + correctedDeltaX;
  y = initialClientOffset.value.y + correctedDeltaY;

  if (isSnapToGrid) {
    x -= initialOffset.x;
    y -= initialOffset.y;
    [x, y] = freeLayoutStore.snapToGrid(x, y);
    x += initialOffset.x;
    y += initialOffset.y;
    console.log("最后的x, y :>> ", x, y);
  } else {
    // x = dargX.value;
    // y = dargY.value;
  }

  // console.log("x :>> ", x);
  let transform = `translate(${isSnapToGrid ? x - 2 : x}px, ${
    isSnapToGrid ? y - 2 : y
  }px)`;
  return {
    transform,
  };
}
/**
 * 参考文献
 * https://www.vue3-dnd.com/guide/composition/use-drag-layer.html
 * https://www.vue3-dnd.com/guide/monitors/drag-source-monitor.html
 */
const collect = useDragLayer((monitor) => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  initialOffset: monitor.getInitialSourceClientOffset(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging(),
  currentClientOffset: monitor.getClientOffset(),
  // 获取拖拽开始时dom相对于客户端的初始化xy
  initialClientOffset: monitor.getInitialSourceClientOffset(),
}));
const {
  itemType,
  isDragging,
  item,
  initialOffset,
  currentOffset,
  currentClientOffset,
  initialClientOffset,
}: any = toRefs(collect);
const dargX = ref();
const dargY = ref();

watch(currentClientOffset, (newV) => {
  if (newV) {
    const { x, y }: any = currentClientOffset.value;
    // dargX.value = x;
    // dargY.value = y;
  }
});
</script>

<template>
  <div
    class="layer"
    :style="{
      zoom: getFreeLayoutState.zoom,
    }"
  >
    <div
      v-if="getFreeLayoutState.afterDrop"
      style="
        position: absolute;
        padding: 1px;
        border: 3px solid var(--active-bg);
        border-radius: 12px;
      "
      :style="
        getItemStyles(
          initialOffset,
          currentOffset,
          getFreeLayoutState.afterDrop
        )
      "
    >
      <div style="visibility: hidden">
        <slot v-if="itemType === ItemTypes.BOX" name="box" :data="dragData">
        </slot>
      </div>
    </div>
    <div :style="getItemStyles(initialOffset, currentOffset)">
      <slot v-if="itemType === ItemTypes.BOX" name="box" :data="dragData">
      </slot>
    </div>
  </div>
</template>

<style lang="less" scoped>
.layer {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
