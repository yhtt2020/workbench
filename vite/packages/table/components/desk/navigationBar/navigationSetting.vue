<template>
    <SettingModal @setQuick="setQuick" >
        <template #custom>
            <NavSetting></NavSetting>
        </template>
        <template #exterior>
            <NavSize></NavSize>
        </template>
    </SettingModal>
</template>

<script setup lang='ts'>
import { ref,onMounted,onBeforeUnmount } from 'vue'
import NavSetting from './components/setting/NavSetting.vue'
import NavSize from './components/setting/NavSize.vue'
import SettingModal from './components/SettingModal.vue'
const emit=defineEmits(['setQuick'])
const setQuick=()=>{
    emit('setQuick')
}

</script>
<style lang='scss' scoped></style>