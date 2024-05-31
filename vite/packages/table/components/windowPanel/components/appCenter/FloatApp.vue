<template>
    <div 
        ref="appRef"
        :style="{ left: `${appPos.x}px`, top: `${appPos.y}px`} "
        class="w-[600px] h-[632px] rounded-2xl flex flex-col absolute justify-between" 
        style="
            z-index: 100;
            border: 1px solid var(--divider);
            background: rgba(26,26,26,0.65);
            backdrop-filter: blur(50px);">
        <xt-input 
            v-if="!isMore"
            style="
                height: 52px !important;
                background-color: var(--primary-bg) !important;
                border-radius: 16px 16px 0px 0px;
                border-bottom: 1px solid var(--divider);
                margin-bottom: 8px;
                flex-shrink: 0;"
            v-model:modelValue="inputValue" 
            placeholder="搜索" 
            @enter="search">
            <template #suffix>
                <xt-new-icon icon="fluent:search-16-regular" size="20"></xt-new-icon>
            </template>
        </xt-input>
        <div class="flex flex-col justify-between pb-4 pl-4 pr-4" style="height: 85%;">
            <div class="flex flex-col justify-center gap-3" v-if="!isMore">
                <div class="flex items-center justify-center w-full h-full">
                    <Tips 
                        :closeVisible="false"
                        @jumpMy="goApps('MyApps')" 
                        v-if="!isSearch && lastStartMenu.length <= 0 && recentUsed">
                    </Tips>  
                </div>
                
                <!-- 开始菜单列表 -->
                <ItemList :list="lastStartMenu" v-if="!isSearch" @close="close"></ItemList>  
                <!-- 搜索后列表 -->
                <SearchList 
                    v-else
                    @back="inputValue = ''"
                    :list="searchList" 
                    @close="close" 
                    :market="marketList" 
                    @open="goApps('Market')"
                />
            </div>
            <div v-if="recentUsed && !isSearch" class="w-full h-full">
                <div class="flex items-center justify-between mt-3 mb-3">
                    <div class="text-sm xt-text">最近使用</div>
                    <xt-button 
                        :w="64" 
                        :h="28" 
                        :radius="6"
                        @click="getMore"
                    >
                        <div class="flex items-center gap-1">
                            {{ isMore ? '收起' : '更多' }}
                            <xt-new-icon icon="fluent:chevron-right-16-regular" size="16"></xt-new-icon> 
                        </div>
                    </xt-button>
                </div>
                <!-- 最近使用前五个 -->
                <ItemList :list="lastList" :isStartMenu="false" v-if="!isMore" @close="close"></ItemList> 
                <!-- 全部最近使用 -->
                <xt-scrollbar class="flex-1 w-full h-full" :x="false" :y="true" v-else>
                   <ItemList :list="arr" :isStartMenu="false" @close="close"></ItemList>  
                </xt-scrollbar>
            </div>
            <div v-if="!recentUsed && !isSearch" class="flex items-center justify-center w-full h-full">
                <Tips v-model:modelValue="showTip" @jumpMy="goApps('MyApps')" ></Tips>
            </div>
        </div>
        <!-- 底部选项 -->
        <BottomBar @goApps="goApps"/>
    </div>
</template>

<script setup lang='ts'>
import { 
    ref, 
    computed, 
    toRefs, 
    defineAsyncComponent, 
    onMounted, 
    onUnmounted,
    watch,
    getCurrentInstance
} from 'vue'

import { storeToRefs } from 'pinia';
import { onClickOutside } from '@vueuse/core'
import { message } from 'ant-design-vue';

import { useAppCenterStore } from '../../../../apps/appCenter/src/store';
import { useMarketStore } from '../../../../apps/appCenter/src/views/market/store/store';
import { ROUTER_LIMIT } from '../../../../permission/config';
import { usePlat } from '../../../../permission/usePlat';
import { resetType } from '../../../../apps/appCenter/src/views/myApps/hooks/useTransform'

