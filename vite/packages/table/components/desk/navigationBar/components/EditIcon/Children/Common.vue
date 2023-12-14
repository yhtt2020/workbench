<template>
    <div class="w-[452px] h-[155px] mb-4">
        <div class="flex items-center justify-center w-full h-full xt-bg-2 rounded-xl">{{ props.title }}</div>
    </div>
    <div class="w-[452px] xt-bg-2 rounded-xl p-4 ">
        <div class="flex justify-start">
            <div class="text-base xt-text">图标名称</div>
            <xt-new-icon icon="fluent:arrow-clockwise-16-regular" size="16" class="ml-1"></xt-new-icon>
        </div>
        <div class="mt-2 text-base xt-text-2">
            修改当前引用图标名称
        </div>
        <a-input allow-clear v-model:value="editItem.name" placeholder="请输入图标名称" class="h-[40px]  w-full mt-3 input" 
        style="border-radius: 12px; border: 1px solid var(--divider);background: var(--main-bg);"
        ></a-input>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
export interface titleProps{
    title:string
    editItem:object
}
const props=withDefaults(defineProps<titleProps>(),{
    title:'',
    editItem:()=>{}
})
</script>
<style lang='scss' scoped>
:deep(.ant-input){
    color: var(--secondary-text);
}
</style>