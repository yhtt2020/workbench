<template>
    <a-dropdown :trigger="[trigger]" :overlayClassName="hover" :overlayStyle="{zIndex: 9999999 + 10}">
        <template #overlay>
            <a-menu class="rounded-xl xt-modal" 
                    style="
                        border-radius: 12px !important;
                        border: 1px solid var(--divider);
                    "
                    :style="{width:elementWidth + 'px'}"
                    :overlayStyle="{zIndex: 9999999 + 10}">
                <a-menu-item 
                    :style="{width:elementWidth + 'px'}"
                    @click="handleMenuClick(item)" 
                    :key="index" 
                    v-for="(item, index) in list"
                    class="flex items-center justify-center flex-1 gap-2 overflow-hidden">
                    <Item :item="item" :elementWidth="elementWidth" class="w-full"></Item>
                </a-menu-item>
            </a-menu>
        </template>
        <a-input ref="input" v-model:value="defaultData" class="h-[40px] xt-modal "
            style="border-radius: 12px !important;">
            <template #suffix>
                <xt-new-icon icon="fluent:chevron-down-16-regular" size="20" class="xt-text" />
            </template>
        </a-input>
    </a-dropdown>
    <div class="mb-4"></div>
</template>

<script setup lang='ts'>
import { ref, toRefs, watch, onMounted } from 'vue'
import { useMouseInElement } from '@vueuse/core'

import Item from './components/Item.vue'

type PropsType = {
    // 触发方式
    trigger?: string | string[],
    // 下拉框数据
    list: [
        {
            icon?: string,  // 图标
            name: string,   // 名称
            value: string,  // 值
            info?: string   // 说明
        }
    ],
    mode:string

}

const props = withDefaults(defineProps<PropsType>(), {
    trigger: 'click',
    list: () => [
        {
            icon: 'mingcute:windows-line',
            name: 'Windows',
            value: 'default',
            info: '使用想天浏览器内置的「手机模式」打开，可以模拟手机端的浏览状态。'
        }
    ],
    mode:'default'
})

const { trigger, list } = toRefs(props)

const mode = ref(props.mode)

const emit = defineEmits(['handleMenuClick','update:mode'])

const defaultData = ref('默认')
const input = ref(null)
const { elementWidth } = useMouseInElement(input)

const handleMenuClick = (item: any) => {
    defaultData.value = item.name
    mode.value = item.value
    emit('handleMenuClick', item)
}

watch(
    () => mode.value,
    (newV) => {
        emit('handleMenuClick', newV)
        defaultData.value = list.value.filter((item) => item.value === newV)[0].name
        emit('update:mode', newV)
    }
)

watch(
    () => props.mode,
    (newV) => {
        mode.value = newV
    }
)

onMounted(() => {
    defaultData.value = list.value.filter((item) => item.value === mode.value)[0].name
})

</script>
<style lang='scss' scoped>
.hover {
    &:hover {
        background-color: none !important;
        border-radius: 12px;
    }
}
</style>