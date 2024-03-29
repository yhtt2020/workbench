<template>
    <!-- style="box-shadow: 1px 1px var(--secondary-bg);" -->
    <div style="position: absolute; z-index: 1000;" :style="{left:position.x+'px',top:position.y+'px'}">
        <!-- 闹钟设置界面 -->
        <FloatAlarm :clockSettingVisible="clockSettingVisible" @closeClock="settingClock"></FloatAlarm>
        <!-- 倒计时设置界面 -->
        <FloatCountDown :countDownVisible="countDownVisible" @closeCountDown="settingCountDown"></FloatCountDown>
        <!-- 一级快捷面板 -->
        <div class="w-[300px] h-[300px] relative xt-main-bg  rounded-lg p-0 " v-if="clockVisible">
            <div class="pt-4 pl-4 pr-4" style="">
                <div class="flex justify-between w-full h-[56px] rounded-md items-center xt-bg-2 pl-4 pr-4 mb-2"
                    v-if="useCountDownStore.countDowntime.hours !== undefined">
                    <div>
                        <clockIcon icon="akar-icons:pause" style="font-size: 24px; vertical-align: sub;"
                            @click="stopCountDown" class="xt-text clock-icon pointer"
                            v-show="!useCountDownStore.countDownBtn">
                        </clockIcon>
                        <clockIcon icon="fluent:play-16-filled" style="font-size: 24px; vertical-align: sub;"
                            @click="startCountDown" class="xt-text clock-icon pointer"
                            v-show="useCountDownStore.countDownBtn">
                        </clockIcon>
                        <clockIcon icon="fluent:dismiss-16-filled" style="font-size: 24px; vertical-align: sub;"
                            @click="deleteCountDown" class="ml-2 xt-text clock-icon pointer">
                        </clockIcon>

                    </div>
                    <div style="font-family: Oswald-Medium;font-size: 20px;color: #FAAD14;font-weight: 500;">
                        {{ useCountDownStore.countDowntime.hours + ':' + useCountDownStore.countDowntime.minutes +
                            ':' + useCountDownStore.countDowntime.seconds }}
                    </div>
                </div>
                <div class="flex justify-between">
                    <div class="font-14 xt-text">
                        我的闹钟
                    </div>
                    <div class="flex" style="gap: 12px;">
                        <a-tooltip arraw="false" autoAdjustOverflow title="添加闹钟">
                            <xt-button icon="fluent:add-16-filled" @click="settingClock"  :w="20" :h="20" class="clock-icon"></xt-button>
                        </a-tooltip>
                        <a-tooltip autoAdjustOverflow title="设置定时器">
                            <xt-button icon="fluent:clock-12-regular" @click="settingCountDown" :w="20" :h="20" class="clock-icon"></xt-button>
                        </a-tooltip>
                        <a-tooltip autoAdjustOverflow title="铃声调节">
                            <xt-button icon="akar-icons:sound-on" v-if="soundVisible" @click="changeSoundStatus" :w="20" :h="20" class="clock-icon"></xt-button>
                            <xt-button icon="akar-icons:sound-off" v-if="!soundVisible" @click="changeSoundStatus" :w="20" :h="20" class="clock-icon"></xt-button>
                        </a-tooltip>
                        <a-tooltip autoAdjustOverflow color="var(--primary-bg) !important;" title="设置">
                            <xt-button icon="fluent:settings-16-regular" @click="changeSettingStatus" :w="20" :h="20" class="clock-icon setting-hover"></xt-button>
                        </a-tooltip>

                    </div>
                </div>
            </div>

            <vue-custom-scrollbar :settings="outerSettings" style="position: relative; "
                :style="{ height: heightScorll }"
                class="scroll">
                <div class="pl-4 pr-4 ">
                    <div class="flex items-center mt-3 overflow-hidden" v-for="(item, index) in clockEvent"
                        @contextmenu="deleteClock(index)">
                        <div class="flex items-center rounded-lg event-list xt-bg-2 xt-text"
                            style="width: calc(100% );height: 56px; ">
                            <div class="flex items-center justify-between w-full ml-4 mr-4 card-list">
                                <div class="flex flex-col event-title items-between">
                                    <span class="font-14 xt-text">{{ item.eventValue }}</span>
                                    <span class="font-12 xt-text-2" style="color:var(--secondary-text)">{{
                                        item.clockType
                                    }}</span>
                                </div>
                                <span class="font-20">{{ item.dateValue.hours }}:{{ item.dateValue.minutes }}</span>
                            </div>

                        </div>
                    </div>
                </div>
            </vue-custom-scrollbar>
        </div>
    </div>

    <a-drawer v-model:visible="topClockSettingVisible" class="custom-class xt-text" style="color: red" title="设置"
        placement="right" :width="600">
        <div class="flex">
            <SetupClock></SetupClock>
        </div>
    </a-drawer>
