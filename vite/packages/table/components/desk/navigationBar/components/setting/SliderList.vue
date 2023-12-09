<template>
    <div class="w-full p-4 mb-4 xt-bg-2 rounded-xl" >
        <div class="w-full" v-for="(item, index) in props.sliderList">
            <div class="flex mb-2">
                <div class="mr-2 text-base xt-text">{{ item.title }}</div>
                <xt-new-icon icon="fluent:arrow-clockwise-16-regular" size="16" @click="reset"></xt-new-icon>
            </div>
            <a-row>
                <a-col :span="18">
                    <a-slider v-model:value="item.value" :min="item.min" :max="item.max" :step="item.step"/>
                </a-col>
                <a-col :span="4">
                    <a-input-number v-model:value="item.value" :min="1" :max="20" class="input"
                        style="width: 80px;height: 40px;border: 1px solid var(--divider);border-radius: 12px;margin-left: 16px;" />
                </a-col>
            </a-row>
            <div class="h-[1px] bg-[var(--divider)] mt-3 mb-3" v-if="index !==props.sliderList.length-1"></div>
        </div>

    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, watch } from 'vue'
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
const reset = () => {
    console.log(1111111);

}

</script>
<style lang='scss' scoped></style>