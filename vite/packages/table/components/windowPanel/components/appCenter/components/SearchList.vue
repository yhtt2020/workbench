<template>
    <div class="flex flex-col justify-center w-full h-full gap-3">
        <div class="pl-4 text-sm xt-text" v-if="list.length > 0">搜索结果</div>
        <div class="flex-1 w-full" style="max-height: 100%;">
            <ItemList :list="list" bg="var(--active-secondary-bg)" v-if="list.length > 0" @close="close"/>
        </div>
        <div class="flex flex-col w-full gap-3" style="max-height: 475px;">
            <div class="pl-4 text-sm xt-text" v-if="marketList.length > 0">应用市场</div>
            <xt-scrollbar class="flex-1 w-full h-full" :x="false" :y="true">
                <div class="flex flex-col w-full h-full gap-3" v-if="marketList.length > 0">
                    <MarketList 
                        v-for="item in marketList" 
                        :key="item.id" 
                        :item="item"
                        @open="open"
                        @download="getDown"
                        boxClass="w-full"
                    />
                </div>
            </xt-scrollbar>  
        </div>
        
    </div>
    <div class="flex items-center justify-center w-full h-full">
        <Empty @back="back" v-if="marketList.length <= 0 && list.length <= 0"/>
    </div>
</template>

<script setup lang='ts'>
import { ref, defineAsyncComponent, computed, toRefs } from 'vue'
import { usePlat } from '../../../../../ui/hooks/usePlat';

import { open, download } from '../../../../../apps/appCenter/src/views/market/hooks/lightApp'

const ItemList = defineAsyncComponent(() => import('./ItemList.vue'))
const MarketList = defineAsyncComponent(() => import('../../../../../apps/appCenter/src/views/market/components/Item.vue'))
const Empty = defineAsyncComponent(() => import('./Empty.vue'))

let appModel
if(!usePlat('web')) {
    appModel = window.$models.appModel
}

const emit = defineEmits(['close', 'open', 'back'])

// 关闭
const close = () => {
    emit('close')
}

// 返回
const back = () => {
    emit('back')
}

const props = defineProps({
    list: {
        type: Array,
        default: () => []
    },
    market:{
        type: Array,
        default: () => []
    }
})

const { list, market } = toRefs(props)

// 过滤market和list相同的数据
const marketList = computed(() => {
    return market.value.filter(marketItem => {
        return list.value.every(listItem => listItem.name !== marketItem.name);
    });
});

const getDown = (item) => {
    download(item, item.value.version, () => check(item))
}

// 检查是否已经安装
const check = async(item) => {
    if( !usePlat('web')) {
        const allList = await appModel.getAllApps()
        item.isInstalled = allList.find(app => app.appid === item.id)
    } else {
        item.isInstalled = false
    }
}

</script>
<style lang='scss' scoped></style>