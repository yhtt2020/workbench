<template>
    <Dock
        v-model:isOpen="folderVisible"
        :iconSize="44"
        :customClass="'h-[64px]'"
        :gap="16"
        @edit="editIcon"
        @getDelIcon="getDelIcon"
        @control="control">
    </Dock> 
    
</template>

<script setup lang='ts'>
import { ref, watch } from 'vue'

import Dock from '../bottomPanel/Dock.vue';

const emit = defineEmits(['edit','getDelIcon','update:folderVisible'])

const folderVisible = ref(false)

// 编辑图标状态
const editIcon = (id) => {
    emit('edit',id)
}

// 更新删除状态
const getDelIcon = (val) => {
    emit('getDelIcon',val)
}

// 点击控制中心
const control = (val) => {
    emit('edit',val)
}

// 更新文件夹打开状态
watch(
    () => folderVisible.value, 
    (val) => {
        emit('update:folderVisible', val)
    }
)


</script>
<style lang='scss' scoped></style>