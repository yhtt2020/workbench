<template>
    <SettingModal @setQuick="setQuick">
        <template #custom>
            <CoolApp></CoolApp>
        </template>
        <template #exterior>
            <CustomBg></CustomBg>
        </template>
    </SettingModal>
</template>

<script setup lang='ts'>
import { ref, reactive,computed } from 'vue'
import SettingModal from '../SettingModal.vue' 
import Custom from './Children/Custom.vue';
import CustomBg from './Children/CustomBg.vue';
import Common from './Children/Common.vue';
import CoolApp from './Children/CoolApp.vue';
const emit = defineEmits(['setQuick'])
const setQuick = () => {
    emit('setQuick')
}
const title = computed(()=>{
    return '当前图标为「轻应用」类型，暂无可编辑属性。'
})
</script>
<style lang='scss' scoped></style>