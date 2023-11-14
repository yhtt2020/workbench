<!-- 画布层 用于维护所有小组件展示 -->
<template>
  <div
    class="relative mx-auto"
    :ref="drop"
    :style="{
      width: getFreeLayoutState.canvas.width + 'px',
      height: getFreeLayoutState.canvas.height + 'px',
      zoom: getFreeLayoutState.canvas.zoom,
    }"
    :class="{
      'xt-theme-b': getFreeLayoutState.line.isAuxLine,
    }"
  >
    <!-- 辅助线显示 -->
    <template v-if="getFreeLayoutState.line.isAuxLine">
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
    <!-- 中心线显示 -->
    <template v-if="getFreeLayoutState.line.isCenterLine">
      <div
        class="absolute left-0 right-0"
        style="height: 1px; border: 3px groove var(--active-bg)"
        :style="{
          top:
            getFreeLayoutState.line.centerLine.y /
              getFreeLayoutState.canvas.zoom +
            'px',
        }"
      />
      <div
        class="absolute top-0 h-full"
        style="width: 1px; border: 3px groove var(--active-bg)"
        :style="{
          left:
            getFreeLayoutState.line.centerLine.x /
              getFreeLayoutState.canvas.zoom +
            'px',
        }"
      />
    </template>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useDrop } from "vue3-dnd";
import { storeToRefs } from "pinia";
import { ItemTypes } from "./types";
import { useFreeLayoutStore } from "./store";
// 初始化操作
const freeLayoutStore: any = useFreeLayoutStore();
const { getFreeLayoutData, getFreeLayoutState, getFreeLayoutMargin }: any =
  storeToRefs(freeLayoutStore);
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
    //     // 计算鼠标的移动距离
    // const deltaX = x - initialClientOffset.value.x;
    // const deltaY = y - initialClientOffset.value.y;

    // // 修正移动距离，考虑缩放比例
    // const correctedDeltaX = deltaX / getFreeLayoutState.value.zoom;
    // const correctedDeltaY = deltaY / getFreeLayoutState.value.zoom;

    // // 计算拖拽元素应该位于的新坐标
    // x = initialClientOffset.value.x + correctedDeltaX;
    // y = initialClientOffset.value.y + correctedDeltaY;
    // 这里处理位置摆放
    let left = Math.round(item.left + delta.x);
    let top = Math.round(item.top + delta.y);
    if (getFreeLayoutState.value.afterDrop) {
      [left, top] = freeLayoutStore.snapToGrid(left, top);
    }
    moveBox(
      item.id,
      left + getFreeLayoutMargin.value,
      top + getFreeLayoutMargin.value
    );
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
  return auxLine(
    getFreeLayoutState.value.canvas.width,
    140 - 6 + getFreeLayoutMargin.value * 2
  );
});

const auxLineHeight = computed(() => {
  return auxLine(
    getFreeLayoutState.value.canvas.height,
    102 - 6 + getFreeLayoutMargin.value * 2
  );
});
</script>

<style lang="scss" scoped></style>
