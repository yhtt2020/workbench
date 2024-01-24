<template>
    <Transition
        name="animate__animated animate__bounce animate__delay-1s"  
        enter-active-class="animate__fadeInUp" 
        leave-active-class="animate__fadeOutDown"
        @mouseenter="handleMouseEnter" 
        @mouseleave="handleMouseLeave">
        <slot></slot>
    </Transition>
</template>

<script setup lang='ts'>
import { ref, reactive,Transition } from 'vue'
import { storeToRefs } from 'pinia'
import 'animate.css'
import { useNavigationStore } from '../../navigationStore';

// 导航栏数据
const useNavStore = useNavigationStore()
const { isLeaveBar,customOpenNav } = storeToRefs(useNavStore)

// 鼠标移入
const handleMouseEnter = () => {
    if(customOpenNav.value){
    //    console.log('enter','<<<<<<<<<+++=====')
       isLeaveBar.value = false 
    }
    
}

// 鼠标移出
const handleMouseLeave = () => {
    if(customOpenNav.value){
    //    console.log('leave','<<<<<<<<<+++=====')
       isLeaveBar.value = true 
    }
    
}
</script>
<style lang='scss' scoped></style>