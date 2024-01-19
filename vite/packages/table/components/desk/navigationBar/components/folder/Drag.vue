<template>
    <div draggable="true" @dragstart="handleDragStart" @dragend="handleDragEnd">
        <slot></slot>
    </div>
</template>
  
<script setup>
import { storeToRefs } from "pinia";
// import { useAddCard } from "../hooks/useAddCard";

import { useNavBarStore } from '../../navBar'

const navBarStore = useNavBarStore()
const { navBarId, navBarItem } = storeToRefs(navBarStore)
const props = defineProps({
    data: {},
    currentId: ''
});
/**
 * 文件托起
 */
const handleDragStart = (event) => {
    navBarId.value = props.currentId
    navBarItem.value = props.data
    console.log('数据传递成功')
};
// 文件拖拽弹起
const handleDragEnd = (event) => {
    // 判断是否处在当前文件夹
    if (navBarId.value != props.currentId) {
        emits("deleteFile", props.data);
    }
    // 数据回收
    navBarItem.value = "";
    navBarId.value = "";
};
</script>
  
<style lang="scss" scoped></style>
  