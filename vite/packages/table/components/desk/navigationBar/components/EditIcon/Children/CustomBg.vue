<template>
    <div class="w-[452px]">
        <!-- {{ props.editItem.icon }} -->
        <div class="flex items-center w-full p-4 mb-4 xt-bg-2 rounded-xl">
            <div style="width: 56px; height: 56px;flex-shrink: 0;" v-if="!props.editItem.isBg" :style="{background:props.editItem.isBg ? props.editItem.bg : 'var(--primary-bg)'}"
            class="relative flex items-center justify-center rounded-xl pointer" @click="modelValue=!modelValue">
                <a-avatar :size="52" shape="square" :src="props.editItem.icon" ></a-avatar>
            </div>
            <div v-else style="width: 56px; height: 56px;flex-shrink: 0;" :style="{background:props.editItem.isBg ? props.editItem.bg : 'var(--primary-bg)'}"
            class="relative flex items-center justify-center overflow-hidden rounded-xl pointer" @click="modelValue=!modelValue">
                <a-avatar :size="36" shape="square" :src="props.editItem.icon" :style="[props.editItem.color]" ></a-avatar>
            </div>
            <!-- {{ imgBg  }} -->
            <div class="flex flex-col justify-start ml-5">
                <div class="text-sm xt-text">点击图标选择合适的icon、emoji，或上传自定义图片。</div>
                <!-- {{ props.editItem.color }} -->
                <div class="flex justify-start mt-1" @click="reset">
                    <xt-new-icon icon="fluent:arrow-clockwise-16-regular" size="16" class="reset"></xt-new-icon>
                    <div class="ml-2 text-sm reset pointer">重置图标</div>
                </div>
            </div>
        </div>
        <xt-selectIcon :defaultIcon="defaultIcon" v-model="modelValue" @getAvatar="getAvatar"
            :isUpload="true"></xt-selectIcon>
        <CustomIconBg :colorSwitch="navigationStore.colorSwitch"
            @update:colorSwitch="navigationStore.colorSwitch = !navigationStore.colorSwitch" @changeBg="changeBg"  :tip="'通用的图标背景色，仅支持选了icon和emoji的图标背景。'"/>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, computed,onMounted } from 'vue'
import { useNavigationStore } from '../../../navigationStore'
import {renderIcon} from '../../../../../../js/common/common'
import CustomIconBg from './CustomIconBg.vue'
import { navStore } from '../../../../../../store/nav';
const useNavStore = navStore()
const navigationStore = useNavigationStore()
const modelValue = ref(false)
const defaultIcon = ref('')
const bgColor = ref('')
const props=defineProps({
    editItem:Object
})
// 回调改变背景颜色
const changeBg = (value) => {
    if(props.editItem.isBg){
        bgColor.value = value
        props.editItem.bg = value
    }

}
// 获取图标
const getAvatar = (value) => {
    props.editItem.icon = value
    props.editItem.isBg = true
    getImgColor(props.editItem)
}
// 重置
const reset = () => {
    const target = navigationList.value.find(item =>{
        if(item.type === 'coolApp'){
            return item.value.url === props.editItem.value.url
        }else{
            return item.value === props.editItem.value
        }
    } )
    props.editItem.icon = target?.icon
    bgColor.value = ''
    props.editItem.bg = ''
    props.editItem.isBg = false
    props.editItem.color = ''
}
// 判断图标类型
// const isIcon = computed(() => {
//     if (props.editItem.icon.includes('https')) {
//         return true
//     } else {
//         return false
//     }
// })
const getImgColor = (item) => {
    if(item.icon.includes('color=#')){
        const bg = item.icon.slice(-7)
        props.editItem.color = {
            filter: `drop-shadow(${bg} 80px 0)`,
            transform: 'translateX(-80px)',
        }
    }
}
// 图片颜色解析
const imgBg = computed(() => {
  const img = props.editItem.icon
  if(img.includes('color=#')){
    const bg = img.slice(-7)
    return {
      filter: `drop-shadow(${bg} 80px 0)`,
      transform: 'translateX(-80px)',
    };
  }else{
    return
  }
});
const navigationList = computed(() => {
    return [...useNavStore.footNavigationList,...useNavStore.sideNavigationList,...useNavStore.rightNavigationList]
})
</script>
<style lang='scss' scoped>
.reset {
    color: var(--active-bg) !important;
}
</style>
