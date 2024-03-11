<template>
    <div class="flex flex-col items-center w-full h-full">
        <Item 
            :menu="menu"  
            @choose="chooseIcon">
        </Item>
        <Item 
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

const chooseIcon = (item) => {
    emit('choose',item)
    console.log('i just choose you',item)
}

const chooseTeam = (item) => {
    emit('choose',item)
    console.log('i just choose you',item)
}

</script>
<style lang='scss' scoped></style>