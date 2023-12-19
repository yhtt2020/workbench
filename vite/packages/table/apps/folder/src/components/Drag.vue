<template>
  <div draggable="true" @dragstart="handleDragStart" @dragend="handleDragEnd">
    <slot></slot>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useFolderStore } from "../store";
import { inject } from "vue";
import { useAddCard } from "../hooks/useAddCard";

const emits = defineEmits(["updateFile", "deleteFile"]);

const index = inject("index", "");
const data = inject("data", "");
const folderStore = useFolderStore();
const { dragId, isDrag, isOver, currentId, currentData } =
  storeToRefs(folderStore);
const props = defineProps({
  data: {},
});
/**
 * 文件托起
 */
const handleDragStart = (event) => {
  isDrag.value = true;
  dragId.value = index.value;
  currentId.value = index.value;
  currentData.value = props.data;
};

// 文件拖拽弹起
const handleDragEnd = (event) => {
  if (data.value.model !== "custom") return;
  if (!currentId.value) {
    const file = {
      model: "file",
      size: "mini",
      open: {
        type: currentData.value.type,
        value: currentData.value.value,
      },
      titleValue: currentData.value.name,
      isTitle: currentData.value.isName,
      src: currentData.value.icon,
      isRadius: currentData.value.isRadius,
      radius: currentData.value.radius,
      imgState: currentData.value.iconState,
      imgShape: currentData.value.iconShape,
      isBackground: currentData.value.isBg,
      backgroundColor: currentData.value.bg,
      backgroundIndex: 0,
    };
    useAddCard(file);
    emits("deleteFile", props.data);
    return;
  }
  /**
   * 判断是否处在当前文件夹
   */
  if (index.value != currentId.value) {
    emits("deleteFile", props.data);
  }
  // 数据回收
  dragId.value = "";
  currentId.value = "";
};
</script>

<style lang="scss" scoped></style>
