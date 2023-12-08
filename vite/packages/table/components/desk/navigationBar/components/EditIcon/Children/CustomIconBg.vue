<template>
    <div class="w-full p-4 rounded-xl xt-bg-2">
        <div class="flex justify-between">
            <div class="text-base xt-text">自定义图标背景色</div>
            <a-switch v-model:check="customColor"></a-switch>
        </div>
        <div class="mt-2 mb-4 text-sm xt-text-2">默认使用通用设置，不支持已经上传自定义图片的图标。</div>
        <div>
            <!-- @click="updateBackground(colorList[`${'color' + item}`],item)" -->
            <div class="item-box">
                <div class="flex items-center justify-center mr-4 item" :key="item"
                    :style="{ background: colorList[`${'color' + item}`] }" v-for="item, index in 14"
                    @click="chooseBg(item)">
                    <Icon v-show="colorIndex == item" icon="ri:checkbox-circle-fill" width="20" height="20" />
                </div>
            </div>
        </div>
        <div class="h-[1px] w-full mt-4 mb-4" style="background: var(--divider);"></div>
        <div class="mb-4 text-base xt-text">更多颜色</div>
        <!-- <colorPicker v-model:hex="colorPicker" /> -->
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
const colorPicker=ref('#ffffff')
const colorList=ref({
    color1:'#508BFE',
    color2:'#815BD0',
    color3:'#C8BF55',
    color4:'#DE5D5D ',
    color5:'#57BF60',
    color6:'#DE5DB3',
    color7:'#000000',
    color8:'#7F9CA5',
    color9:'#505050',
    color10:'#43607D',
    color11:'#3A5976',
    color12:'#4F4F80',
    color13:'#804F4F',
    color14:'#FFFFFF',
})
const chooseBg=(item)=>{
    colorIndex.value = item
    console.log(item);
    
}
const colorIndex=ref(0)
const customColor=ref(false)
</script>
<style lang='scss' scoped>
.item{
    width: 40px;
    height: 40px;
    border-radius: 10px;
    cursor: pointer;
    margin-bottom: 16px;
}
.item-box{
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
}
</style>