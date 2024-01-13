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
import _ from 'lodash-es'
const deskStore = useDeskStore();
const {isEnterBar} = storeToRefs(deskStore);

const folderStore = useFolderStore();
const { dragId, isDrag, move, currentId, currentData } =
  storeToRefs(folderStore);

const emit = defineEmits(['createFile'])
const handleDrop = async (dragEvent) => {
  if(!isEnterBar.value) return
  let files = dragEvent.x
  const item = _.cloneDeep(currentData.value)
  const data = useIconConversionNav(item)
  emit('createFile',data,files)
  isEnterBar.value = false;
};
const handleDragenter = (dragEvent) => {
  console.log(move.value,'move')
  if(dragEvent.dataTransfer.types.length>0){
    isEnterBar.value = true;
  }
};

const handleDragover = (dragEvent) => {
  // isEnterBar.value = false
  // // dragEvent.preventDefault();
  // console.log(isEnterBar.value,'isEnterBar from over');
};
</script>
  
<style lang="scss" scoped></style>
  