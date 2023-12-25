<template>
    <div :style="{height:windowHeight+'px',width:windowWidth+'px'}">
        <SliderList :sliderList="navSize" @change="changeNav" @reset="resetNav"></SliderList>
        <SliderList :sliderList="sliderList" @change="changeSlider" @reset="resetSlider"></SliderList>
        <CustomIconBg :colorSwitch="navigationStore.navColorSwitch" :tip="'通用的图标背景色，仅支持选了icon和emoji的图标背景。'"
            @update:colorSwitch="navigationStore.navColorSwitch = !navigationStore.navColorSwitch" @changeBg="changeBg">
        </CustomIconBg>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive,onMounted,onBeforeUnmount,computed } from 'vue'
import { useNavigationStore } from '../../navigationStore'
import { navStore } from '../../../../../store/nav';
import CustomIconBg from '../EditIcon/Children/CustomIconBg.vue';
import { workStore } from '../../../../../store/work';
import {cardStore} from '../../../../../store/card'
import SliderList from './SliderList.vue';
const useCardStore=cardStore()
const useWorkStore = workStore()
const navigationStore = useNavigationStore()
const useNavStore = navStore()
const sliderList = ref([
    {
        title: '导航栏圆角',
        min: 0,
        max: 80,
        value: navigationStore.navAttribute.navRadius,
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
        min: 0,
        max: 300,
        value: navigationStore.navAttribute.navSize,
        step: 10
    }
])
const changeBg = (value) => {
    console.log(value, '====>>>>');
    navList.value.forEach((item) => {
        if (item.isBg) {
            item.bg = value;
        }
        console.log(item,'item==>>');
        
    });
};
// 获取当前存在的导航中的图标
const navList = computed(() => {
    const list = [useNavStore.copySideNav, useNavStore.copyRightNav, useNavStore.copyFootNav];
    const arr = useNavStore.navigationToggle.reduce((accumulator, item, index) => {
        if (item) {
            accumulator.push(...list[index])
        }
        return accumulator;
    }, []);
    return arr
});
const resetNav = (item, index) => {
    item.value = 100
    navigationStore.navAttribute.navSize = 100
}
const changeNav = (value) => {
    navigationStore.navAttribute.navSize = value.value
}
// 修改导航栏和图标圆角
const changeSlider = (value) => {
    if(value.flag==='nav'){
        navigationStore.navAttribute.navRadius = value.value
    }else if(value.flag==='icon'){
        navigationStore.iconRadius = value.value
    }

}
// 重置导航栏和图标圆角
const resetSlider = (item, index) => {
    if(index===0){
        navigationStore.navAttribute.navRadius = 18
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
    if(currentHeight>850){
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
    console.log(useWorkStore.deskList,useWorkStore.currentDeskId,'is deskList ? deskList : []');
    console.log(useCardStore.desks,'is deskList ? deskList : []');
    
})
onBeforeUnmount(()=>{
    window.removeEventListener('resize', handleResize)
})
</script>
<style lang='scss' scoped></style>