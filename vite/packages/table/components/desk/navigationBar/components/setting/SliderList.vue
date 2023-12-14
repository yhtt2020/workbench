<template>
    <div class="w-full p-4 mb-4 xt-bg-2 rounded-xl" >
        <div class="w-full" v-for="(item, index) in props.sliderList">
            <div class="flex mb-2">
                <div class="mr-2 text-base xt-text">{{ item.title }}</div>
                <xt-new-icon icon="fluent:arrow-clockwise-16-regular" size="18" @click="reset(item,index)"></xt-new-icon>
            </div>
            <a-row align="middle">
                <a-col :span="18">
                    <a-slider v-model:value="item.value" :min="item.min" :max="item.max" :step="item.step" @change="changeValue"/>
                </a-col>
                <a-col :span="4">
                    <a-input-number v-model:value="item.value" :min="1" :max="20" class="input"
                        style="
                        width: 80px;height: 40px;border: 1px solid var(--divider);
                        border-radius: 12px;margin-left: 16px;line-height: 38px;
                        color: var(--primary-text);" @change="changeValue"/>
                </a-col>
            </a-row>
            <div class="h-[1px] bg-[var(--divider)] mt-3 mb-3" v-if="index !==props.sliderList.length-1"></div>
        </div>

    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, watch } from 'vue'
const emit=defineEmits(['reset','change'])
const props = defineProps({
    sliderList: {
        type: Object,
        default: () => [{
            title: '导航栏尺寸',
            min: 1,
            max: 20,
            value: 1,
            step:2
        }]
    }

})
// 重置数据
const reset = (item,index) => {
    emit('reset',item,index)

}
// 修改数据
const changeValue=(value)=>{
    console.log(value,'====>>>>');
    
    emit('change',value)
}
</script>
<style lang='scss' scoped></style>