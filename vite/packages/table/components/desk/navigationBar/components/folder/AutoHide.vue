<template>
    <Transition 
        ref="hide"
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
import { ref, toRefs, Transition } from 'vue'
import { storeToRefs } from 'pinia'
import 'animate.css'
import { useMouseInElement } from "@vueuse/core";
import { useNavigationStore } from '../../navigationStore';

// 导航栏数据
// const useNavStore = useNavigationStore()
// const { isLeaveBar } = storeToRefs(useNavStore)

const hide = ref(null)
const { isOutSide } = useMouseInElement(hide)

const props = defineProps({
    enter: {
        type: String,
        default: () => 'animate__fadeInUp'
    },
    leave: {
        type: String,
        default: () => 'animate__fadeOutDown'
    },
    autoHideNav: {
        type: Boolean,
        default: () => false
    },
    isLeaveBar:{
        type:Boolean,
        default:true
    }
})

const { enter, leave, autoHideNav, isLeaveBar } = toRefs(props)

const emit = defineEmits(['update:isLeaveBar'])

// 鼠标移入
const handleMouseEnter = () => {
    if (autoHideNav.value) {
        //    if(!isEnter.value) return
        // isLeaveBar.value = false
        emit('update:isLeaveBar', false)
    }

}

// 鼠标移出
const handleMouseLeave = () => {
    if (autoHideNav.value) {
        //    if(!isLeave.value) return
        setTimeout(() => {
            // isLeaveBar.value = true
            emit('update:isLeaveBar', true)
        }, 800);

    }

}

// 当动画进入时，限制鼠标移入移出事件
const isLeave = ref(false)
const isEnter = ref(false)
// 动画进入前
const handleBeforeEnter = () => {
    document.documentElement.style.setProperty('--animate-duration', '1s');
    isLeave.value = true
}

// 动画进入
const handleEnter = () => {
}


const handleAfterEnter = () => {
    isLeave.value = false
}

// 动画离开前
const handleBeforeLeave = () => {
    document.documentElement.style.setProperty('--animate-duration', '.5s');
    isEnter.value = true

}

// 动画离开
const handleLeave = () => {

}

const handleAfterLeave = () => {
    isLeave.value = false
}
</script>
<style lang='scss' scoped></style>