<template>
  <div 
    class="h-full max-w-full" 
    @drop="handleDrop" 
    @dragover="handleDragover" 
    @dragenter="handleDragenter" 
    ref="target"
    @mouseup="handleMouseUp" 
    @mouseleave="handleMouseLeave" 
    @mouseover="handleMouseOver">
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
import { useIconConversionNav, useFileConversionNav, useDeskConversionNav } from "../../../../../apps/folder/src/hooks/useDataConversion";
import { useMouseInElement } from "@vueuse/core"
import { myIcons } from "../../../../../store/myIcons";
import _ from 'lodash-es'

// 桌面数据
const deskStore = useDeskStore();
const { isEnterBar } = storeToRefs(deskStore);

// 文件夹数据
const folderStore = useFolderStore();
const { dragId, isDrag, move, currentId, currentData } =
  storeToRefs(folderStore);

// 图标数据
const useIconStore = myIcons()
const { iconList, iconsRefs } = storeToRefs(useIconStore)

const emit = defineEmits(['createFile'])

/**
 * 拖拽，文件夹拖拽和桌面图标拖拽
 * @param {*} dragEvent 
 */
const handleDrop = async (dragEvent) => {
  // 判断是否是从导航栏外部进入到导航栏，防止和导航栏内部的拖拽事件冲突
  if (!isEnterBar.value) return
  let currentX = dragEvent.x
  // 桌面拖拽
  if (dragEvent.dataTransfer.types[0] === 'Files') {
    let files = dragEvent.dataTransfer.files
    let filesArr = []
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        filesArr.push(files[i].path)
      }
    }
    await Promise.all(filesArr.map(async (item) => {
      const fileName = item.substring(item.lastIndexOf('\\') + 1)
      let dropFiles = await tsbApi.system.extractFileIcon(item)
      let file = useDeskConversionNav(dropFiles, fileName, item)
      emit('createFile', file, currentX)
    }))
  } 
  // 文件夹图标拖拽
  else if( dragEvent.data.types[0] === 'text/plain' ) {
    const item = _.cloneDeep(currentData.value)
    const data = useIconConversionNav(item)
    emit('createFile', data, currentX)
  }
  isEnterBar.value = false;
};

/**
 * 拖拽进入事件
 * @param {*} dragEvent 
 */
const handleDragenter = (dragEvent) => {
  if (dragEvent.dataTransfer.types.length > 0) {
    console.log(dragEvent.dataTransfer.types[0], 'name')
    isEnterBar.value = true;
  }
};

/**
 * 
 * @param {*} dragEvent 
 */
const handleDragover = (dragEvent) => {
  dragEvent.preventDefault();
};

/**
 * 鼠标弹起事件
 */
const handleMouseUp = (e) => {
  iconList.value.forEach((item) => {
    const file = useFileConversionNav(item)
    emit('createFile', file,e.x)
  })
  // 2 旧数据删除
  if (iconsRefs.value.length < 1) return;
  iconsRefs.value.forEach((item) => {
    item.doRemoveCard();
  });
}
const handleMouseLeave = () => {

}
const handleMouseOver = () => {

}
</script>
  
<style lang="scss" scoped></style>
  