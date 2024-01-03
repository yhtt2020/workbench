<template>
    <div :style="{ height: windowHeight + 'px', width: windowWidth + 'px' }">
        <!-- <SliderList :sliderList="navSize" @change="changeNav" @reset="resetNav"></SliderList>
        <SliderList :sliderList="sliderList" @change="changeSlider" @reset="resetSlider"></SliderList> -->
        <div class="w-full p-4 mb-4 xt-bg-2 rounded-xl">
            <xt-option-info title="导航栏尺寸" icon="fluent:arrow-clockwise-16-regular"
                @onIconClick="navigationStore.navAttribute.navSize = 100" />
            <xt-option-slider v-model:slider="navigationStore.navAttribute.navSize" :min="0" :max="300" />
        </div>
        <div class="w-full p-4 mb-4 xt-bg-2 rounded-xl">
            <xt-option-info title="导航栏圆角" icon="fluent:arrow-clockwise-16-regular"
                @onIconClick="navigationStore.navAttribute.navRadius = 18" />
            <xt-option-slider v-model:slider="navigationStore.navAttribute.navRadius" :min="0" :max="80" />
            <hr />
            <xt-option-info title="图标圆角" icon="fluent:arrow-clockwise-16-regular"
                @onIconClick=" navigationStore.iconRadius = 12" />
            <xt-option-slider v-model:slider=" navigationStore.iconRadius" :min="0" :max="52" />
        </div>

        <CustomIconBg :colorSwitch="navigationStore.navColorSwitch" :tip="'通用的图标背景色，仅支持选了icon和emoji的图标背景。'"
            @update:colorSwitch="navigationStore.navColorSwitch = !navigationStore.navColorSwitch" @changeBg="changeBg">
        </CustomIconBg>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted, onBeforeUnmount, computed } from 'vue'
import { useNavigationStore } from '../../navigationStore'
import { navStore } from '../../../../../store/nav';
import CustomIconBg from '../EditIcon/Children/CustomIconBg.vue';
const navigationStore = useNavigationStore()
const useNavStore = navStore()
const changeBg = (value) => {
    console.log(value, '====>>>>');
    navList.value.forEach((item) => {
        if (item.isBg) {
            item.bg = value;
        }
        console.log(item, 'item==>>');

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
const windowHeight = ref(480)
const windowWidth = ref(460)
const handleResize = () => {
    const currentHeight = window.innerHeight
    if (currentHeight > 850) {
        windowHeight.value = 610
        windowWidth.value = 460
    } else {
        windowHeight.value = 480
        windowWidth.value = 460
    }
}
onMounted(() => {
    handleResize()
    window.addEventListener('resize', handleResize)

})
onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
})
</script>
<style lang='scss' scoped></style>