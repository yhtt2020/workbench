<template>
    <a-dropdown trigger="['click']" :overlayStyle="{zIndex: 9999999 + 10}">
        <template #overlay>
            <a-menu class="rounded-xl xt-modal" style="border-radius: 12px !important;">
                <a-menu-item @click="handleMenuClick(item)" key="index" v-for="(item, index) in list"
                    class="flex items-center justify-center hover-style ">
                    <div class="flex items-center justify-center rounded-md xt-text">{{ item.name }}</div>
                </a-menu-item>
            </a-menu>
        </template>
        <xt-button :w="120" :h="32" :class="[className]" style="flex-shrink: 0 !important;">
            <div class="flex justify-between flex-shrink-0">
                <div class="text-base xt-text omit-1">{{ defaultTitle.name }}</div>
                <xt-new-icon icon="fluent:chevron-left-16-regular" size="20" class="-rotate-90 xt-text"></xt-new-icon>
            </div>
        </xt-button>
    </a-dropdown>
</template>

<script setup lang='ts'>
import { ref, toRefs } from 'vue'

const props = defineProps({
    list: Array, // 数据列表
    defaultTitle: Object, // 默认数据
    className:String
})

const { list, defaultTitle } = toRefs(props)

const emit = defineEmits(['change', 'update:defaultTitle'])  

const handleMenuClick = (item: any) => {
    emit('change', item)
    emit('update:defaultTitle', item)
}

</script>
<style lang='scss' scoped></style>