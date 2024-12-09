<template>

    <div
      class="w-full h-full rounded-xl"
      @drop.prevent.stop="handleDrop"
      @dragenter.prevent.stop="handleDragenter"
      @dragleave.prevent.stop="handleDragleave"
      @dragover.prevent
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseleave"
      @mouseover="handleMouseover"
      ref="drop"
    >
      <slot></slot>
    </div>


</template>

<script setup>
import { inject, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { nanoid } from "nanoid";
import { useMouseInElement } from "@vueuse/core";
import {message} from "ant-design-vue"
import { myIcons } from "../../../../store/myIcons";
import { useFolderStore } from "../store";
import { useDeskStore } from "../../../../components/desk/store";

import { defaultData } from "./options";

import { useLinkConversionNav } from "../../../../apps/folder/src/hooks/useDataConversion";
import {
  useGetUrlName,
  getFavicon,
} from "../../../../components/desk/navigationBar/hook/getUrlName";
import { linkDrop } from '../../../../components/desk/navigationBar/hook/useCheckUrl'
import { useNavBarStore } from "../../../../components/desk/navigationBar/navBar";

// 获取桌面数据
const deskStore = useDeskStore();
const { isEnterFolder } = storeToRefs(deskStore);

// 获取文件夹数据
const folderStore = useFolderStore();
const { dragId, isDrag, move, currentId, currentData } =
  storeToRefs(folderStore);
// 获取图标数据
const iconStore = myIcons();
const { isDrag: iconDrag, iconList, iconsRefs } = storeToRefs(iconStore);

// 获取父组件数据
const data = inject("data", "");
const index = inject("index", "");
const isOutside = inject("isOutside", false);
// 自定义事件
const emits = defineEmits(["createFile", "deleteFile", "updateBg"]);

// 获取导航栏数据
const useNavBar = useNavBarStore();
const { navBarId, navBarItem, isLeaveBar, isEnterDesk } =
  storeToRefs(useNavBar);

//
const drop = ref(null);

const props = defineProps({
  stopDrop:{
    type:Boolean,
  }
})

/**
 * 处理drop放置
 */
const handleDrop = async (dragEvent) => {

  if(props.stopDrop) { return }

  console.log("拖拽元素放置 :>> ", dragEvent.dataTransfer.files);
  isEnterFolder.value = false;
  // 非自定义模式禁止图标组件添加
  if (data.value.model !== "custom"){
    message.error('仅支持自定义模式的文件夹拖放，请修改文件夹组件模式后再试。')
    return;
  }

  // 属于文件互相拖拽添加
  if (!isOutside.value && dragId.value && index.value != dragId.value) {
    move.value = true;
    emits("createFile", { ...currentData.value, id: Date.now() });
    return;
  }

  // 导航栏图标拖拽到文件夹
  if (!isOutside.value && navBarId.value && navBarItem.value) {
    if (navBarItem.value.type === "folder") {
      navBarItem.value.children.forEach((item) => {
        emits("createFile", item);
      });
    } else {
      emits("createFile", navBarItem.value);
    }
    isLeaveBar.value = true;
    isEnterDesk.value = false;
    return;
  }

  // 处理系统拖拽进入的文件和链接
  let files = dragEvent.dataTransfer.files;
  let link = dragEvent.dataTransfer.getData("text/plain");
  if (files && files.length > 0) {
    for (let file of files) {
      let fileInfo = {
        ...defaultData,
        id: nanoid(6),
      };
      let fileImage = await tsbApi.system.extractFileIcon(file.path);
      fileInfo.name = file.name;
      fileInfo.value = file.path;
      fileInfo.icon = fileImage;
      fileInfo.type = "tableApp";
      emits("createFile", fileInfo);
    }
  } else if (link && link !== "") {
    if (isDrag.value) return; // 文件夹内部拖拽时阻止事件触发
    const file = await linkDrop(link);
    if(file){
      emits("createFile", file)
    }
  }
};

/**
    @dragover="handleDragover"
 * 处理拖拽内容在放置区移动
 */

/**
 * 处理darg进入
 */
const handleDragenter = (dragEvent) => {
  if(props.stopDrop) { return }
  currentId.value = index.value;
  isEnterFolder.value = true;
  console.log("拖拽元素在放置区移动 :>> ");
};

/**
 * 处理darg离开
 */
const handleDragleave = (dragEvent) => {
  if(props.stopDrop) { return }
  isEnterFolder.value = false;

  // console.log("拖拽元素离开放置区 :>> ");
};

/**
 * 处理鼠标弹起
 */
const handleMouseUp = (e) => {
  if(props.stopDrop) { return }
  // console.log("鼠标弹起 :>> ",e.ctrlKey);
  let isCtrl = e.ctrlKey;
  // 非自定义模式禁止图标组件添加
  if (data.value.model !== "custom") return;

  // 图标组件添加
  // 1 新数据处理

  // if (11) return;
  if (!isDragIcon.value) return;
  iconList.value.forEach((item) => {
    const file = {
      ...defaultData,
      id: nanoid(6),
    };
    file.type = item.open.type;
    file.value = item.open.value;
    file.icon = item.src;
    file.name = item.titleValue;
    file.isName = item.isTitle;
    file.bg = item.backgroundColor;
    file.isBg = item.isBackground;
    file.radius = item.radius;
    file.isRadius = item.isRadius;
    file.iconState = item.imgState;
    file.iconShape = item.imgShape;
    file.cardData = item.cardData
    emits("createFile", file);
  });

  // 2 旧数据删除
  if (iconsRefs.value.length < 1) return;

  console.log("iconsRefs.value.length  :>> ", iconsRefs.value.length);
  if (!isCtrl) {
    iconsRefs.value.forEach((item) => {
      item.removeCard();
    });
  }

  iconList.value = [];
  iconsRefs.value = [];
};

const handleMouseleave = (dragEvent) => {
  // console.log("鼠标离开 :>> ");
  isDragIcon.value = false;
};
const handleMouseover = (dragEvent) => {
  if(props.stopDrop) { return }
  // console.log("鼠标进入 :>> ");
  if (iconDrag.value) {
    isDragIcon.value = true;
  }
};

/**
 * 处理图标离开
 */
const isDragIcon = ref(false);

watch(
  () => isDragIcon.value,
  (val) => {
    emits("updateBg", val);
  }
);

watch(
  () => isOutside.value,
  (val) => {
    if (isDrag.value) {
      isDragIcon.value = !val;
    }
  }
);
watch(
  () => isDrag.value,
  (val) => {
    if (!isDrag.value) {
      isDragIcon.value = false;
    }
  }
);
</script>

<style lang="scss" scoped></style>
