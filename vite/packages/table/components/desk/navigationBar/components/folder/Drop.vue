<template>
  <div 
    class="h-full max-w-full" 
    @drop="handleDrop" 
    @dragover="handleDragover" 
    @dragenter="handleDragenter" 
    ref="target"
    @mouseenter="handleEnter"
    >
    <slot></slot>
  </div>
</template>
<script></script>
<script setup>
import { nanoid } from "nanoid";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useFolderStore } from "../../../../../apps/folder/src/store";
import { useDeskStore } from "../../../../../components/desk/store";
import { useIconConversionNav } from "../../../../../apps/folder/src/hooks/useDataConversion";
import {useMouseInElement} from "@vueuse/core"

const deskStore = useDeskStore();
const {isEnterBar} = storeToRefs(deskStore);
// const targetRef = ref(null);
// const { isOutside } = useMouseInElement(targetRef);
// console.log(isOutside,'isOutSide');

const folderStore = useFolderStore();
const { dragId, isDrag, move, currentId, currentData } =
  storeToRefs(folderStore);

const emit = defineEmits(['createFile'])
const handleDrop = async (dragEvent) => {
  let files = dragEvent.x
  console.log(currentData.value,files,'currentData.value')
  const data = useIconConversionNav(currentData.value)
  emit('createFile',data,files)
  isEnterBar.value = false;
};
const handleDragenter = (dragEvent) => {
  isEnterBar.value = true;
  // dragEvent.preventDefault();
};

const handleDragover = (dragEvent) => {
  isEnterBar.value = false
  // dragEvent.preventDefault();
};
</script>
  
<style lang="scss" scoped></style>
  