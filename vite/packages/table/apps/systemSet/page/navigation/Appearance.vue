<template>
    <div class="w-full h-full">
        <xt-option-box>
            <xt-option-info title="导航栏尺寸" icon="fluent:arrow-clockwise-16-regular"
                @onIconClick="navAttribute.navSize = 100" />
            <xt-option-slider v-model:slider="navAttribute.navSize" :min="0" :max="300" />
        </xt-option-box>
        <xt-option-box>
            <xt-option-info title="导航栏圆角" icon="fluent:arrow-clockwise-16-regular"
                @onIconClick="navAttribute.navRadius = 18" />
            <xt-option-slider v-model:slider="navAttribute.navRadius" :min="0" :max="80" />
            <hr />
            <xt-option-info title="图标圆角" icon="fluent:arrow-clockwise-16-regular"
                @onIconClick="iconRadius = 12" />
            <xt-option-slider v-model:slider=" iconRadius" :min="0" :max="52" />
        </xt-option-box>
        <xt-option-box>
            <xt-option-info 
                title="自定义图标背景色"
                isSwitch="true"
                v-model:switch="navColorSwitch"
                info="通用的图标背景色，仅支持选了icon和emoji的图标背景。"    
            />
            <xt-option-color
                v-if="navColorSwitch"
                v-model:color="color"
                @cb="changeBg" />
        </xt-option-box>
    </div>
</template>

<script setup lang='ts'>
import { ref, computed } from 'vue'
import {storeToRefs} from 'pinia'
import { useNavigationStore } from '../../../../components/desk/navigationBar/navigationStore'
import { navStore } from '../../../../store/nav';

// 导航栏属性--导航栏尺寸、导航栏圆角、图标圆角
const navigationStore = useNavigationStore()
const { navAttribute, iconRadius,navColorSwitch } = storeToRefs(navigationStore)

// 导航栏数据
const useNavStore = navStore()
const {copyFootNav,sideNavigationList,rightNavigationList} = storeToRefs(useNavStore)

const color = ref('')

// 获取当前存在的导航中的图标
const navList = computed(() => {
    const list = [sideNavigationList.value, rightNavigationList.value, copyFootNav.value];
    const arr = useNavStore.navigationToggle.reduce((accumulator, item, index) => {
        if (item) {
            accumulator.push(...list[index])
        }
        return accumulator;
    }, []);
    return arr
});

// 修改所有自定义图标的背景颜色
const changeBg = (value) => {
    navList.value.forEach((item) => {
        if (item.isBg) {
            item.bg = value;
        }
    });
};

</script>
<style lang='scss' scoped></style>