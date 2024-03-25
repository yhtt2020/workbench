<template>
    <div class="w-full p-4 rounded-xl xt-bg-2">
        <div class="flex justify-between">
            <div class="text-base xt-text">自定义图标背景色</div>
            <a-switch v-model:checked="props.colorSwitch" @change="changeColorSwitch"></a-switch>
        </div>
        <div class="mt-2 mb-4 text-sm xt-text-2"> {{ props.tip }} </div>
        <div v-if="props.colorSwitch">
            <xt-option-color
              v-model:color="themeColor"
              class="w-full"
              style="padding-bottom: 0 !important"
              @cb="updateBackground"
            />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref,onMounted,toRefs } from 'vue'

// props
export interface colorProps {
    colorSwitch: boolean, // 是否显示颜色选择
    tip: string, // 提示
    color: string // 颜色
}

const props = withDefaults(defineProps<colorProps>(), {
    colorSwitch: true,
    tip: '',
    color: '',
})

const {color} = toRefs(props)
const themeColor = ref('')
const colorIndex = ref(0)

// 按钮回调
const emit = defineEmits(['update:colorSwitch', 'changeBg'])
const changeColorSwitch = () => {
    emit('update:colorSwitch', props.colorSwitch)
}
// 更新背景颜色
const updateBackground = (item) => {
    colorIndex.value = 0
    emit('changeBg', item)

}

onMounted(() => {
    themeColor.value = color.value
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