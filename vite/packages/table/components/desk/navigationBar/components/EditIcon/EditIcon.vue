<template>
    <SettingModal @setQuick="setQuick">
        <template #custom>
            <component :is="componentId" :title="title" :editItem="editItem"></component>
        </template>
        <template #exterior>
            <CustomBg :editItem="editItem"></CustomBg>
        </template>
    </SettingModal>
</template>

<script setup lang='ts'>
import { ref, reactive,computed } from 'vue'
import { useNavigationStore } from '../../navigationStore'
import SettingModal from '../SettingModal.vue' 
import Custom from './Children/Custom.vue';
import CustomBg from './Children/CustomBg.vue';
import Common from './Children/Common.vue';
import CoolApp from './Children/CoolApp.vue';
const navigationStore = useNavigationStore()
const emit = defineEmits(['setQuick'])
const setQuick = () => {
    emit('setQuick')
}
const title = ref('')
const editItem = computed(()=>{
    return navigationStore.editItem
})
const componentId=computed(()=>{
    switch (editItem.value.type) {
        case 'systemApp':
            title.value = '当前图标为「系统功能」类型。'
            return Common
        case 'coolApp':
            return CoolApp
        case 'lightApp':
            title.value = '当前图标为「轻应用」类型。'
            return Common
        case 'folder':
            title.value = '当前图标为「文件夹」类型。'
            return Common
        default:
            return Custom
    }
})
</script>
<style lang='scss' scoped></style>