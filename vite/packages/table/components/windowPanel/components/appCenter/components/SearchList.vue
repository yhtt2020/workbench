<template>
    <div class="flex flex-col w-full h-full gap-3">
        <div class="pl-4 text-sm xt-text" v-if="list.length > 0">搜索结果</div>
        <ItemList :list="list" bg="var(--active-secondary-bg)" v-if="list.length > 0" @close="close"/>
        <div class="flex items-center justify-center w-full h-full" v-else>
            <Empty @back="back"/>
        </div>
        <div class="pl-4 text-sm xt-text" v-if="marketList.length > 0">应用市场</div>
        <div class="flex flex-col w-full h-full gap-3" v-if="marketList.length > 0">
            <MarketList 
                v-for="item in marketList" 
                :key="item.id" 
                :item="item"
                @open="open"
                @download="open"
                boxClass="w-full"
            />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, defineAsyncComponent, computed, toRefs } from 'vue'

const ItemList = defineAsyncComponent(() => import('./ItemList.vue'))
const MarketList = defineAsyncComponent(() => import('../../../../../apps/appCenter/src/views/market/components/Item.vue'))
const Empty = defineAsyncComponent(() => import('./Empty.vue'))


const emit = defineEmits(['close', 'open', 'back'])

const close = () => {
    emit('close')
}

const open = () => {
    emit('open')
}

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

const marketList = computed(() => {
    return market.value.filter( item => {
        return list.value.some(app => app.name !== item.name)
    })
})

</script>
<style lang='scss' scoped></style>