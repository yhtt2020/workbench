<template>
    <div class="w-full h-full">
        <xt-option-box>
            <xt-option-info
                title="导航栏风格 "
                info="「macOs风格」导航分为「顶部状态栏」和「底部Dock栏」；「Windows风格」导航将状态栏和主导航栏合并，可以选择显示在顶部或底部。" />
            <xt-option-tab
                style="height: 40px;"
                boxClass="p-1 xt-bg-2"
                :boxStyle="{ 'border-radius': '10px' }"
                :itemStyle="{ 'border-radius': '6px' }"
                v-model="navStyle"
                circle="true"
                :list="styleList" />
        </xt-option-box>
        <xt-option-box>
            <xt-option-info
                :key="date"
                title="主导航"
                isSwitch="true"
                v-model:switch="navigationToggle[2]">
                <template #extra>
                    <xt-option-box :boxClass="'xt-bg'" v-if="navStyle === 'windows'">
                        <xt-option-info
                            title="主导航位置"/>
                        <xt-option-tab
                            style="height: 40px;"
                            boxClass="p-1 xt-bg-2"
                            :boxStyle="{ 'border-radius': '10px' }"
                            :itemStyle="{ 'border-radius': '6px' }"
                            v-model="navPosition"
                            circle="true"
                            :list="mainList" />
                    </xt-option-box>
                </template>
            </xt-option-info>
            <hr />
            <xt-option-info
                :key="date"
                title="左侧副导航"
                isSwitch="true"
                v-model:switch="navigationToggle[0]" />
            <hr />
            <xt-option-info
                :key="date"
                title="右侧副导航"
                isSwitch="true"
                v-model:switch="navigationToggle[1]"/>
        </xt-option-box>
        <xt-option-box>
            <xt-option-info
                title="社群导航"
                isSwitch="true"
                info="在专属导航栏中快速访问你的社群应用" v-model:switch="communityNavVisible"/>
        </xt-option-box>
        <xt-option-box>
            <xt-option-info
                title="用户头像"
                isSwitch="true"
                v-model:switch="bottomToggle[0]"
                info="在导航栏中显示你的头像" />
        </xt-option-box>
    </div>
</template>

<script setup lang='ts'>
import { ref, watch, onMounted, Ref } from 'vue'
import { storeToRefs } from 'pinia';

import { useCheckNav } from "./hook/useCheckNav"

import { navStore } from '../../../../store/nav';
import { useNavigationStore } from '../../../../components/desk/navigationBar/navigationStore';

// 导航栏开关
const useNavStore = navStore()
const {navigationToggle} = storeToRefs(useNavStore)

// 用户头像开关
const navBarStore = useNavigationStore()
const {bottomToggle,communityNavVisible,currentNavFormat,currentNavPosition} = storeToRefs(navBarStore)

// 导航栏风格
const styleList = ref([
    { name: 'macOs风格', value: 'mac' },
    { name: 'Windows风格', value: 'windows'},
])

// 主导航位置
const mainList = ref([
    { name: '顶部', value: 'top' },
    { name: '底部', value: 'bottom' },
])

const navPosition = ref('bottom')

const navStyle = ref('windows')
const date : Ref<number> = ref(0)
const rightDate : Ref<number> = ref(0)

// 初始化
onMounted(() => {
    navStyle.value = currentNavFormat.value
    navPosition.value = currentNavPosition.value
    date.value = Date.now()
})

// 监听导航栏风格
watch(
    () => navStyle.value,
    (val) => {
        currentNavFormat.value = val
        if(val === 'mac') {
            navPosition.value = 'bottom'
        }
    }
)

// 监听主导航位置
watch(
    () => navPosition.value,
    (newVal,oldVal) => {
        currentNavPosition.value = newVal
    }
)

watch(
    () => navigationToggle.value[2],
    (val) => {
        if(!val){
            useCheckNav('foot')
            date.value = Date.now()
        }
    }
)

watch(
    () => navigationToggle.value[0],
    (val) => {
        if(!val){
            // console.log('left',val)
            useCheckNav('left')
            date.value = Date.now()
        }
    }
)

watch(
    () => navigationToggle.value[1],
    (val) => {
        if(!val){
            useCheckNav('right')
            date.value = Date.now()
        }
    }
)
</script>
<style lang='scss' scoped></style>
