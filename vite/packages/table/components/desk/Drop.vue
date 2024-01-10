<template>
  <div
    class="w-full h-full"
    @drop="handleDrop"
    @dragover="handleDragover"
    @dragenter="handleDragenter"
  >
    <slot></slot>
  </div>
</template>
<script></script>
<script setup>
import { nanoid } from "nanoid";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { myIcons } from "../../store/myIcons";
import { useAddCard } from "../../ui/hooks/useAddCard";
import { useDeskStore } from "./store";
import { useFreeLayoutStore } from "./freeLayout/store";

// 自由布局
const freeLayoutStore = useFreeLayoutStore();
const { isFreeLayout, getFreeLayoutData, freeLayoutEnv } =
  storeToRefs(freeLayoutStore);
// 桌面
const deskStore = useDeskStore();
const { isEnterFolder } = storeToRefs(deskStore);
// 图标组件
const iconStore = myIcons();
const { iconOption } = storeToRefs(iconStore);

const handleDrop = async (dragEvent) => {
  if (isEnterFolder.value) return;
  dragEvent.preventDefault();
  let files = dragEvent.dataTransfer.files;

  if (!files || files.length <= 0) return;
  for (let file of files) {
    let fileImage = await tsbApi.system.extractFileIcon(file.path);
    const obj = {
      ...iconOption,
      open: {
        type: "tableApp",
        value: file.path,
      },
      titleValue: file.name,
      src: fileImage,
    };

    let id = Date.now();
    console.log("我提供的id :>> ", id);
    const { offsetX, offsetY } = dragEvent;
    let addCard = () => {
      let currentId = useAddCard(
        "myIcons",
        {
          iconList: [{ ...obj }],
        },
        id
      );
    };
    if (isFreeLayout.value) {
      console.log(" offsetX, offsetY  :>> ", offsetX, offsetY);

      getFreeLayoutData.value[id] = {
        left: offsetX,
        top: offsetY,
        index: 1,
        id,
      };

      setTimeout(() => {
        addCard();
        console.log(
          "freeLayoutData.value[id] 2 :>> ",
          id,
          getFreeLayoutData.value[id]
        );
      }, 100);
    } else {
      addCard();
    }
  }
};
const handleDragenter = (dragEvent) => {
  dragEvent.preventDefault();
  console.log("222 :>> ");
};

const handleDragover = (dragEvent) => {
  dragEvent.preventDefault();

  console.log("333 :>> ");
};
</script>

<style lang="scss" scoped></style>
