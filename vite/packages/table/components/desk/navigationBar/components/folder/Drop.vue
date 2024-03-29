<template>
  <div :class=[dropClass]
      @drop="handleDrop"
      @dragover="handleDragover"
      @dragenter="handleDragenter"
      @dragleave="handleDragleave"
      ref="target"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseleave"
      @mouseover="handleMouseover"
      @mouseenter="handleMouseEnter">
    <slot></slot>
  </div>
</template>
<script></script>
<script setup>
import { nanoid } from "nanoid";
import { ref, computed,watch,provide } from "vue";
import { storeToRefs } from "pinia";
import { useFolderStore } from "../../../../../apps/folder/src/store";
import { useDeskStore } from "../../../../../components/desk/store";
import { useNavBarStore } from '../../navBar'
import { useNavigationStore } from '../../navigationStore'
import {
  useIconConversionNav,
  useFileConversionNav,
  useDeskConversionNav,
  useLinkConversionNav } from "../../../../../apps/folder/src/hooks/useDataConversion";
import { myIcons } from "../../../../../store/myIcons";
import _ from 'lodash-es'
import { getFavicon } from "../../hook/getUrlName";
import { useMouseInElement } from '@vueuse/core'

const target = ref(null);
const isNavBar = ref(false)
isNavBar.value = useMouseInElement(target);
watch(()=>isNavBar.value.isOutside,(newV,oldV)=>{
  isEnterDesk.value = newV
})
// 导航栏数据
const navBarStore = useNavBarStore()
const { navBarId, navBarItem,isEnterDesk } = storeToRefs(navBarStore)
const navigationStore = useNavigationStore()
const { customOpenNav, isLeaveBar } = storeToRefs(navigationStore)

// 桌面数据
const deskStore = useDeskStore();
const { isEnterBar } = storeToRefs(deskStore);

// 文件夹数据
const folderStore = useFolderStore();
const { dragId, isDrag, move, currentId, currentData, folderFlag } =
  storeToRefs(folderStore);

// 图标数据
const useIconStore = myIcons()
const { isDrag: iconDrag,iconList, iconsRefs } = storeToRefs(useIconStore)

const emit = defineEmits(['createFile'])

const props = defineProps({
  currentId: String,
  dropClass: 'h-full max-w-full'
})

/**
 * 拖拽，文件夹拖拽和桌面图标拖拽
 * @param {*} dragEvent
 */
const handleDrop = async (dragEvent) => {
  // 判断是否是从导航栏外部进入到导航栏，防止和导航栏内部的拖拽事件冲突
  if (!isEnterBar.value) return
  let currentX = dragEvent
  if (isEnterBar.value && navBarId.value && navBarId.value !== props.currentId) {
    emit('createFile', navBarItem.value, currentX)
  }
  // 桌面拖拽
  if (folderFlag.value !== 'folder') {
    let files = dragEvent.dataTransfer.files
    let link = dragEvent.dataTransfer.getData('text/plain')
    if (files && files.length > 0) {
      await handleFileDrop(dragEvent, currentX)
    }else if(link && link !== ''){
      await handleLinkDrop(dragEvent, currentX)
    }
  } else if (dragEvent.dataTransfer?.types.some((item) => item === 'text/plain')) {
    handleFolderIconDrop(currentX)
  }
  isEnterBar.value = false;
};

/**
 * 拖拽进入事件
 * @param {*} dragEvent
 */
const handleDragenter = (dragEvent) => {
  // console.log('拖拽进入','<<<<<<<<<+++=====')
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

const handleDragleave = (dragEvent) => {
  console.log('我已经离开了')
  // isEnterBar.value = true;
}

/**
 * 鼠标弹起事件
 */
const handleMouseUp = (e) => {
  let isCtrl = e.ctrlKey
  if(!isDragIcon.value) return;
  iconList.value.forEach((item) => {
    const file = useFileConversionNav(item)
    emit('createFile', file, e)
  })
  // 2 旧数据删除
  if (iconsRefs.value.length < 1) return;
  if(!isCtrl){
    iconsRefs.value.forEach((item) => {
      item.doRemoveCard();
    });
  }
  iconsRefs.value = [];
  iconList.value = [];
}
const handleMouseleave = (dragEvent) => {
  // console.log("鼠标离开 :>> ");
  isDragIcon.value = false;
};
const handleMouseover = (dragEvent) => {
  // console.log("鼠标进入 :>> ");
  if (iconDrag.value) {
    isDragIcon.value = true;
  }
};

const handleMouseEnter = (e) => {
}

// 防止桌面图标移动时，触发其他事件
let isDragIcon = ref(false)

// 处理拖拽进入的图标名字
const getFileName = (name) => {
  if (typeof name === 'string') {
    const lastDotIndex = name.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      const fileName = name.substring(0, lastDotIndex);
      return fileName;
    } else {
      return name;
    }
  } else {
    return null;
  }
};

/**
 * 拖拽文件
 */
const handleFileDrop = async (dragEvent, currentX) => {
  const files = dragEvent.dataTransfer.files;

  if (files && files.length > 0) {
    const filesArr = Array.from(files).map(file => file.path);
    const pathLib=require('path')
    const fs = require('fs');

    await Promise.all(filesArr.map(async (item) => {
      console.log('执行路径B,普通文件','cwd',item)
      const stat = fs.lstatSync(item);
      let isDir=stat.isDirectory()
      let  fileName=''
      if(isDir){
        fileName=pathLib.basename(item)
      }else{
        fileName =pathLib.basename(item,pathLib.extname(item))
      }
      const dropFiles = await tsbApi.system.extractFileIcon(item);
      const file = useDeskConversionNav(dropFiles, fileName, item);
      emit('createFile', file, currentX);
    }));
  }
};

/**
 * 拖拽链接
 * @param {*} dragEvent
 * @param {*} currentX
 */
const handleLinkDrop = async (dragEvent, currentX) => {
  let link = dragEvent.dataTransfer.getData('text/plain');

  if (link && link !== '') {
    const http = link.includes('http');
    const https = link.includes('https');

    if (!http && !https) {
      link = 'http://' + link;
    }

    const linkIcon = await getFavicon(link);
    // const name = useGetUrlName(link);
    const target = { name:linkIcon.pageTitle, icon: linkIcon.faviconURL, value: link };

    const file = useLinkConversionNav(target);
    emit('createFile', file, currentX);
  }
};

/**
 * 拖拽文件夹中的图标
 */
const handleFolderIconDrop = (currentX) => {
  move.value = true;
  const item = _.cloneDeep(currentData.value);
  const data = useIconConversionNav(item);
  emit('createFile', data, currentX);
  currentData.value = '';
  folderFlag.value = '';
};
</script>

<style lang="scss" scoped></style>
