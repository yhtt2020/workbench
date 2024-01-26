<template>
    <Transition
        name="animate__animated animate__bounce animate__delay-1s"  
        enter-active-class="animate__fadeInUp" 
        leave-active-class="animate__fadeOutDown"
        @before-enter="handleBeforeEnter"
        @enter="handleEnter"
        @before-leave="handleBeforeLeave"
        @leave="handleLeave"
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
       if(!isEnter.value) return
       isLeaveBar.value = false 
    }
    
}

// 鼠标移出
const handleMouseLeave = () => {
    if(customOpenNav.value){
       if(!isLeave.value) return
       isLeaveBar.value = true 
    }
    
}

// 当动画进入时，限制鼠标移入移出事件
const isLeave = ref(false)
const isEnter = ref(false)
// 动画进入前
const handleBeforeEnter = ()=>{
    isLeave.value = true
}

// 动画进入
const handleEnter = ()=>{
    isLeave.value = false
}

// 动画离开前
const handleBeforeLeave = ()=>{
    isEnter.value = true
}

// 动画离开
const handleLeave = ()=>{
    isEnter.value = false
}
</script>
<style lang='scss' scoped></style>