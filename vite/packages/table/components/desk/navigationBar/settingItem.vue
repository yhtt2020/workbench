<template>
<div>
    <div class="flex justify-between w-full">
        <div class="text-base xt-text">{{ settingItem.title }}</div>
        <a-switch v-model:checked="checked" />
    </div>
    <div class="mt-2 text-sm xt-text-2">
        {{ settingItem.description }}
    </div>
</div>
</template>

<script setup lang='ts'>
import {ref,reactive} from 'vue'
const checked=ref(false)
const props=defineProps({
    settingItem:Object
})
</script>
<style lang='scss' scoped>

</style>