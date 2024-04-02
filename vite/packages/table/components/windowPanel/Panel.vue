<template>
    <Dock
        :iconSize="44"
        :customClass="'h-[64px]'"
        :gap="16"
        @edit="editIcon"
        @getDelIcon="getDelIcon"
        @control="control">
    </Dock> 
    
</template>

<script setup lang='ts'>
import { ref, defineAsyncComponent } from 'vue'

import Dock from '../bottomPanel/Dock.vue';

const emit = defineEmits(['edit','getDelIcon'])

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


</script>
<style lang='scss' scoped></style>