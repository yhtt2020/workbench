<template>
    <div class="flex flex-col items-center justify-center w-full h-full mt-24">
        <xt-new-icon icon="fluent-emoji:magnifying-glass-tilted-right" :size="64"></xt-new-icon>
        <div class="my-4 text-sm xt-text">没有找到相关内容</div>
        <xt-button type="theme" :w="80" :h="40" @click="back">返回</xt-button>
    </div>
</template>

<script setup lang='ts'>

const emit = defineEmits(['back'])

const back = () => {
    emit('back')
}
</script>
<style lang='scss' scoped></style>