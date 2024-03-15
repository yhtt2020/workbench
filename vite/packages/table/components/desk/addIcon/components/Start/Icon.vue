<template>
    <div 
        class="
            w-[218px] h-[64px] xt-bg-2 
            rounded-xl flex  items-center pointer" 
        style="padding-top: 22px;padding-bottom: 22px;">
        <xt-new-icon 
            :icon="item.newIcon" 
            style="margin-left:22px;margin-right: 22px;">
        </xt-new-icon>
        <div class="xt-text">{{ item.name }}</div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive,toRefs,onMounted } from 'vue'
const props = defineProps({
    item: Object
})
const { item } = toRefs(props)
</script>
<style lang='scss' scoped></style>