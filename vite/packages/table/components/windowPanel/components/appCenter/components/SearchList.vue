<template>
    <div class="flex flex-col w-full h-full gap-3">
        <div class="pl-4 text-sm xt-text">搜索结果</div>
        <ItemList :list="list" bg="var(--active-secondary-bg)" v-if="list.length > 0"/>
        <div class="flex items-center justify-center w-full h-full" v-else>
            <div class="text-sm xt-text">暂无搜索结果</div>
        </div>
        <div class="pl-4 text-sm xt-text">应用市场</div>

    </div>
</template>

<script setup lang='ts'>
import { ref, defineAsyncComponent } from 'vue'

const ItemList = defineAsyncComponent(() => import('./ItemList.vue'))

const props = defineProps({
    list: {
        type: Array,
        default: () => []
    }
})

</script>
<style lang='scss' scoped></style>