<script setup lang="ts">
import { useDrag, DragSourceMonitor } from "vue3-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { toRefs } from "@vueuse/core";
import { onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { ItemTypes } from "./types";
import { useFreeLayoutStore } from "./store";
// 初始化操作
const freeLayoutStore: any = useFreeLayoutStore();
const { dragData } = storeToRefs(freeLayoutStore);

const props = defineProps<{
  id: string;
  left: any;
  top: any;
  data: any;
}>();

const [collect, drag, preview] = useDrag(() => ({
  type: ItemTypes.BOX,
  item: props,
  collect: (monitor: DragSourceMonitor) => ({
    isDragging: monitor.isDragging(),
  }),
  end: (item: any, monitor) => {
    // const dropResult: any = monitor.getDropResult();
    // console.log("dropResult :>> ", dropResult);
    // console.log("item.name :>> ", item);
    // return;
    dragData.value = {}
  },
}));

onMounted(() => {
  preview(getEmptyImage(), { captureDraggingState: true });
});

const { isDragging } = toRefs(collect);
// 拖起开始
watch(isDragging, (newV) => {
  if (newV) {
    console.log("开始托起 :>> ", props.data);
    dragData.value = props.data;
  }
});
</script>

<template>
  <div
    :ref="drag"
    :style="{
      position: 'absolute',
      transform: `translate3d(${data.left}px, ${data.top}px, 0)`,
      opacity: isDragging ? 0 : 1,
      height: isDragging ? 0 : '',
    }"
    role="DraggableBox"
  >
    <slot name="box" :data="data"> </slot>
  </div>
</template>
