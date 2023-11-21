<template>
    <NewModel style="max-width: 1000px; max-height: 720px" :modelValue="modelValue" :nav="true" :header="true" :footer="false" :esc="true" :back="false" @no="modelValue=false" title="" :mask="false">
        <template #nav>
            <div class="xt-bg p-3 " style="border-radius: 12px 0px 0px 12px;width: 185px;height: 100%;">
                <div class=" flex w-full h-[48px] items-center" style="line-height: 48px;">
                    <xt-new-icon icon="fluent:grid-16-regular" size="20" class="xt-text-2 ml-3" />
                    <div class="xt-text text-base ml-4">图标</div>
                </div>
                <div class="w-full h-[1px]  mt-3" style="background: var(--divider);"></div>
                <xt-button v-for="(item,index) in sideBar" style="border-radius: 10px;" :w="160" :h="48" :style="{
                    'background': currentIndex===index ? 'var(--active-secondary-bg)' : 'transparent'
                }" @click="onSelect(index)"
                    class="flex flex-col items-center  mt-2 justify-center text-base xt-text hover-style">
                    <div>
                        {{ item.name }}
                    </div>
                </xt-button>
            </div>

        </template>
        <template #header-left v-if="false">
            <div class="ml-3 xt-bg-2 h-[52px] rounded-xl flex items-center p-4 justify-between">
                <div class="xt-text-2 text-sm">选择你的windows桌面图标，支持多选批量添加。</div>
                <div class=" flex items-center">
                    <div style="color:var(--active-bg)" class="mr-3 pointer">全选</div>
                    <xt-button w="107" h="32" radius="8" style="background: var(--active-bg);">
                        <div class="xt-text flex justify-center items-center ">批量添加(3)</div>
                    </xt-button>
                </div>
                
            </div>
        </template>
        <div class="w-[850px] ml-3 " style="max-height: 520px;">
            <Introduce />
        </div>
    </NewModel>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import NewModel from '../../../ui/new/modal/index.vue'
import Introduce from './components/Introduce.vue'
const modelValue = ref(true)
const currentIndex=ref(0)
const sideBar = ref([
    {
        name: '推荐',
        tag: 'recommendation',
        active:0
    },
    {
        name: '网址导航',
        tag: 'webNavigation',
        active:0
    },
    {
        name: '酷应用',
        tag: 'ColApp',
        active:0
    },
    {
        name: '轻应用',
        tag: 'QingApp',
        active:0
    },
    {
        name: '系统功能',
        tag: 'systemFunction',
        active:0
    },
    {
        name: 'windows',
        tag: 'windows',
        active:0
    },
    {
        name: '自定义',
        tag: 'custom',
        active:0
    },
])
const onSelect=(index:number)=>{
    currentIndex.value=index
}
</script>
<style lang='scss' scoped>
.hover-style{
    &:hover{
        background: var(--active-secondary-bg) !important;
    }
}
</style>