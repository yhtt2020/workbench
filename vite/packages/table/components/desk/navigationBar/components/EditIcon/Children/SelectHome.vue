<template>
    <div class="w-[452px] xt-bg-2 rounded-xl p-4 mt-4">
        <div class="flex justify-start">
            <div class="text-base xt-text">选择打开桌面(开发中)</div>
        </div>
        <div class="mt-2 mb-2 text-sm xt-text-2">
            当你有多个桌面时，你可以选择点击打开的默认桌面作为主页
        </div>
        <xt-select v-model="defaultDesk" :list="deskList"></xt-select>
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
onMounted(()=>{
    // console.log(deskList.value.filter((item)=> item.value === props.editItem.home.id),'target')
    // const target = deskList.value.filter((item)=> item.value === props.editItem.home.id)
    // if(target.length) defaultDesk.value = target[0].name
    // props.editItem.home ? defaultDesk.value = deskList.value.filter((item)=> item.value === props.editItem.home.id).name : defaultDesk.value = deskList.value[0].name
    defaultDesk.value = '默认桌面'
    // if(props.editItem.home){
    //     const target = deskList.value.filter((item)=> item.value === props.editItem.home.id)
    //     defaultDesk.value = target[0].id
    //     console.log(target[0],'target')
    // }else{
    //     defaultDesk.value = deskList.value[0].id
    // }
})
watch(()=>defaultDesk.value,()=>{
    props.editItem.home = {id:defaultDesk.value}
})
</script>
<style lang='scss' scoped></style>