<template>
    <NewModel style="max-width: 1000px; max-height: 720px" :modelValue="modelValue" :nav="true" :header="true"
        :footer="false" :esc="true" :back="false" @no="setQuick" title="" :mask="false">
        <template #nav>
            <div class="xt-bg p-3 -mt-4  -ml-4 " style="border-radius: 12px 0px 0px 12px;width: 185px;height: 100%;">
                <div class=" flex w-full h-[48px] items-center" style="line-height: 48px;">
                    <xt-new-icon icon="fluent:grid-16-regular" size="20" class="xt-text-2 ml-3" />
                    <div class="xt-text text-base ml-4">图标</div>
                </div>
                <div class="w-full h-[1px]  mt-3" style="background: var(--divider);"></div>
                <xt-button v-for="(item, index) in sideBar" style="border-radius: 10px;" :w="160" :h="48" :style="{
                    'background': currentIndex === index ? 'var(--active-secondary-bg)' : 'transparent'
                }" @click="onSelect(index)"
                    class="flex flex-col items-center  mt-2 justify-center text-base xt-text hover-style">
                    <div>
                        {{ item.name }}
                    </div>
                </xt-button>
            </div>

        </template>
        <template #header-left>
            <div>
                <div class="flex items-center">
                    <!-- windows应用 -->
                    <div v-if="sideBar[currentIndex].tag === 'windows'"
                        class="ml-3 xt-bg-2 h-[52px] rounded-xl flex items-center p-4 justify-between">
                        <div class="xt-text-2 text-sm">选择你的windows桌面图标，支持多选批量添加。</div>
                        <div class=" flex items-center">
                            <div style="color:var(--active-bg)" class="mr-3 pointer">全选</div>
                            <xt-button w="107" h="32" radius="8" style="background: var(--active-bg);">
                                <div class="xt-text flex justify-center items-center ">批量添加(3)</div>
                            </xt-button>
                        </div>

                    </div>
                    <!-- 输入框 -->
                    <a-input v-if="sideBar[currentIndex].tag !== 'windows' && sideBar[currentIndex].tag !== 'recommendation'" placeholder="搜索" style="width: 244px;height: 40px;border-radius: 10px;margin-left: 12px">
                        <template #suffix>
                            <xt-new-icon icon="fluent:search-16-regular" size="20" class="xt-text-2" />
                        </template>
                    </a-input>
                    <!-- 下拉选择 -->
                    <a-dropdown v-if="sideBar[currentIndex].tag == 'webNavigation'">
                        <template #overlay>
                            <a-menu @click="handleMenuClick">
                                <a-menu-item key="1">
                                    综合排序
                                </a-menu-item>
                            </a-menu>
                        </template>
                        <xt-button :w="160" :h="40" class="ml-3">
                            <div class="flex justify-between">
                                <div>综合排序</div>
                                <xt-new-icon icon="fluent:chevron-left-16-regular" size="20"
                                    class="xt-text -rotate-90"></xt-new-icon>
                            </div>
                        </xt-button>
                    </a-dropdown>
                </div>
                <div class="mt-4 ml-3">
                    <div class="xt-text-2 w-[790px] h-[52px] xt-bg-2 rounded-xl flex items-center p-4" v-if="tagText">
                        {{ tagText }}</div>
                    <div class="flex " v-if="sideBar[currentIndex].tag == 'webNavigation'">
                        <xt-button w="80" h="32" radius="16" class="p-1 mr-3 text-sm shaking-element"
                            v-for="(item, index) in webMenus" :key="index">{{ item.name }}</xt-button>
                    </div>
                </div>
            </div>


        </template>
        <div class="w-[850px] ml-3 " style="max-height: 520px;">
            <Introduce  :recommendation="sideBar[currentIndex].tag "/>
        </div>
    </NewModel>
</template>

<script setup lang='ts'>
import { ref, reactive ,computed} from 'vue'
import NewModel from '../../../ui/new/modal/index.vue'
import Introduce from './components/Introduce.vue'
import { webMenus } from './index'
const modelValue = ref(true)
const currentIndex = ref(0)
const emit=defineEmits(['setQuick'])
const sideBar = ref([
    {
        name: '推荐',
        tag: 'recommendation',
        active: 0
    },
    {
        name: '网址导航',
        tag: 'webNavigation',
        active: 0
    },
    {
        name: '酷应用',
        tag: 'ColApp',
        active: 0
    },
    {
        name: '轻应用',
        tag: 'QingApp',
        active: 0
    },
    {
        name: '系统功能',
        tag: 'systemFunction',
        active: 0
    },
    {
        name: 'windows',
        tag: 'windows',
        active: 0
    },
    {
        name: '自定义',
        tag: 'custom',
        active: 0
    },
])
const onSelect = (index: number) => {
    currentIndex.value = index
}
const tagText=computed(()=>{
    let currentTag=sideBar.value[currentIndex.value].tag
    switch (currentTag) {
        case 'ColApp':
            return '基于工作台深度优化和适配的应用，支持多选批量添加。'
            break;
        case 'QingApp':
            return '来自「想天浏览器」的轻应用，支持多选批量添加。'
            break;
        case 'systemFunction':
            return '工作台内置功能项，支持直接添加到桌面，支持多选批量添加。'
        default:
            break;
    }
})

const setQuick=()=>{
    emit('setQuick')
}
</script>
<style lang='scss' scoped>
.hover-style {
    &:hover {
        background: var(--active-secondary-bg) !important;
    }
}
</style>