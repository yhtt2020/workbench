<template>
    <div 
        ref="folderRef"
        style="position: absolute; z-index: 500 !important;" 
        :style="{ left: `${folderPos.x}px`, top: `${folderPos.y}px`}"
        class="rounded-xl pointer "
        id="folder">
        <Folder 
            @clickFile="clickFile" 
            @update:layout="updateLayout" 
            @update:customSize="updateSize"
            @close="close" 
            :customData="customData" 
            :customIndex="sideKey" 
            :secondary="true"
            :expand="{ disabled: true }" 
            :navBar="{
                resize: false,
                sizeOption: false,
                isDel: true,
                hierarchy: true,
                close: true
            }" 
            :auto="true" 
        />
    </div>
</template>

<script setup lang='ts'>
import { ref, toRefs, onMounted, onUnmounted } from 'vue'
import Folder from '../../../apps/folder/src/Folder.vue';
import { onClickOutside } from '@vueuse/core'
// defineExpose
const props = defineProps({
    // 文件夹定位
    folderPos: {
        type: Object,
        default: () => {
            return {
                x: 0,
                y: 0
            }
        }
    },
    // 文件夹数据
    customData: {
        type: Object,
        default: () => {}
    },
    // 索引
    sideKey: {
        type: String,
        default: ''
    }
})

const { folderPos, customData, sideKey } = toRefs(props)

const emit = defineEmits(['clickFile', 'update:layout', 'update:customSize', 'close'])

const folderRef = ref(null)

const clickFile = (item: any) => {
    emit('clickFile', item)
}
const updateLayout = (data: any) => {
    emit('update:layout', data)
}
const updateSize = (data: any) => {
    emit('update:customSize', data)
}
const close = () => {
    emit('close')
}

// 点击外部关闭
// onMounted(() => {
//     onClickOutside(folderRef, () => {
//         emit('close')
//     })
// })

// onUnmounted(() => {
//     onClickOutside(folderRef, null)
// })
</script>
<style lang='scss' scoped></style>