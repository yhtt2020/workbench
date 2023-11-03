<template>
  <div
    class="relative"
    :ref="drop"
    :style="{
      width: getFreeLayoutState.width + 'px',
      height: getFreeLayoutState.height + 'px',
      zoom: getFreeLayoutState.zoom,
    }"
    :class="{
      'xt-theme-b': getFreeLayoutState?.auxLine,
    }"
  >
    <!-- 辅助线 -->
    <template v-if="getFreeLayoutState?.auxLine">
      <div
        v-for="item in auxLineHeight"
        :key="item"
        class="absolute xt-theme-bg"
        style="left: 0; right: 0; height: 1px"
        :style="{
          top: `${item}px`,
        }"
      />
      <div
        v-for="item in auxLineWidth"
        class="absolute xt-theme-bg"
        :key="item"
        style="top: 0; width: 1px; height: 100%"
        :style="{
          left: `${item}px`,
        }"
      />
    </template>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDrop } from "vue3-dnd";
import { storeToRefs } from "pinia";
import { ItemTypes } from "./types";
import { snapToGrid } from "./snapToGrid";
import { useFreeLayoutStore } from "./store";

// 初始化操作
const freeLayoutStore: any = useFreeLayoutStore();
const { getFreeLayoutData, getFreeLayoutState } = storeToRefs(freeLayoutStore);
const moveBox = (id: any, left: number, top: number) => {
  Object.assign(getFreeLayoutData.value[id], { left, top });
};

const [, drop] = useDrop(() => ({
  accept: ItemTypes.BOX,
  drop(item: any, monitor) {
    const delta = monitor.getDifferenceFromInitialOffset() as {
      x: number;
      y: number;
    };

    let left = Math.round(item.left + delta.x);
    let top = Math.round(item.top + delta.y);
    if (getFreeLayoutState.value.afterDrop) {
      [left, top] = snapToGrid(left, top);
    }
    moveBox(item.id, left, top);
    return undefined;
  },

}));

// 辅助线生成
function auxLine(length: number, factor: number) {
  let arr: any = [];
  for (let i = 1; i <= Math.floor(length / factor); i++) {
    let value = i * factor;
    if (value <= length) arr.push(value);
  }
  return arr;
}
const auxLineWidth = computed(() => {
  return auxLine(getFreeLayoutState.value.width, 140);
});

const auxLineHeight = computed(() => {
  return auxLine(getFreeLayoutState.value.height, 102);
});
</script>

<style lang="scss" scoped></style>
