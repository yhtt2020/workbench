<template>
  <div
    class="w-full h-full"
    @drop="handleDrop"
    @dragover.prevent="handleDragover"
    @dragenter.prevent
    @dragleave.prevent="handleDragleave"
    @mouseup="handleMouseup"
    @mouseleave="handleMouseleave"
    @mouseover="handleMouseover"
  >
    <slot></slot>
  </div>
</template>
<script></script>
<script setup>
import { storeToRefs } from "pinia";
import { useFolderStore } from "../store";
import { myIcons } from "../../../../store/myIcons";
import { inject } from "vue";
import { defaultData } from "./options";

// 获取图标数据
const icon = myIcons();
const { isDrag: myIconDrag, iconList, iconsRefs } = storeToRefs(icon);

// 获取文件夹数据
const folderStore = useFolderStore();
const { dragId, isDrag, isEnter, isOver, currentId, currentData } =
  storeToRefs(folderStore);
const index = inject("index", "");
const data = inject("data", "");
const emits = defineEmits(["updateFile", "deleteFile"]);

/**
 * 处理拖拽内容放置
 */
const handleDrop = async (dragEvent) => {
  if (data.value.model !== "custom") return;
  dragEvent.preventDefault();
  if (dragId.value == index.value) return;
  /**
   * 属于拖拽状态 说明来自其他文件夹
   */
  if (isDrag.value) {
    emits("updateFile", { ...currentData.value, id: Date.now() });
    return;
  }
  let files = dragEvent.dataTransfer.files;
  if (!files || files.length <= 0) return;

  for (let file of files) {
    let fileInfo = {
      ...defaultData,
      id: Date.now(),
    };
    let fileImage = await tsbApi.system.extractFileIcon(file.path);
    fileInfo.name = file.name;
    fileInfo.value = file.path;
    fileInfo.icon = fileImage;
    emits("updateFile", fileInfo);
  }
};

/**
 * 处理拖拽内容进入
 */
const handleDragover = (dragEvent) => {
  dragEvent.preventDefault();
  currentId.value = index.value;
};

/**
 * 处理拖拽内容离开
 */
const handleDragleave = () => {
  currentId.value = "";
};
/**
 * 处理图标组件放置
 */
const handleMouseup = () => {
  if (data.value.model !== "custom") return;
  if (!myIconDrag.value) return;
  if (iconList.value.length < 1) return;

  // 新数据处理
  iconList.value.forEach((item) => {
    const file = {
      ...defaultData,
      id: Date.now() + Math.random() * 50,
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

    emits("updateFile", file);
  });

  // 旧数据删除
  if (iconsRefs.value.length < 1) return;
  iconsRefs.value.forEach((item) => {
    item.doRemoveCard();
  });
};

/**
 * 处理图标离开
 */
const handleMouseleave = () => {};

/**
 * 处理图标进入
 */
const handleMouseover = () => {
  isOver.value = false;
  isEnter.value = true;
};
</script>

<style lang="scss" scoped></style>
