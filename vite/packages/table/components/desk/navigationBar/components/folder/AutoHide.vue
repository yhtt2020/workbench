<template>
    <Transition
        name="animate__animated animate__bounce animate__delay-1s"  
        :enter-active-class="enter" 
        :leave-active-class="leave"
        @before-enter="handleBeforeEnter"
        @enter="handleEnter"
        @after-enter="handleAfterEnter"
        @before-leave="handleBeforeLeave"
        @leave="handleLeave"
        @after-leave="handleAfterLeave"
        @mouseenter="handleMouseEnter" 
        @mouseleave="handleMouseLeave">
        <slot></slot>
    </Transition>
</template>

<script setup lang='ts'>
import { ref, toRefs,Transition } from 'vue'
import { storeToRefs } from 'pinia'
import 'animate.css'
import { useNavigationStore } from '../../navigationStore';

// 导航栏数据
const useNavStore = useNavigationStore()
const { isLeaveBar,customOpenNav } = storeToRefs(useNavStore)

const props = defineProps({
    enter:{
        type: String,
        default: () => 'animate__fadeInUp'
    },
    leave:{
        type: String,
        default: () => 'animate__fadeOutDown'
    }
})

const { enter,leave } = toRefs(props)

// 鼠标移入
const handleMouseEnter = () => {
    if(customOpenNav.value){
    //    if(!isEnter.value) return
       isLeaveBar.value = false 
    }
    
}

// 鼠标移出
const handleMouseLeave = () => {
    if(customOpenNav.value){
    //    if(!isLeave.value) return
       setTimeout(() => {
        isLeaveBar.value = true 
       }, 800);
       
    }
    
}

// 当动画进入时，限制鼠标移入移出事件
const isLeave = ref(false)
const isEnter = ref(false)
// 动画进入前
const handleBeforeEnter = ()=>{
    document.documentElement.style.setProperty('--animate-duration', '1s');
    isLeave.value = true
}

// 动画进入
const handleEnter = ()=>{
}


const handleAfterEnter = ()=>{
    isLeave.value = false
}

// 动画离开前
const handleBeforeLeave = ()=>{
    document.documentElement.style.setProperty('--animate-duration', '.5s');
    isEnter.value = true
    
}

// 动画离开
const handleLeave = ()=>{
    
}

const handleAfterLeave = ()=>{
    isLeave.value = false
}
</script>
<style lang='scss' scoped></style>