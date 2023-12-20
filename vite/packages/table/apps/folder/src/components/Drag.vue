<template>
  <div draggable="true" @dragstart="handleDragStart" @dragend="handleDragEnd">
    <slot></slot>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useFolderStore } from "../store";
import { inject } from "vue";
// import { useAddCard } from "../hooks/useAddCard";
import { useAddCard } from "../../../../ui/hooks/useAddCard";

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
  // if (data.value.sort === "free") return;
  console.log("1111 :>> ", 1111);
  isDrag.value = true;
  dragId.value = index.value;
  currentId.value = index.value;
  currentData.value = props.data;
};

// 文件拖拽弹起
const handleDragEnd = (event) => {
  console.log("2222 :>> ", 2222);
  // if (data.value.sort === "free") return;
  if (data.value.model !== "custom") return;
  // 判断托起的文件所属文件夹ID与当前文件夹ID是否一致
  if (index.value == currentId.value) return;

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
    // iconList: [{ ...data }]
    // useAddCard(file);
    useAddCard("myIcons", {
      iconList: [{ ...file }],
    });
    emits("deleteFile", props.data);
    return;
  }
  // 判断是否处在当前文件夹
  if (index.value != currentId.value) {
    emits("deleteFile", props.data);
  }
  // 数据回收
  dragId.value = "";
  currentId.value = "";
};
</script>

<style lang="scss" scoped></style>
