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
                <colorP @change="updateBackground" />
            </div>

        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
import colorP from './colorP.vue'
// 按钮回调
const emit = defineEmits(['update:colorSwitch', 'changeBg'])
const changeColorSwitch = () => {
    emit('update:colorSwitch', props.colorSwitch)
}
const chooseBg = (item) => {
    if (colorIndex.value === item) {
        colorIndex.value = 0
        emit('changeBg', '')
    } else {
        colorIndex.value = item
        emit('changeBg', props.colorList[`${'color' + item}`])
    }

}
const updateBackground = (item) => {
    colorIndex.value = 0
    emit('changeBg', item)

}

const colorIndex = ref(0)
const props = withDefaults(defineProps<colorProps>(), {
    colorSwitch: true,
    tip: '',
    colorList: {
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
    colorList?: object,
    tip: string
}
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