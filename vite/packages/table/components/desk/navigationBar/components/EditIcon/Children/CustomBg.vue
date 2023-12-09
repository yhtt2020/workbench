<template>
    <div class="w-[452px]">
        <div class="flex items-center w-full p-4 mb-4 xt-bg-2 rounded-xl">
            <div  class="flex items-center justify-center w-[56px] h-[56px] rounded-xl flex-shrink-0" @click="modelValue=!modelValue" :style="{background:bgColor || 'var(--primary-bg)'}">
                <xt-new-icon v-if="isIcon" :icon="defaultIcon" size="36"  ></xt-new-icon>
                <a-avatar v-else :src="defaultIcon" shape="square" :size="40" class="flex-shrink-0 xt-bg" style="border-radius: 10px;" ></a-avatar>
            </div>
            <div class="flex flex-col justify-start ml-5">
                <div>点击图标选择合适的icon、emoji，或上传自定义图片。</div>
                <div class="flex justify-start mt-1" @click="reset">
                    <xt-new-icon icon="fluent:arrow-clockwise-16-regular" size="20" class="reset" ></xt-new-icon>
                    <div class="ml-2 text-base reset pointer">重置图标</div>
                </div>
            </div>
        </div>
        <xt-selectIcon :defaultIcon="defaultIcon" v-model="modelValue"  @getAvatar="getAvatar" :isUpload="true"></xt-selectIcon>
        <CustomIconBg :colorSwitch="navigationStore.colorSwitch" @update:colorSwitch="navigationStore.colorSwitch=!navigationStore.colorSwitch" @changeBg="changeBg"/>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive,computed } from 'vue'
import {useNavigationStore} from '../../../navigationStore'
import CustomIconBg from './CustomIconBg.vue'
const navigationStore=useNavigationStore()
const modelValue=ref(false)
const defaultIcon=ref('fluent:music-note-2-16-regular')
const bgColor=ref('')
// 回调改变背景颜色
const changeBg=(value)=>{
    bgColor.value=value
}
const getAvatar=(value)=>{
    defaultIcon.value=value
}
// 重置
const reset=()=>{
    defaultIcon.value='fluent:music-note-2-16-regular'
    bgColor.value=''
}
// 判断图标类型
const isIcon=computed(()=>{
    if(defaultIcon.value.includes('https')){
        return false
    }else{
        return true
    }
})
</script>
<style lang='scss' scoped>
.reset{
    color: var(--active-bg) !important;
}

</style>