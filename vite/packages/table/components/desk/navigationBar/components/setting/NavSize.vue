<template>
    <div class="w-[452px]">
        <SliderList :sliderList="navSize"></SliderList>
        <SliderList :sliderList="sliderList"></SliderList>
        <CustomIconBg></CustomIconBg>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import { useNavigationStore } from '../../navigationStore'
import CustomIconBg from '../EditIcon/Children/CustomIconBg.vue';
import SliderList from './SliderList.vue';
const navigationStore = useNavigationStore()
const sliderList=ref([
    {
        title: '导航栏圆角',
        min: 1,
        max: 80,
        value: navigationStore.navRadius,
        step:2
    },
    {
        title: '图标圆角',
        min: 1,
        max: 52,
        value: navigationStore.iconRadius,
        step:2

    },
])
const navSize=ref([
    {
        title:'导航栏尺寸',
        min:1,
        max:300,
        value:navigationStore.navSize,
        step:10
    }
])
</script>
<style lang='scss' scoped>
.input{
    margin-left: 16px !important;
    height: 40px !important;
    width: 80px !important;
    border-radius: 12px !important;
    border: 1px solid var(--divider) !important;
}
</style>