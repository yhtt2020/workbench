<template>
    <div 
        :style="{ left: `${appPos.x}px`, top: `${appPos.y}px`} "
        class="w-[600px] h-[632px] rounded-2xl flex flex-col absolute justify-between" 
        style="
            z-index: 100;
            border: 1px solid var(--divider);
            background: rgba(26,26,26,0.65);
            backdrop-filter: blur(50px);">
        <div class="flex flex-col justify-between h-full p-4">
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
                <ItemList :list="startMenu" v-if="!isSearch"></ItemList>  
                <SearchList :list="searchList" v-else />
            </div>
            <div v-if="recentUsed && !isSearch">
                <div class="flex items-center justify-between mt-3 mb-3">
                    <div class="text-sm xt-text">最近使用</div>
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
        <div class="w-full h-[56px] xt-bg rounded-b-2xl flex justify-between">
            <div class="flex items-center justify-between gap-2 p-2 pointer">
                <xt-new-icon icon="fluent:grid-16-regular" size="20"></xt-new-icon>
                全部应用
            </div>
            <div class="flex items-center justify-between gap-1 p-2">
                <xt-button 
                    :w="40" 
                    :h="40" 
                    @click="goApps('Market')" 
                    icon="fluent:building-shop-16-regular" 
                    style="background-color: var(--primary-bg);">
                </xt-button>
                <xt-button 
                    :w="40" 
                    :h="40" 
                    icon="fluent:settings-16-regular" 
                    @click="goApps('Setting')"
                    style="background-color: var(--primary-bg);">
                </xt-button>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { 
    ref, 
    computed, 
    toRefs, 
    defineAsyncComponent, 
    onMounted, 
    watch 
} from 'vue'

import { storeToRefs } from 'pinia';
import { useAppCenterStore } from '../../../../apps/appCenter/src/store';

const appCenterStore = useAppCenterStore()
const { startMenu, current, visible, recentUsed } = storeToRefs(appCenterStore)

const ItemList = defineAsyncComponent(() => import('./components/ItemList.vue'))
const SearchList = defineAsyncComponent(() => import('./components/SearchList.vue'))

const emit = defineEmits(['close'])

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
const isSearch = ref(false)
const searchList = ref([])

const search = () => {
    // console.log(inputValue.value)
    isSearch.value = true
    searchList.value = startMenu.value
    searchList.value = searchList.value.filter(item => item.name.indexOf(inputValue.value) !== -1)
}

watch(
    () => inputValue.value,
    (newV,oldV) => {
        if(newV === '' && oldV !== '') {
            isSearch.value = false
        }
    }
)

// 最近使用
const lastUseList = computed(() => {
    let list = [...startMenu.value]
    return list.sort((a,b) => {
        return b.lastUseTime - a.lastUseTime
    })
})

const cardZoom = computed(() => {
    const wH = window.innerHeight
    // console.log('wH :>> ', wH,wH / 800 ,appPos.value,(appPos.value.x / (wH / 800)),(appPos.value.y / (wH / 800)) );
    if(wH < 800) {
        return (wH / 800).toFixed(2)
    } else {
        return 1
    }
})

// 跳转
const goApps = (name:string) => {
    visible.value = true
    current.value = name
    emit('close')
}

// 搜索
// const searchList = computed(() => {
//     const list = startMenu.value
//     return list.filter(item => item.name.indexOf(inputValue.value) !== -1)
// })
</script>
<style lang='scss' scoped></style>