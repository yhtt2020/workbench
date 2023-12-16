<template>
    <div class="w-[452px] h-[40px] mb-4">
        <div class="flex items-center justify-center w-full h-full xt-bg-2 rounded-xl">{{ props.title }}</div>
    </div>
    <EditName :editItem="props.editItem"></EditName>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import EditName from './EditName.vue';
export interface titleProps {
    title: string
    editItem: object
}
const props = withDefaults(defineProps<titleProps>(), {
    title: '',
    editItem: () => ({})
})
</script>
<style lang='scss' scoped></style>