<template>
    <div class="flex flex-col items-center justify-center w-full h-full">
        <Item 
            classItem="max-w-[705px] justify-start"
            :menu="menu"  
            @choose="chooseIcon">
        </Item>
        <Item 
            classItem="justify-center"
            className="mt-8"
            :menu="teamMenu" 
            @choose="chooseTeam">
        </Item> 
    </div>
    
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import {menu,teamMenu} from './Data'
import Item from './Item.vue';

const emit = defineEmits(['choose'])

// 选择图标类型回调
const chooseIcon = (item,index) => {
    emit('choose',item,index)
}

// 选择团队图标类型回调
const chooseTeam = (item) => {
    emit('choose',item)
}

</script>
<style lang='scss' scoped></style>