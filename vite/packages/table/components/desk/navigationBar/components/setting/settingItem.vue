<template>
    <div class="w-full" v-for="(item, index) in props.settingItem">
        <div class="flex justify-between w-full">
            <div class="text-base xt-text">{{ item.title }}</div>
            <a-switch v-model:checked="item.switch" @change="change(item,index)" />
        </div>
        <div class="mt-2 text-sm xt-text-2">
            {{ item.description }}
        </div>
        <div class="w-full h-[1px] bg-[var(--divider)] mt-3 mb-4" v-if="index != props.settingItem.length - 1"></div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
const props = defineProps({
    settingItem:{
        type:Array,
        default:()=>[]
    }
})
const emit = defineEmits(['change'])
const change = (item,index)=>{
    emit('change',item,index)
}
</script>
<style lang='scss' scoped></style>