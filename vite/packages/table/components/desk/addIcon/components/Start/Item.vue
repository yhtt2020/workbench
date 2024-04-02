<template>
    <div class="flex flex-wrap items-center justify-center w-full mb-6" :class="className">
        <div class="">
            <div class="text-center xt-text">{{ menu.title }}</div>
            <div class="mt-4 text-center xt-text-2">{{ menu.info }}</div> 
        </div>
    </div>
    <div class="flex flex-wrap" style="gap: 24px;" :class="classItem">
        <Icon 
            :item="item" 
            @click="choose(item,index)" 
            v-for="(item,index) in menu.list" 
            :key="index">
        </Icon>
    </div>
    
    
</template>

<script setup lang='ts'>
import { ref, toRefs } from 'vue'
import Icon from './Icon.vue'

const props = defineProps({
    menu: Object,
    className: String,  // 文字类
    classItem: String,  // 按钮类
})

const { menu,className } = toRefs(props)

const emit = defineEmits(['choose'])

const choose = (item,index) => {
    emit('choose',item,index)
}

</script>
<style lang='scss' scoped></style>