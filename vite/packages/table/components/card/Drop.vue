<!-- 小组件放置层 -->
<template>
  <div ref="container">
    <!-- <div :ref="drop"> -->
    <slot></slot>
    <!-- </div> -->
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, unref } from "vue";
import { useDrop } from "vue3-dnd";
import { storeToRefs } from "pinia";
import { toRefs } from "@vueuse/core";
import useElementDimensions from "./get";
import { useFreeLayoutStore } from "../desk/freeLayout/store";

// 初始化操作
const freeLayoutStore: any = useFreeLayoutStore();

const { getFreeLayoutData, getFreeLayoutState } = storeToRefs(freeLayoutStore);

const props = defineProps({
  widgetSize: {
    type: Object,
    default: () => {
      return {
        width: 0,
        height: 0,
      };
    },
  },
});
const emits = defineEmits(["widgetSize"]);
const container = ref(null);

const dimensions = useElementDimensions(container);

function fillGrid(targetNumber, gridnum) {
  let numGrids = targetNumber / gridnum; // 计算需要多少格子，但不取整
  // 使用四舍五入来确定格子数量
  numGrids = Math.round(numGrids);
  let count = 0;
  for (let i = 0; i < numGrids; i++) {
    count++;
  }
  return count * gridnum;
}
const widgetSizes: any = ref({
  width: 0,
  height: 0,
});
// watch(dimensions, () => {
//   let obj = {
//     width: fillGrid(dimensions.value.width, 140) + "px !important",
//     height: fillGrid(dimensions.value.height, 102) + "px !important",
//   };
//   widgetSizes.value = obj;
//   emits("update:widgetSize", obj);
// });

// const [collect, drop] = useDrop(() => ({
//   accept: "box",
//   drop: () => ({
//     name: `222`,
//   }),
//   collect: (monitor) => ({
//     isOver: monitor.isOver(),
//     canDrop: monitor.canDrop(),
//   }),
// }));
// const { canDrop, isOver } = toRefs(collect);
// const isActive = computed(() => unref(canDrop) && unref(isOver));
// const backgroundColor = computed(() =>
//   unref(isActive) ? "darkgreen" : unref(canDrop) ? "darkkhaki" : ""
// );
// const [, drop] = useDrop(() => ({
//   accept: "box",
//   drop(item: any, monitor) {
//     let left = Math.round(item.left + delta.x);
//     let top = Math.round(item.top + delta.y);
//     if (getFreeLayoutState.value.afterDrop) {
//       // [left, top] = snapToGrid(left, top);
//     }
//     moveBox(item.id, left, top);
//     return undefined;
//   },
// }));
</script>

<style lang="scss" scoped>
a {
  color: aqua;
}
</style>
