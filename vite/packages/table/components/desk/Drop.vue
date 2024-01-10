<template>
  <div
    class="w-full h-full"
    @drop="handleDrop"
    @dragover="handleDragover"
    @dragenter="handleDragenter"
    ref="target"
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

import { useMouseInElement } from '@vueuse/core'
const target = ref(null);

// 自由布局
const freeLayoutStore = useFreeLayoutStore();
const { isFreeLayout, getFreeLayoutData, freeLayoutEnv } =
  storeToRefs(freeLayoutStore);
// 桌面
const deskStore = useDeskStore();
const { isEnterFolder, mouseInElement } = storeToRefs(deskStore);

mouseInElement.value = useMouseInElement(target);
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

      getFreeLayoutData.value[id] = {
        left: offsetX,
        top: offsetY,
        index: 1,
        id,
      };

      setTimeout(() => {
        addCard();
      }, 100);
    } else {
      addCard();
    }
  }
};
const handleDragenter = (dragEvent) => {
  dragEvent.preventDefault();
};

const handleDragover = (dragEvent) => {
  dragEvent.preventDefault();
};
</script>

<style lang="scss" scoped></style>
