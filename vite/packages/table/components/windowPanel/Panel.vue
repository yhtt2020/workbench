<template>
    <Dock
        :iconSize="44"
        :customClass="'h-[64px]'"
        :gap="16"
        @edit="editIcon">
    </Dock> 
    
</template>

<script setup lang='ts'>
import { ref, defineAsyncComponent } from 'vue'

import Dock from '../bottomPanel/Dock.vue';

const emit = defineEmits(['edit'])

const editIcon = (id) => {
    emit('edit',id)
}



</script>
<style lang='scss' scoped></style>