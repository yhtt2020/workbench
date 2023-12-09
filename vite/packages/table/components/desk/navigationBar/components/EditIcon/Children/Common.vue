<template>
    <div class="w-[452px] h-[155px] ">
        <div class="flex items-center justify-center w-full h-full xt-bg-2 rounded-xl">{{ props.title }}</div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
export interface titleProps{
    title:string
}
const props=withDefaults(defineProps<titleProps>(),{
    title:''
})
</script>
<style lang='scss' scoped></style>