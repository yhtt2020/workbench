<template>
    <div class="w-[56px] h-[56px] rounded-xl  flex-center pointer" @click="addIcon"
        style="border: 1px dashed var(--active-bg) ;background-color: var(--active-secondary-bg);">
            <navIcon icon="fluent:add-16-regular" style="font-size: 28px; color: var(--active-bg)" />
    </div>
    <div class=" rounded-xl xt-bg flex-center pointer" :class="widthHeight" @click="completeEdit">
        <xt-button :w="24" :h="24" @click="completeEdit">
            <div class="w-[24px] h-[24px] rounded-xl flex-center " style="background-color: var(--active-bg);">
                <navIcon icon="fluent:checkmark-16-regular" class="text-base" style="color: rgba(255, 255, 255, 0.85) !important;"/>
            </div>
        </xt-button>

    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, computed } from 'vue'
import { Icon as navIcon } from '@iconify/vue';
const emit = defineEmits(['addIcon','completeEdit'])
const props = defineProps({
    position: String,
    default: 'foot'
})
const addIcon = () => {
    emit('addIcon')
}
const completeEdit = () => {
    emit('completeEdit')
}
const widthHeight = computed(() => {
    if (props.position === 'foot') {
        return `w-[32px] h-[56px] ml-3 mr-3`
    } else {
        return `w-[56px] h-[32px] mt-3 mb-3`
    }
})
</script>
<style lang='scss' scoped>
.flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
}
</style>