<template>
    <div class="w-full p-4 rounded-xl xt-bg-2">
        <div class="flex justify-between">
            <div class="text-base xt-text">自定义图标背景色</div>
            <a-switch v-model:checked="props.colorSwitch" @change="changeColorSwitch"></a-switch>
        </div>
        <div class="mt-2 mb-4 text-sm xt-text-2"> {{ props.tip }} </div>
        <div v-if="props.colorSwitch">
            <div class="item-box">
                <div class="flex items-center justify-center mr-4 item" :key="item"
                    :style="{ background: props.colorList[`${'color' + item}`] }" v-for="item, index in 6"
                    @click="chooseBg(item)">
                    <xt-new-icon v-show="colorIndex == item" icon="ri:checkbox-circle-fill" size="20"></xt-new-icon>
                </div>
                <colorP @change="updateBackground"/>
            </div>

        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, watch, onMounted,computed } from 'vue'
import colorP from './colorP.vue'
// 按钮回调
const emit = defineEmits(['update:colorSwitch', 'changeBg'])
const changeColorSwitch = () => {
    emit('update:colorSwitch', props.colorSwitch)
}
const colorPicker = ref('#ffffff')
const colorList = ref({
    color1: '#508BFE',
    color2: '#815BD0',
    color3: '#C8BF55',
    color4: '#DE5D5D ',
    color5: '#57BF60',
    color6: '#DE5DB3',
    color7: '#000000',
    color8: '#7F9CA5',
    color9: '#505050',
    color10: '#43607D',
    color11: '#3A5976',
    color12: '#4F4F80',
    color13: '#804F4F',
    color14: '#FFFFFF',
})
const chooseBg = (item) => {
    colorIndex.value = item
    emit('changeBg', colorList.value[`${'color' + item}`])
}
const updateBackground = (item) => {
    // emit('changeBg', item)
    console.log(item,'item');
    
}

const colorIndex = ref(0)
const customColor = ref(false)
const props = withDefaults(defineProps<colorProps>(), {
    colorSwitch: true,
    tip: '',
    colorList:{
        color1: '#508BFE',
        color2: '#815BD0',
        color3: '#C8BF55',
        color4: '#DE5D5D',
        color5: '#57BF60',
        color6: '#DE5DB3',
    }

})
export interface colorProps {
    colorSwitch: boolean,
    colorList?:object,
    tip: string
}
watch(colorIndex, (newVal, oldVal) => {
    console.log(newVal, oldVal)
})
</script>
<style lang='scss' scoped>
.item {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    cursor: pointer;
    margin-bottom: 16px;
}

.item-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
}
</style>