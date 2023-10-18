<script setup lang="ts">
import { reactive } from "vue";
import { useDrop } from "vue3-dnd";
import { ItemTypes } from "./ItemTypes";
import { DragItem } from "./interfaces";
import { snapToGrid as doSnapToGrid } from "./snapToGrid";

import DraggableBox from "./DraggableBox.vue";
const props = defineProps<{
  snapToGrid: boolean;
  desk;
  currentDesk;
}>();

interface BoxMap {
  [key: string]: { top: number; left: number; title: string };
}

const boxes = reactive<BoxMap>({
  a: { top: 20, left: 80, title: "Drag me around" },
  b: { top: 180, left: 20, title: "Drag me too" },
});
const moveBox = (id: string, left: number, top: number) => {
  Object.assign(boxes[id], { left, top });
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

    moveBox(item.id, left, top);
    return undefined;
  },
}));
</script>

<template>
  <div :ref="drop" class="container">
    <DraggableBox :currentDesk="currentDesk" v-for="item in desk" :item="item">
    </DraggableBox>
  </div>
</template>

<style scoped lang="less">
.container {
  position: relative;
  width: 100%;
  height: 300px;
  border: 1px solid black red;
}
</style>
