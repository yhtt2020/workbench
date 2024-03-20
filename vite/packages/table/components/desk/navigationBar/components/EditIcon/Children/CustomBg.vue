<template>
    <div class="w-[452px]">
        <!-- 图标与名称预览 -->
        <div class="flex items-center justify-center mb-4">
            <div class="flex flex-col items-center justify-center">
                <div class="relative overflow-hidden rounded-lg w-[52px] h-[52px] flex items-center justify-center"
                    :style="{background:editItem.isBg ? editItem.bg : 'var(--primary-bg)'}">
                    <a-avatar 
                        :size="42" 
                        shape="square" 
                        :src="editItem.icon" 
                        :style="[editItem.color]" >
                    </a-avatar>
                </div>
                <xt-text class="mt-2 text-sm text-center">{{ editItem.name }}</xt-text>
            </div>
            
        </div>
        <!-- 修改图标和名称 -->
        <div class="p-4 mb-4 xt-bg-2 rounded-xl">
          <xt-option-info
            title="图标和名称"
            info="支持自定图标和名称。"
            icon="fluent:arrow-clockwise-16-regular"
            @onIconClick="reset"
          />
          <xt-option-icon
            :key="editItem.name"
            v-model:icon="editItem.icon"
            v-model:input="editItem.name"
            @cb="getAvatar"
          />
        </div>
        <!-- 图标背景颜色选择 -->
        <xt-option-box>
            <xt-option-info 
                title="自定义图标背景色" 
                isSwitch="true" 
                v-model:switch="navigationStore.colorSwitch"
                info="通用的图标背景色，仅支持选了icon和emoji的图标背景。" />
            <xt-option-color v-if="navigationStore.colorSwitch" v-model:color="props.editItem.bg" @cb="changeBg" />
        </xt-option-box>
    </div>
</template>

<script setup lang='ts'>
import { ref,watch } from 'vue'
import { useNavigationStore } from '../../../navigationStore'
const navigationStore = useNavigationStore()
const props=defineProps({
    editItem:Object
})
// 回调改变背景颜色
const changeBg = (value) => {
    if(props.editItem.isBg){
        props.editItem.bg = value
    }

}
// 获取图标
const getAvatar = (value) => {
    // props.editItem.icon = value
    props.editItem.isBg = true
    getImgColor(props.editItem)
}
// 重置
const reset = () => {
    const editItem : any = props.editItem
    // console.log(editItem.default)
    // 图标
    editItem.icon = editItem.default.icon
    // 背景颜色
    editItem.bg = editItem.default.bg
    // 是否显示背景颜色
    editItem.isBg = false
    // 图标颜色
    editItem.color = ''
    // 名称
    editItem.name = editItem.default.name
}
// 判断图标类型
const getImgColor = (item) => {
    if(item.icon.includes('color=#')){
        const bg = item.icon.slice(-7)
        props.editItem.color = {
            filter: `drop-shadow(${bg} 80px 0)`,
            transform: 'translateX(-80px)',
        }
    }
}

// 防止icon变化，导致背景颜色变化，导致图标颜色变化
watch(()=>props.editItem.icon,(newV,oldV)=>{
    if(newV.includes('color=#')){
        getImgColor(props.editItem)
    }else{
        props.editItem.color = ''
    }
})

</script>
<style lang='scss' scoped>
.reset {
    color: var(--active-bg) !important;
}
</style>
