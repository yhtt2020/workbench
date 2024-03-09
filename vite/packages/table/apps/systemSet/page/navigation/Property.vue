<template>
    <div class="w-full h-full">
        <xt-option-box>
            <xt-option-info 
                title="导航栏风格（开发中）"
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
                title="主导航"
                isSwitch="true"
                v-model:switch="navigationToggle[2]">
                
            </xt-option-info>
            <hr />
            <xt-option-info 
                title="左侧副导航"
                isSwitch="true"
                v-model:switch="navigationToggle[0]" />
            <hr />
            <xt-option-info 
                title="右侧副导航"
                isSwitch="true"
                v-model:switch="navigationToggle[1]" />
        </xt-option-box>
        <xt-option-box>
            <xt-option-info 
                title="社群导航（开发中）"
                isSwitch="true"
                switch="true"
                info="在专属导航栏中快速访问你的社群应用" />
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
import { ref, reactive, onMounted } from 'vue'
import { navStore } from '../../../../store/nav';
import { useNavigationStore } from '../../../../components/desk/navigationBar/navigationStore';
import { storeToRefs } from 'pinia';

// 导航栏开关
const useNavStore = navStore()
const {navigationToggle} = storeToRefs(useNavStore)

// 用户头像开关
const navBarStore = useNavigationStore()
const {bottomToggle} = storeToRefs(navBarStore)

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

const navStyle = ref('windows')
</script>
<style lang='scss' scoped></style>