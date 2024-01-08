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
const iconStore = myIcons();
const { iconOption } = storeToRefs(iconStore);
const handleDrop = async (dragEvent) => {
  dragEvent.preventDefault();
  let files = dragEvent.dataTransfer.files;

  if (!files || files.length <= 0) return;
  for (let file of files) {
    let fileImage = await tsbApi.system.extractFileIcon(file.path);
    console.log("file :>> ", file);
    const obj = {
      ...iconOption,
      open: {
        type: "tableApp",
        value: file.path,
      },
      titleValue: file.name,
      src: fileImage,
    };

    // fileInfo.name = file.name;
    // fileInfo.value = file.path;
    // fileInfo.icon = fileImage;
    // fileInfo.type = 'tableApp';

    useAddCard("myIcons", {
      iconList: [{ ...obj }],
    });
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
