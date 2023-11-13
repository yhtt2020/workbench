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
  /**
   * @author 杨南南
   * @date 2023-11-09
   * @description 修正拖拽元素的坐标，以使其根据画布缩放进行对齐
   *
   * 核心算法
   * 修正后的拖拽X坐标 = 初始X坐标 + (当前X坐标 - 初始X坐标) / 画布缩放比例
   * 修正后的拖拽Y坐标 = 初始Y坐标 + (当前Y坐标 - 初始Y坐标) / 画布缩放比例
   *
   */
  let { x, y } = currentOffset;
  const initX = initialClientOffset.value.x;
  const initY = initialClientOffset.value.y;
  const zoom = getFreeLayoutState.value.canvas.zoom;

  x = initX + (x - initX) / zoom;
  y = initY + (y - initY) / zoom;

  if (isSnapToGrid) {
    x -= initialOffset.x;
    y -= initialOffset.y;
    [x, y] = freeLayoutStore.snapToGrid(x, y);
    x += initialOffset.x;
    y += initialOffset.y;
  } else {
    // x = dargX.value;
    // y = dargY.value;
  }

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
      zoom: getFreeLayoutState.canvas.zoom,
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
