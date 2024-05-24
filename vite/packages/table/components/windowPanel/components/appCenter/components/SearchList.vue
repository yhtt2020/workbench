<template>
    <div class="flex flex-col w-full h-full gap-3">
        <div class="pl-4 text-sm xt-text">搜索结果</div>
        <ItemList :list="list" bg="var(--active-secondary-bg)" v-if="list.length > 0" @close="close"/>
        <div class="flex items-center justify-center w-full h-full" v-else>
            <div class="text-sm xt-text">暂无搜索结果</div>
        </div>
        <div class="pl-4 text-sm xt-text">应用市场</div>
        <div class="flex flex-col w-full h-full gap-3">
            <MarketList v-for="item in props.list" :key="item.id" :item="item"/>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia';

import { useMarketStore } from '../../../../../apps/appCenter/src/views/market/store/store' 

const ItemList = defineAsyncComponent(() => import('./ItemList.vue'))
const MarketList = defineAsyncComponent(() => import('../../../../../apps/appCenter/src/views/market/components/Item.vue'))

const store = useMarketStore()
const { recommendList } = storeToRefs(store)

const emit = defineEmits(['close'])

const close = () => {
    emit('close')
}

const props = defineProps({
    list: {
        type: Array,
        default: () => []
    }
})

</script>
<style lang='scss' scoped></style>