<template>
  <div :class=[dropClass] @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragenter"
    @dragleave="handleDragleave" ref="target" @mouseup="handleMouseUp" @mouseleave="handleMouseleave"
    @mouseover="handleMouseover" @mouseenter="handleMouseEnter">
    <slot></slot>
  </div>
</template>
<script></script>
<script setup>
import { nanoid } from "nanoid";
import { ref, computed,watch } from "vue";
import { storeToRefs } from "pinia";
import { useFolderStore } from "../../../../../apps/folder/src/store";
import { useDeskStore } from "../../../../../components/desk/store";
import { useNavBarStore } from '../../navBar'
import { useNavigationStore } from '../../navigationStore'
import { useIconConversionNav, useFileConversionNav, useDeskConversionNav,useLinkConversionNav } from "../../../../../apps/folder/src/hooks/useDataConversion";
import { myIcons } from "../../../../../store/myIcons";
import _ from 'lodash-es'
import { getHostAddress } from "../../../../widgets/myIcons/edit/hooks/getHostAddress";
import { useGetUrlName,getFavicon } from "../../hook/getUrlName";

// 导航栏数据
const navBarStore = useNavBarStore()
const { navBarId, navBarItem } = storeToRefs(navBarStore)
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
    let filesArr = []
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        filesArr.push(files[i].path)
      }
      await Promise.all(filesArr.map(async (item) => {
        let fileName = item.substring(item.lastIndexOf('\\') + 1)
        fileName = getFileName(fileName)
        let dropFiles = await tsbApi.system.extractFileIcon(item)
        let file = useDeskConversionNav(dropFiles, fileName, item)
        emit('createFile', file, currentX)
      }))
    }else if(link && link !== ''){
      const http = link.includes('http')
      const https = link.includes('https')
      // console.log(http, 'http', https, 'https')
      if(!http && !https){
        link = 'http://' + link
        console.log(link, 'linkData')

      }
      let linkIcon = await getFavicon(link)
      let name = useGetUrlName(link)
      let target = {name:name,icon:linkIcon,value:link}
      // 链接拖拽
      let file = useLinkConversionNav(target)
      console.log(name, 'file')
      emit('createFile', file, currentX)
    }

  } else if (dragEvent.dataTransfer?.types.some((item) => item === 'text/plain')) {
    // 文件夹图标拖拽
    move.value = true
    const item = _.cloneDeep(currentData.value)
    console.log(item, 'item')
    const data = useIconConversionNav(item)
    emit('createFile', data, currentX)
    currentData.value = ''
    folderFlag.value = ''
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
}
/**
 * 鼠标弹起事件
 */
const handleMouseUp = (e) => {
  if(!isDragIcon.value) return;
  iconList.value.forEach((item) => {
    const file = useFileConversionNav(item)
    emit('createFile', file, e)
  })
  // 2 旧数据删除
  if (iconsRefs.value.length < 1) return;
  iconsRefs.value.forEach((item) => {
    item.doRemoveCard();
  });
  // iconsRefs.value = [];
  // iconList.value = [];
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


let isDragIcon = ref(false)
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

</script>

<style lang="scss" scoped></style>
