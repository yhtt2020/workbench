<script setup lang="ts">
import { XYCoord, useDragLayer } from "vue3-dnd";
import { ItemTypes } from "./types";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { toRefs } from "@vueuse/core";

import { useFreeLayoutStore } from "./store";
import { snapToGrid } from "./snapToGrid";
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

const collect = useDragLayer((monitor) => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  initialOffset: monitor.getInitialSourceClientOffset(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging(),
  currentClientOffset: monitor.getClientOffset(),
}));
const {
  itemType,
  isDragging,
  item,
  initialOffset,
  currentOffset,
  currentClientOffset,
} = toRefs(collect);
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
        <slot v-if="itemType === ItemTypes.BOX" name="preview" :data="dragData">
        </slot>
      </div>
    </div>
    <div :style="getItemStyles(initialOffset, currentOffset)">
      <slot v-if="itemType === ItemTypes.BOX" name="preview" :data="dragData">
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
