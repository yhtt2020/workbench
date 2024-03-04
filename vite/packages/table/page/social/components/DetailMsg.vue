<template>
    <div v-for="item in list" class="relative flex flex-row items-center p-4 mt-2 rounded-lg w-[190px] h-[72px]"
        style="width: calc(50% - 8px);"
        :style="item.detail[[leveList[current]]] ? 'background: var(--secondary-bg)' : 'background: var(--secondary-bg);opacity: 0.6;'">
        <xt-new-icon :icon="item.icon" class="mr-4"></xt-new-icon>
        <div style="width: calc(100% - 50px)">
            <div class="w-full text-white text-more xt-text">{{ item.alias }}</div>
            <div v-if="item.detail[[leveList[current]]]" class="w-full text-more xt-text-2">
                {{ item.detail[[leveList[current]]] }}</div>

        </div>
        <div class="grade-tip" style="color: rgba(255, 255, 255, 0.85);" v-if="item.noOnline">即将上线</div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
const props = defineProps({
    list: {
        type: Array,
        default: () => []
    },
    current: {
        type: Number,
        default: 0
    },
    leveList: {
        type: Array,
        default: () => []
    }
})

</script>
<style lang='scss' scoped></style>