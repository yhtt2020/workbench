<script setup lang="ts">
import { reactive, computed, watch, ref, toRefs } from "vue";
import { useDrop } from "vue3-dnd";

import { ItemTypes } from "./ItemTypes";
import { DragItem } from "./interfaces";
import { snapToGrid as doSnapToGrid } from "./snapToGrid";

import { storeToRefs } from "pinia";
import { useFreeDeskStore } from "./store";
import { cardStore } from "../../../store/card";

import Container from "./Container.vue";
import CustomDragLayer from "./CustomDragLayer.vue";
import DraggableBox from "./DraggableBox.vue";

const props = defineProps({
  desk: {},
  currentDesk: {},
});
const snapToGridAfterDrop = ref(false);
const snapToGridWhileDragging = ref(false);

const handleSnapToGridAfterDropChange = () => {
  snapToGridAfterDrop.value = !snapToGridAfterDrop.value;
};

const handleSnapToGridWhileDraggingChange = () => {
  snapToGridWhileDragging.value = !snapToGridWhileDragging.value;
};

// 控制层迁移过来的代码

const freeDeskStore: any = useFreeDeskStore();
const card: any = cardStore();

const { getCurrentDesk, freeDesk } = storeToRefs(freeDeskStore);

const { currentDesk } = toRefs(props);
// 获取组件
const { currentDeskId } = storeToRefs(card);

function renaw(cards) {
  let obj = {};
  cards.forEach((item) => {
    // 现存小组件 匹配 自由桌面的数据 找出存在相

    if (freeDesk.value[currentDeskId.value]?.hasOwnProperty(item.id)) {
      obj[item.id] = freeDesk.value[currentDeskId.value][item.id];
    }
    // 不存在要追加进去
    else {
      const { id, name, data, customData } = item;

      obj[item.id] = {
        top: 0,
        left: 0,
        id,
        name,
        data,
        customData,
      };
    }
  });
  console.log("obj :>> ", obj);
  freeDesk.value[currentDeskId.value] = obj;
}
let resizeTimer: any = null; // 用于存储 setTimeout 的返回值
const updateWindowDimensions = (newV) => {
  // 在窗口大小变化停止后才更新窗口大小
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    renaw(newV);
  }, 200); // 设置防抖延迟为200毫秒
};
watch(currentDesk?.value.cards, (newV) => {
  updateWindowDimensions(newV);
});

// 1 缓存下来 如何缓存 怎么实现

const moveBox = (id: string, left: number, top: number) => {
  Object.assign(getCurrentDesk.value[id], { left, top }); // 现在我们可以安全地合并对象
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
    if (snapToGridAfterDrop.value) {
      [left, top] = doSnapToGrid(left, top);
    }
    moveBox(item.id, left, top);
    return undefined;
  },
}));
</script>

<template>
    <div :ref="drop" class="container">
      <!-- <Container
        :snap-to-grid="snapToGridAfterDrop"
        :desk="desk"
        :currentDesk="currentDesk"
      /> -->
      <DraggableBox
        v-for="data in getCurrentDesk"
        :id="data.id"
        :key="data.id"
        :left="data.left"
        :top="data.top"
        :data="data"
        :currentDesk="currentDesk"
      >
        <template #item="{ data }">
          <slot name="item" :data="{ data }">{{ data  }} </slot>
        </template>
        <!-- <template #item="{ item }">
          <slot name="item" :item="item"> </slot>
        </template> -->
      </DraggableBox>
    </div>
    <CustomDragLayer :snap-to-grid="snapToGridWhileDragging" />
    <!-- <p>
      <label for="snapToGridWhileDragging">
        <input
          id="snapToGridWhileDragging"
          type="checkbox"
          :checked="snapToGridWhileDragging"
          @change="handleSnapToGridWhileDraggingChange"
        />
        <small>Snap to grid while dragging</small>
      </label>
      <br />
      <label for="snapToGridAfterDrop">
        <input
          id="snapToGridAfterDrop"
          type="checkbox"
          :checked="snapToGridAfterDrop"
          @change="handleSnapToGridAfterDropChange"
        />
        <small>Snap to grid after drop</small>
      </label>
    </p> -->
</template>

<style scoped lang="less">
.container {
  position: relative;
  width: 100%;
  height:  100%;
  border: 1px solid black;
}
</style>
