<template>
    <div 
        :style="{ left: `${appPos.x}px`, top: `${appPos.y}px`} "
        class="w-[600px] h-[632px] rounded-2xl flex flex-col absolute justify-between" 
        style="
            z-index: 100;
            border: 1px solid var(--divider);
            background: rgba(26,26,26,0.65);
            backdrop-filter: blur(50px);">
        <div class="p-4 flex flex-col justify-between h-full">
            <div class="flex flex-col gap-3">
                <xt-input 
                    style="height: 32px !important;"
                    v-model:modelValue="inputValue" 
                    placeholder="搜索" 
                    @enter="search">
                    <template #suffix>
                        <xt-new-icon icon="fluent:search-16-regular" size="16"></xt-new-icon>
                    </template>
                </xt-input> 
                <ItemList :list="startMenu"></ItemList>  
            </div>
            <div>
                <div class="flex justify-between items-center mt-3 mb-3">
                    <div class="xt-text text-sm">最近使用</div>
                    <xt-button 
                        :w="64" 
                        :h="28" 
                        :radius="6">
                        <div class="flex items-center gap-1">
                            更多
                            <xt-new-icon icon="fluent:chevron-right-16-regular" size="16"></xt-new-icon> 
                        </div>
                    </xt-button>
                </div>
                <ItemList :list="lastUseList"></ItemList> 
            </div>
            
        </div>
        <div class="w-full h-[56px] xt-main-bg rounded-b-2xl flex justify-between">
            <div class="flex items-center justify-between p-2 gap-2 pointer">
                <xt-new-icon icon="fluent:grid-16-regular" size="20"></xt-new-icon>
                全部应用
            </div>
            <div class="flex items-center justify-between p-2 gap-1">
                <xt-button 
                    :w="40" 
                    :h="40" 
                    @click="search" 
                    icon="fluent:building-shop-16-regular" 
                    style="background-color: var(--main-bg);">
                </xt-button>
                <xt-button 
                    :w="40" 
                    :h="40" 
                    icon="fluent:settings-16-regular" 
                    style="background-color: var(--main-bg);">
                </xt-button>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, computed, toRefs, defineAsyncComponent, onMounted } from 'vue'

import { storeToRefs } from 'pinia';
import { useAppCenterStore } from '../../../../apps/appCenter/src/store';

const appCenterStore = useAppCenterStore()
const { startMenu } = storeToRefs(appCenterStore)

const ItemList = defineAsyncComponent(() => import('./components/ItemList.vue'))


interface PropsType {
    appPos:{
        x:number,
        y:number
    }
}

const props = withDefaults(defineProps<PropsType>(), {
    appPos: {
        x: 0,
        y: 0
    }
})

const { appPos } = toRefs(props)

const inputValue = ref('')

const search = () => {
    console.log(inputValue.value)
}

// 最近使用
const lastUseList = computed(() => {
    let list = [...startMenu.value]
    return list.sort((a,b) => {
        return b.lastUseTime - a.lastUseTime
    })
})

</script>
<style lang='scss' scoped></style>