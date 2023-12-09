<template>
    <div class="w-[452px]">
        <SliderList :sliderList="navSize" @change="changeNav" @reset="resetNav"></SliderList>
        <SliderList :sliderList="sliderList" @change="changeSlider" @reset="resetSlider"></SliderList>
        <CustomIconBg :colorSwitch="navigationStore.navColorSwitch"
            @update:colorSwitch="navigationStore.navColorSwitch = !navigationStore.navColorSwitch" @changeBg="changeBg">
        </CustomIconBg>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import { useNavigationStore } from '../../navigationStore'
import CustomIconBg from '../EditIcon/Children/CustomIconBg.vue';
import SliderList from './SliderList.vue';
const navigationStore = useNavigationStore()
const sliderList = ref([
    {
        title: '导航栏圆角',
        min: 1,
        max: 80,
        value: navigationStore.navRadius,
        step: 2
    },
    {
        title: '图标圆角',
        min: 1,
        max: 52,
        value: navigationStore.iconRadius,
        step: 2

    },
])
const navSize = ref([
    {
        title: '导航栏尺寸',
        min: 1,
        max: 300,
        value: navigationStore.navSize,
        step: 10
    }
])
const changeBg = (value) => {
    console.log(value, '====>>>>');
}
const resetNav = (item, index) => {
    item.value = '100%'
    navigationStore.navSize = '100%'
}
const changeNav = (value) => {
    navigationStore.navSize = value
}
const changeSlider = (value) => {
    console.log(value, '====>>>>');
}
const resetSlider = (item, index) => {
    console.log(item,index,'====>>>>')
}
</script>
<style lang='scss' scoped></style>