<template>
    <NewModel style="max-width: 1000px; max-height: 720px" :modelValue="modelValue" :nav="true" :header="true" :footer="false" :esc="true" :back="false" @no="modelValue=false" title="" :mask="false">
        <template #nav>
            <div class="xt-bg p-3" style="border-radius: 12px 0px 0px 12px;width: 185px;height: 100%;">
                <div class=" flex w-full h-[48px] items-center" style="line-height: 48px;">
                    <xt-new-icon icon="fluent:grid-16-regular" size="20" class="xt-text-2 ml-3" />
                    <div class="xt-text text-base ml-4">图标</div>
                </div>
                <div class="w-full h-[1px]  mt-3" style="background: var(--divider);"></div>
                <xt-button v-for="item in sideBar" style="border-radius: 10px;background: transparent;" :w="160" :h="48"
                    class="flex flex-col items-center  mt-2 justify-center text-base xt-text hover-style">
                    <div>
                        {{ item.name }}
                    </div>
                </xt-button>
            </div>

        </template>
        <div class="w-[850px] ml-3 " style="max-height: 520px;">
            <div>
               <div class="flex justify-center"><xt-new-icon icon="fluent-emoji:rocket" size="50"/></div> 
               <div class="flex justify-between xt-bg-2 p-2 rounded-lg mt-5" >
                    <div class="xt-text">你可以直接拖拽Windows系统文件或应用快捷方式到导航栏；我们还为你推荐了以下应用图标供你添加选择。</div>
                    <div class="" style="color:var(--active-bg)">全部添加</div>
               </div>
               
            </div>
            <div class="mt-3 flex flex-wrap">
                <selectIcon v-for="index in 12"/>
            </div>
            
        </div>
    </NewModel>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import NewModel from '../../../ui/new/modal/index.vue'
import selectIcon from './components/selectIcon.vue'
const modelValue = ref(true)
const sideBar = ref([
    {
        name: '推荐',
        tag: 'recommendation'
    },
    {
        name: '网址导航',
        tag: 'webNavigation'
    },
    {
        name: '酷应用',
        tag: 'ColApp'
    },
    {
        name: '轻应用',
        tag: 'QingApp'
    },
    {
        name: '系统功能',
        tag: 'systemFunction'
    },
    {
        name: 'windows',
        tag: 'windows'
    },
    {
        name: '自定义',
        tag: 'custom'
    },
])
</script>
<style lang='scss' scoped>
.hover-style{
    &:hover{
        background: var(--active-secondary-bg) !important;
    }
}
</style>