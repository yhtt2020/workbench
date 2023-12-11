<template>
    <div :style="{height:windowHeight+'px',width:windowWidth+'px'}">
        <SliderList :sliderList="navSize" @change="changeNav" @reset="resetNav"></SliderList>
        <SliderList :sliderList="sliderList" @change="changeSlider" @reset="resetSlider"></SliderList>
        <CustomIconBg :colorSwitch="navigationStore.navColorSwitch"
            @update:colorSwitch="navigationStore.navColorSwitch = !navigationStore.navColorSwitch" @changeBg="changeBg">
        </CustomIconBg>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive,onMounted,onBeforeUnmount } from 'vue'
import { useNavigationStore } from '../../navigationStore'
import CustomIconBg from '../EditIcon/Children/CustomIconBg.vue';
import SliderList from './SliderList.vue';
const navigationStore = useNavigationStore()
const sliderList = ref([
    {
        title: '导航栏圆角',
        min: 0,
        max: 80,
        value: navigationStore.navRadius,
        step: 2,
        flag:'nav'
    },
    {
        title: '图标圆角',
        min: 0,
        max: 52,
        value: navigationStore.iconRadius,
        step: 2,
        flag:'icon'
    },
])
const navSize = ref([
    {
        title: '导航栏尺寸',
        min: 100,
        max: 300,
        value: navigationStore.navSize,
        step: 10
    }
])
/**
 * 
 * @param value 背景颜色
 */
const changeBg = (value) => {
    console.log(value, '====>>>>');
}
const resetNav = (item, index) => {
    item.value = 100
    navigationStore.navSize = 100
}
const changeNav = (value) => {
    navigationStore.navSize = value.value
}
// 修改导航栏和图标圆角
const changeSlider = (value) => {
    if(value.flag==='nav'){
        navigationStore.navRadius = value.value
    }else if(value.flag==='icon'){
        navigationStore.iconRadius = value.value
    }

}
// 重置导航栏和图标圆角
const resetSlider = (item, index) => {
    if(index===0){
        navigationStore.navRadius = 18
        item.value = 18
    }else if(index===1){
        navigationStore.iconRadius = 12
        item.value = 12
    }
}
const windowHeight=ref(480)
const windowWidth=ref(460)
const handleResize = () => {
    const currentHeight = window.innerHeight
    if(currentHeight>900){
        windowHeight.value=610
        windowWidth.value=460
    }else{
        windowHeight.value=480
        windowWidth.value=460
    }
}
onMounted(()=>{
    handleResize()
    window.addEventListener('resize', handleResize)
})
onBeforeUnmount(()=>{
    window.removeEventListener('resize', handleResize)
})
</script>
<style lang='scss' scoped></style>