</template>

<script setup lang='ts'>
import { ref, reactive, computed, onMounted, watch, h } from 'vue'
import { Icon as clockIcon } from '@iconify/vue'
import { cardStore } from '../../store/card'
import { timerStore } from '../../store/timer'
// 控制设置顶部按钮显示以及闹钟的筛选
import { topClockSettingStore } from '../../store/topClockSetting'
import { countDownStore } from '../../store/countDown'
import { Notifications } from '../../js/common/sessionNotice'
import SetupClock from './setClock.vue'
import FloatAlarm from './alarm/components/FloatAlarm.vue';
import FloatCountDown from './alarm/components/FloatCountDown.vue';

const notifications = new Notifications()
const usetopClockSettingStore = topClockSettingStore()
onMounted(() => {
    closeDetail()
    if (useCountDownStore.countDowntime.seconds == '00' && useCountDownStore.countDowntime.minutes == '00' && useCountDownStore.countDowntime.hours == '00') {
        useCountDownStore.dCountDown()
    }

})
const topClockSettingVisible = ref(false)

const useTimerStore = timerStore()
const useCardStore = cardStore();
const clockSettingVisible = ref(false)
const clockEvent = computed(() => useCardStore.clockEvent)
const firstClockTime = computed(() => clockEvent.value[0]?.dateValue)
const outerSettings = reactive({
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true,
})
const customizeSetting = ref(false)
const countDownVisible = ref(false)
const useCountDownStore = countDownStore()
const custom = ref(false)
const soundVisible = ref(true)

const emit = defineEmits(['close'])
const props = defineProps({
    position:{
        type:Object,
        default:()=>({
            x:0,
            y:0
        })
    },
    clockVisible:{
        type:Boolean,
        default:false
    }
})
const changeSoundStatus = () => {
    soundVisible.value = !soundVisible.value
    usetopClockSettingStore.changeSoundStatus(soundVisible.value)
}
const heightScorll=computed(()=>{
    if(useCountDownStore.countDowntime.hours !== undefined){
        return 'calc(100% - 112px)'
    }else{
        return 'calc(100% - 56px)'
    }
})

// 开启倒计时设置页面
const settingCountDown = (e) => {
    if (clockSettingVisible.value) {
        clockSettingVisible.value = false
    }
    countDownVisible.value = !countDownVisible.value
}
// 打开闹钟的设置页面
const settingClock = () => {
    if (countDownVisible.value) {
        countDownVisible.value = false
    }
    clockSettingVisible.value = !clockSettingVisible.value
}
// 删除倒计时
const deleteCountDown = () => {
    useCountDownStore.dCountDown()
}
// 暂停倒计时
const stopCountDown = () => {
    useCountDownStore.stopCountDown()
}
// 开始倒计时
const startCountDown = () => {
    useCountDownStore.openCountDown()
}
// 当开启第一个页面时，二级页面应该处于关闭状态
const closeDetail = () => {
    countDownVisible.value = false
    clockSettingVisible.value = false
}
const changeSettingStatus = () => {
    countDownVisible.value = false
    clockSettingVisible.value = false
    topClockSettingVisible.value = true
    // emit('close')
}
let notificationShow = false
// const detailTime=useCountDownStore.countDowntime
const countDownDate = computed(() => useCountDownStore.countDowndate)

