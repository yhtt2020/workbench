<!-- 可拖拽区域组件 -->
<script setup lang="ts">
import { reactive, computed } from "vue";
import { useDrop } from "vue3-dnd";
import DraggableBox from "./DraggableBox.vue";
import { ItemTypes } from "./ItemTypes";
import { DragItem } from "./interfaces";
import { snapToGrid as doSnapToGrid } from "./snapToGrid";
import { cardStore } from "../../../store/card.ts";
const card = cardStore();
const obj = reactive({});
const getCurrentDesk = computed(() => {
  const currentDesk = card.desks.filter(
    (item) => item.id == card.currentDeskId
  );

  currentDesk[0].cards.forEach((item) => {
    console.log("item :>> ", item);
    const { id, name, data, customData } = item;
    obj[item.id] = {
      top: 0,
      left: 0,
      id,
      name,
      data,
      customData,
    };
  });
  // return currentDesk[0].cards;
});

const props = defineProps<{
  snapToGrid: boolean;
}>();

interface BoxMap {
  [key: string]: { top: number; left: number; title: string };
}

const boxes = reactive({
  a: { top: 20, left: 80, title: "Drag me around" },
  b: { top: 180, left: 20, title: "Drag me too" },
  d: { top: 180, left: 20, title: "Drag me too" },
});
console.log("obj :>> ", obj);
console.log("boxes :>> ", boxes);
const moveBox = (id: string, left: number, top: number) => {
  if (!obj[id]) {
    obj[id] = {}; // 如果obj[id]不存在，先初始化它为一个空对象
  }
  Object.assign(obj[id], { left, top }); // 现在我们可以安全地合并对象
};

const [, drop] = useDrop(() => ({
  accept: ItemTypes.BOX,
  drop(item: DragItem, monitor) {
    const delta = monitor.getDifferenceFromInitialOffset() as {
      x: number;
      y: number;
    };

    let left = Math.round(item.left + delta.x);
    let top = Math.round(item.top + delta.y);
    if (props.snapToGrid) {
      [left, top] = doSnapToGrid(left, top);
    }
    console.log("item.id :>> ", item.id);
    moveBox(item.id, left, top);
    return undefined;
  },
}));
</script>

<template>
  {{ getCurrentDesk }}
  <div :ref="drop" class="container">
    <DraggableBox
      v-for="data in obj"
      :id="data.id"
      :key="data.id"
      :left="data.left"
      :top="data.top"
      :data="data"
    />
  </div>
</template>

<style scoped lang="less">
.container {
  position: relative;
  width: 100%;
  height: 300px;
  border: 1px solid black;
}
</style>
