<template>
    <div v-if="clockSettingVisible"
        style="position: absolute;"
        :style="[position]"
        class="p-3 rounded-lg xt-main-bg box">
        <vue-custom-scrollbar :settings="outerSettings"
            style="position: relative; height: 520px;color: var(--primary-text);width: 300px; " class="scroll">
            <div class="">
                <div class="flex justify-between">
                    <div class="mb-3 font-14 xt-text-2">添加闹钟</div>
                    <xt-button icon="fluent:dismiss-16-filled" :w="24" :h="24" @click="settingClock"></xt-button>
                </div>

                <div class="mb-3 ">
                    <a-input ref="input" allow-clear  v-model:value="eventValue"
                        style="border-radius: 10px;height: 40px; width: 100%;border: 1px solid var(--divider);"
                        class="xt-bg-2"
                        placeholder="新闹钟" />
                </div>

                <div class="mb-3 font-16 xt-text">小时 {{ timeHour }}</div>
                <div class="ml-1">
                    <div class="flex flex-wrap w-[288px]  xt-bg-2 rounded-lg " style="">
                        <div v-for="(i, index) in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]"
                            style="width: 48px;height: 40px;line-height: 40px;text-align: center;flex-shrink: 0;"
                            class="flex items-center justify-center xt-text-2 pointer setting-hour"
                            :class="{ 'active': timeHour === index }" @click="timeHour = index">
                            {{ index }}
                        </div>
                    </div>

                </div>
                <div>
                    <div class="mt-4 mb-3 font-16 xt-text">分钟</div>
                    <a-input-number 
                        id="inputNumber" 
                        v-model:value="timeMinute" 
                        :min="0" 
                        :max="59" 
                        defaultValue="0"
                        class="xt-bg-2"
                        style="border-radius: 12px; width: 100%; height: 42px; line-height: 40px;border: 1px solid var(--divider);" />
                </div>
                <div class="w-full mt-4 mb-3">
                    <div class="mt-4 mb-3 font-16 xt-text">
                        重复
                    </div>
                    <RadioTab 
                        class="xt-bg-2" 
                        :navList="dataType" 
                        v-model:selectType="defaultType"
                        >
                    </RadioTab>
                </div>
                <div class="flex justify-between ">
                    <xt-button type="primary" class="mt-2 font-16 xt-text"
                        style="width: 48%; height: 40px; background-color: var(--primary-bg); "
                        @click="settingClock">取消</xt-button>
                    <xt-button type="primary" class="mt-2 font-16 xt-text"
                        style="width: 48%; height: 40px; background-color: var(--active-bg);"
                        @click="addSettingClock">确认添加</xt-button>
                </div>
            </div>

        </vue-custom-scrollbar>
    </div>
</template>

<script setup lang='ts'>
import { ref, toRefs , computed } from 'vue'
import { storeToRefs } from 'pinia';
import { message } from 'ant-design-vue'
import dayjs from 'dayjs';

import RadioTab from '../../../RadioTab.vue';


import { timeStamp } from '../../../../util';

import { cardStore } from '../../../../store/card';
import { useNavigationStore } from '../../../desk/navigationBar/navigationStore';

const useCard = cardStore()
const useNav = useNavigationStore()
const { currentNavPosition , currentNavFormat } = storeToRefs(useNav)

const emit = defineEmits(['closeClock'])

type AlarmType = {
    // 闹钟
    clockSettingVisible:boolean,
    // 定位
    position:{
        x:number,
        y:number
    }
}

const props = withDefaults(defineProps<AlarmType>(), {
    clockSettingVisible: false,
    position: {
        x: 0,
        y: 0
    }
})

const { clockSettingVisible } = toRefs(props)

const outerSettings = ref({
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true,
})

const dataType = ref([{ title: '不重复', name: '不重复' }, { title: '每天', name: '每天' }])
const defaultType = ref({ title: '不重复', name: '不重复' })

const eventValue = ref('')

const timeHour = ref(0)
const timeMinute = ref(0)

const flag = ref(true)

const position = computed(() => {
    if(currentNavFormat.value === 'windows'){
        if(currentNavPosition.value === 'top'){
            return 'left:-330px;top: -10px;'
        }
        return 'left:-330px;top: -180px;'
    }
    return 'left:330px;top: 60px;'
})

// 关闭闹钟设置界面
const settingClock = () => {
    emit('closeClock', false)
}

const addSettingClock = () => {
    if (eventValue.value === "") {
        if (flag.value !== true) return;
        flag.value = false;
        message.info("闹钟名称不可为空！");
        setTimeout(() => {
            flag.value = true;
        }, 500);
        return;
    }

    let date = new Date(Date.now())
    let timeSpan = {
        day: date.getDate(),
        hours: timeHour.value < 10 ? '0' + timeHour.value : timeHour.value,
        minutes: timeMinute.value < 10 ? '0' + timeMinute.value : timeMinute.value,
        month: date.getMonth() + 1,
        seconds: '00',
        year: date.getFullYear()
    }
    let dateSpan = timeStamp(timeSpan)


    useCard.addClock({
        clockType: defaultType.value.name,
        eventValue: eventValue.value,
        dateValue: timeSpan,
        clockTimeStamp: timeSpan
    });
    message.success("添加成功！");
}

</script>
<style lang='scss' scoped>
.active {
    background: rgba(80, 139, 254, 0.20);
}
.scroll{
    &::-webkit-scrollbar {
        display: none !important;
    }
}
.setting-hour {
    &:hover{
        background: rgba(80, 139, 254, 0.20);
        font-size: 20px;
    }
    transform: all 0.3s;
    font-family: Oswald-Regular;

    &:nth-child(1) {
        border-radius: 10px 0 0 0;
    }

    &:nth-child(6) {
        border-radius: 0 10px 0 0;
    }

    &:nth-child(19) {
        border-radius: 0 0 0px 10px;
    }

    &:nth-child(24) {
        border-radius: 0 0 10px 0;
    }
}
</style>