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

import { useDeskStore } from "../../../../components/desk/store";

// 获取桌面数据
const deskStore = useDeskStore();

const emits = defineEmits(["deleteFile",'updatePosition']);

const index = inject("index", "");
const data = inject("data", "");
const isOutside = inject("isOutside", "");
const folderStore = useFolderStore();
const { dragId, isDrag, move, currentId, currentData } =
  storeToRefs(folderStore);
const props = defineProps({
  data: {},
});
/**
 * 文件托起
 */
const handleDragStart = (event) => {
  move.value = false
  isDrag.value = true;
  dragId.value = index.value;
  currentId.value = index.value;
  currentData.value = props.data;
};
// const handleDragLeave = (event) => {
//   console.log("handleDragLeave :>> ");
// };
// const handleDragEnter = (event) => {
//   console.log("handleDragEnter :>> ");
// };
// 文件拖拽弹起
const handleDragEnd = (event) => {
  // if (data.value.sort === "free") return;
  if (data.value.model !== "custom") {
    return;
  }
  // 判断托起的文件所属文件夹ID与当前文件夹ID是否一致
  if (!isOutside.value) {
    return;
  }

    console.log('move.value :>> ',move.value);
  if (!move.value) {
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
