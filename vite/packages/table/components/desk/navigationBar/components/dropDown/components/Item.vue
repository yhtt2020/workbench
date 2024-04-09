<template>
    <div class="flex w-full gap-2 p-2 hover-style" :style="{width: `${elementWidth}px`}">
        <div>
            <xt-new-icon :icon="item.icon" size="20"></xt-new-icon>
        </div>
        <div class="flex flex-col flex-1 w-full gap-1" :style="{width: `${elementWidth * 0.8}px`}">
            <span class="w-full text-base xt-text omit" :style="{maxWidth: `${elementWidth * 0.8}px`}">{{ item.name }}</span>
            <span class="w-full text-sm xt-text-2 omit" :style="{maxWidth: `${elementWidth * 0.8}px`}">{{ item.info }}</span>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, toRefs } from 'vue'

type PropsType = {
    item: {
        icon?: string,  // 图标
        name: string,   // 名称
        value: string,  // 值
        info?: string   // 说明
    },
    elementWidth:number
}
const props = withDefaults(defineProps<PropsType>(),{
    item: () => ({
        icon:'mingcute:windows-line',
        name:'Windows',
        value:'default',
        info:'默认'
    }),
    elementWidth:0
})

const { item, elementWidth } = toRefs(props)

</script>
<style lang='scss' scoped>
.hover-style {
    &:hover {
        background: var(--active-secondary-bg) !important;
        border-radius: 8px;
    }
}
</style>