const appCenterStore = useAppCenterStore()
const { current, visible, recentUsed, myApps, showTip, startMenu } = storeToRefs(appCenterStore)

const marketStore = useMarketStore()
const { recommendList, searchApps } = storeToRefs(marketStore)

const ItemList = defineAsyncComponent(() => import('./components/ItemList.vue'))
const SearchList = defineAsyncComponent(() => import('./components/SearchList.vue'))
const Tips = defineAsyncComponent(() => import('./Tips.vue'))
const BottomBar = defineAsyncComponent(() => import('./components/BottomBar.vue'))

const { proxy } = getCurrentInstance()

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

// 搜索 -- 搜索
const inputValue = ref('')

// 搜索状态 -- 搜索
const isSearch = ref(false)

// 搜索列表 -- 搜索
const searchList = ref([])

const marketList = ref([])

// 查看更多 -- 最近使用
const isMore = ref(false)

const arr =ref([])
// 组件实例
const appRef = ref(null)

// 搜索
const search = () => {
    if(inputValue.value === '') {
        message.info('请输入搜索内容')
        return
    }
    isSearch.value = true
    searchList.value = myApps.value.filter(item => 
        item.name.toLowerCase().includes(inputValue.value.toLowerCase())
    );
    marketStore.searchApp(inputValue.value).then(() => {
        console.log(searchApps.value,'searchApps.value')
        marketList.value = searchApps.value
    })
}

// 取消搜索状态
watch(
    () => inputValue.value,
    (newV,oldV) => {
        if(newV === '' && oldV !== '') {
            isSearch.value = false
        }
    }
)

// 开始菜单
// const startApps = computed(() => {
//   // 根据平台使用条件过滤 myApps 列表
// //   return myApps.value.filter(item => 
// //     item.isStart && (usePlat('web') ? !ROUTER_LIMIT.web.includes(item.value) : true)
// //   );
//     const list = myApps.value.filter(item => {
//         return startMenu.value.map((i) => {
//             return i === item.id
//         })
//     })
//     return list.filter(item => {
//         if(usePlat('web')) {
//             return !ROUTER_LIMIT.web.includes(item.value)
//         }
//     }) 
// });

const startApps = computed(() => {
  // 根据平台使用条件过滤 myApps 列表
  return myApps.value.filter(item => {
    // 检查是否包含在启动菜单中
    if (!startMenu.value.includes(item.id)) {
      return false;
    }
    // 如果是Web平台，确保不在ROUTER_LIMIT中
    if (usePlat('web') && ROUTER_LIMIT.web.includes(item.value)) {
      return false;
    }
    return true;
  });
});


// 最近使用
const lastUseList = computed(() => {
    let list : any = [...myApps.value]
    arr.value = [...myApps.value]
    list = list.sort((a,b) => {
        return b.lastUseTime - a.lastUseTime
    })
    // console.log(list,'sort list')
    return list
})

// 最近使用前五个
const lastList = computed(() => {
    const list = lastUseList.value
    return list.splice(0,5)
})

// 开始菜单
const lastStartMenu = computed(() => {
    return startApps.value.splice(0,15)
})

// 当屏幕高度小于界面高度时，缩放
const cardZoom = computed(() => {
    const wH = window.innerHeight
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

// 获取更多
const getMore = () => {
    console.log('更多')
    isMore.value = ! isMore.value
}

// 关闭
const close = () => {
    emit('close')
}

// 点击外部关闭
onMounted(() => {
    // proxy.$bus.on('closeControl', () => {
    //     emit('close')
    // })
    // onClickOutside(appRef, () => {
    //     emit('close')
    // })
    myApps.value = resetType(myApps.value)
    // console.log(myApps.value,'myApps.value')
    // setTimeout(() => {
    //   console.log(startApps.value,'<<<<<<<<<<<<<<<<',lastStartMenu.value, startMenu.value)  
    // }, 2000);
    
})

onUnmounted(() => {
    // proxy.$bus.off('closeControl')
    // onClickOutside(appRef, null)
})
</script>
<style lang='scss' scoped></style>