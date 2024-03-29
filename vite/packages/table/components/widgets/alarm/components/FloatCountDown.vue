<template>
    <div v-show="countDownVisible"
        style="position: absolute; left:-330px;top: -1px;"
        class="p-3 rounded-lg xt-main-bg">
        <vue-custom-scrollbar :settings="outerSettings"
            style="position: relative; height: 400px;color: var(--primary-text);width: 300px; " class="scroll">
            <div class="flex justify-between">
                <div class="mb-3 font-14 xt-text-2">添加计时器</div>
                <xt-button icon="fluent:dismiss-16-filled" :w="18" :h="18" @click="settingCountDown"></xt-button>
            </div>
            <div class="flex flex-col" style="gap: 10px">
                <div v-for="(item, index) in countDownData()" :key="index"
                    class="w-full font-16 xt-text h-[40px] text-center xt-bg-2 rounded-lg pointer"
                    style="line-height: 40px;" @click="onCountDown(item)">{{ item.title }}</div>
            </div>

        </vue-custom-scrollbar>

    </div>
    <a-modal v-model:visible="custom" title="" @ok="() => { }" :footer="null" centered
        style="font-size: 8px;color: var(--primary-text); " :maskClosable="false">
        <div style="display: flex;flex-direction: column;align-items: center;">
            <div style="">自定义倒计时</div>
            <a-space direction="vertical" style="margin: 14px" >
                <a-time-picker v-model:value="value1" size="large" 
                    :showNow="false" popupClassName="popupClass" />
            </a-space>
            <xt-button type="primary" @click="addCustom"
                style="margin: 14px; background: var(--active-bg);">开始倒计时</xt-button>
        </div>
    </a-modal>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import { countDownData } from '../Data';
import { storeToRefs } from 'pinia';
import dayjs from 'dayjs'

import { countDownStore } from '../../../../store/countDown';

const useCountDownStore = countDownStore()

const emit = defineEmits(['closeCountDown'])

type PropsType = {
    countDownVisible: boolean,
    position:{
        x:number,
        y:number
    }
}

const props = withDefaults(defineProps<PropsType>(), {
    countDownVisible: false,
    position:{
        x:0,
        y:0
    }
});

const outerSettings = ref({
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true,
})

const custom = ref(false)

const value1 = ref(dayjs('00:00:00', 'HH:mm'))

const settingCountDown = () => {
    emit('closeCountDown')
}

// 设置倒计时
const onCountDown = (item) => {
    // 自定义
    if(item.isCustom){
        custom.value = true
        settingCountDown()
    } else {
        item.fn()
    }
    useCountDownStore.countDownBtn = false
}

// 添加自定义倒计时
const addCustom = () => {
    useCountDownStore.setCountDown({
        hours: parseFloat(value1.value.$H),
        minutes: parseFloat(value1.value.$m),
        seconds: parseFloat(value1.value.$s)
    })
    custom.value = false
}

</script>
<style lang='scss' scoped></style>