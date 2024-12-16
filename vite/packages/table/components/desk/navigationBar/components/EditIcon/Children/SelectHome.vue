<template>
    <div class="w-[452px] xt-bg-2 rounded-xl p-4 mt-4">
        <div class="flex justify-start">
            <div class="text-base xt-text">选择打开桌面</div>
        </div>
        <div class="mt-2 mb-2 text-sm xt-text-2">
            当你有多个桌面时，你可以选择点击打开的默认桌面作为主页
        </div>
        <xt-select v-model="defaultDesk" :list="deskList" :zIndex="99999"></xt-select>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, computed, onMounted,watch } from 'vue'
import { cardStore } from '../../../../../../store/card'
const useCardStore = cardStore()
const props = defineProps({
    editItem: Object
})
const deskList = computed(() => {
    return useCardStore.desks.map((desk) => {
        return {
            name: desk.name,
            value: desk.id
        }
    })
})

const defaultDesk = ref('')
const title=ref('')
onMounted(()=>{
    defaultDesk.value = props.editItem.home?.id ? props.editItem.home.id : deskList.value[0].value
})
watch(()=>defaultDesk.value,()=>{
    props.editItem.home = {id:defaultDesk.value,name:useCardStore.desks.find(desk=>{
      return desk.id === defaultDesk.value
      }).name}
})
</script>
<style lang='scss' scoped></style>
