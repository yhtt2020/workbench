<template>
    <div class="w-[452px]">
        <div class="flex items-center w-full p-4 mb-4 xt-bg-2 rounded-xl">
            <div style="width: 56px; height: 56px;" v-if="true" :style="{background:props.editItem.bgColor || 'var(--primary-bg)'}" class="relative flex items-center justify-center rounded-xl" @click="modelValue=!modelValue">
                <a-avatar :size="52" shape="square" :src="props.editItem.icon" ></a-avatar>
            </div>
            <!-- <div v-else style="width: 52px; height: 52px;" class="relative flex items-center justify-center rounded-xl">
                <a-avatar :size="52" shape="square" :src="renderIcon(props.editItem.icon)" @click="modelValue=!modelValue"></a-avatar>
            </div> -->
            <div class="flex flex-col justify-start ml-5">
                <div>点击图标选择合适的icon、emoji，或上传自定义图片。</div>
                <div class="flex justify-start mt-1" @click="reset">
                    <xt-new-icon icon="fluent:arrow-clockwise-16-regular" size="20" class="reset"></xt-new-icon>
                    <div class="ml-2 text-base reset pointer">重置图标</div>
                </div>
            </div>
        </div>
        <xt-selectIcon :defaultIcon="defaultIcon" v-model="modelValue" @getAvatar="getAvatar"
            :isUpload="true"></xt-selectIcon>
        <CustomIconBg :colorSwitch="navigationStore.colorSwitch"
            @update:colorSwitch="navigationStore.colorSwitch = !navigationStore.colorSwitch" @changeBg="changeBg" />
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, computed,onMounted } from 'vue'
import { useNavigationStore } from '../../../navigationStore'
import CustomIconBg from './CustomIconBg.vue'
import { renderIcon } from '../../../../../../js/common/common'
const navigationStore = useNavigationStore()
const modelValue = ref(false)
const defaultIcon = ref('')
const bgColor = ref('')
const props=defineProps({
    editItem:Object
})
// 回调改变背景颜色
const changeBg = (value) => {
    bgColor.value = value
    props.editItem.bgColor = value
    console.log(props.editItem,'====>>>>editItem');
    
}
const getAvatar = (value) => {
    props.editItem.icon = value
}
// 重置
const reset = () => {
    props.editItem.icon = defaultIcon.value
    bgColor.value = ''
    props.editItem.bgColor = ''
}
// 判断图标类型
// const isIcon = computed(() => {
//     if (defaultIcon.value.includes('https')) {
//         return false
//     } else {
//         return true
//     }
// })
onMounted(()=>{
    console.log(props.editItem,'====>>>>editItem');
    defaultIcon.value=props.editItem.icon
})
</script>
<style lang='scss' scoped>
.reset {
    color: var(--active-bg) !important;
}
</style>