// 当倒计时完成时弹出弹窗
watch(countDownDate, (newVal, oldVal) => {
    const countDownTotalTime = computed(() => {
        let [hour, minute, second] = useCountDownStore.selectValue
        let totalTime = ''
        if (hour && hour !== 0) {
            totalTime += `${hour}小时`
        }
        if (minute && minute !== 0) {
            totalTime += `${minute}分钟`
        }
        if (second && second !== 0) {
            totalTime += `${second}秒`
        }
        return totalTime.trim()
    })
    if (newVal < 0 && countDownTotalTime.value !== '') {
        // const key = `open${Date.now()}`
        let message = `${countDownTotalTime.value}到了`
        notifications.clockToast(message, '计时器', false)
        useCountDownStore.dCountDown()
    }

})
// 闹钟完成时弹出
watch(() => useTimerStore.appDate.minutes, (newVal, oldVal) => {
    const firstClock = computed(() => {
        return `${useTimerStore.appDate.hours}:${useTimerStore.appDate.minutes}`
    })
    useCardStore.sortClock()
    if (useTimerStore.appDate.minutes === firstClockTime.value?.minutes &&
        useTimerStore.appDate.hours == firstClockTime.value?.hours && clockEvent.value[0].flag === undefined) {
        // const key = `open${Date.now()}`
        let message = `${firstClock.value}到了,${clockEvent.value[0].eventValue}`
        notifications.clockToast(message, '闹钟', true)
        if (clockEvent.value[0].clockType === '不重复') {
            // console.log(1111);
            useCardStore.removeClock(0, 1)
        }
    }

})

</script>
<style lang='scss' scoped>
:deep(.tippy-content) {
    padding: 0px !important;
}

.active {
    background: rgba(80, 139, 254, 0.20);
}
.popupClass {
    background: var(--primary-bg) !important;
    color: var(--primary-text) !important;

    & .ant-picker-panel {
        background-color: var(--primary-bg) !important;
    }
}

:deep(.ant-picker-panel-container) {
    background: var(--primary-bg) !important;
    color: var(--primary-text) !important;
}

.clock-icon {
    cursor: pointer;
    transition: transform 0.3s;
    /* 添加一个过渡效果 */
}

.clock-icon:hover {
    transform: scale(1.3);
    /* 鼠标悬停时放大 */
    background-color: var(--secondary-bg);
}

.font-14 {
    font-size: 14px;
    font-weight: 500;
}

.font-20 {
    font-size: 20px;
    font-weight: 500;
}

.font-16 {

    font-size: 16px;
    font-weight: 400;
}

:deep(.ant-input) {
    color: var(--primary-text);
}

:deep(.anticon.ant-input-clear-icon) {
    color: var(--secondary-text);
}

:deep(.ant-select-option) {
    color: var(--primary-text);
}

:deep(.ant-select-arrow) {
    color: var(--primary-text);
}

:deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
    // border-radius: 10px !important;
    height: 100%;
    border-radius: 10px;

}

:deep(.ant-select-single .ant-select-selector .ant-select-selection-item) {
    line-height: 35px;
}


.font-12 {

    font-size: 12px;
    font-weight: 400;
}

:deep(.ant-radio-button-wrapper) {
    padding: 0px;
}

:deep(.ant-radio-button-wrapper > .ant-radio-button) {
    border-radius: 10px !important;
    font-family: Oswald-Regular;
    font-size: 16px;
    font-weight: 400;

}

.setting-hover {
    &:hover {
        background: rgba(80, 139, 254, 0.20);
    }
}

:deep(.ant-input-number-handler-wrap) {
    background-color: var(--secondary-bg);
    border: none !important;
}
</style>
