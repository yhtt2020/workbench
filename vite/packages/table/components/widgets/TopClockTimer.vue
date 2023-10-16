<template>
    
    <!-- style="box-shadow: 1px 1px var(--secondary-bg);" -->
    <div style="position: absolute; top: 31px;z-index: 999999;">
        <!-- 闹钟设置界面 -->
        <div v-show="clockSettingVisible"
            style="position: absolute;left:-330px;top: -1px;box-shadow: 0px 0px 3.12px 0px rgba(0,0,0,0.03);box-shadow: 0px 0px 10.23px 0px rgba(0,0,0,0.1);box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.2); "
            class="p-3 rounded-lg xt-bg-2">
            <vue-custom-scrollbar :settings="outerSettings"
                style="position: relative; height: 520px;color: var(--primary-text);width: 300px; " class="scroll">
                <div class="">
                    <div class="flex justify-between">
                        <div class="mb-3 font-14 xt-text-2">添加闹钟</div>
                        <clockIcon icon="fluent:dismiss-16-filled" style="font-size: 18px;" class="xt-text-2"
                            @click="settingClock">
                        </clockIcon>
                    </div>

                    <div class="mb-3 ">
                        <a-input ref="input" allow-clear @click="selectText" v-model:value="eventValue"
                            style="border-radius: 10px;height: 40px; width: 100%;" placeholder="新闹钟" />
                    </div>

                    <div class="mb-3 font-16 xt-text">小时</div>
                    <div>
                        <a-radio-group button-style="solid" v-model:value="timeHour" class="flex rounded-lg xt-bg-2 "
                            option-type="button">
                            <template
                                v-for="(i, index) in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]">
                                <a-radio-button :value="i" class="mb-2 text-center xt-text" style="width: 50px;">{{
                                    index
                                }}</a-radio-button>
                            </template>
                        </a-radio-group>

                    </div>
                    <div>
                        <div class="mt-4 mb-3 font-16 xt-text">分钟</div>
                        <!-- <div class="w-full xt-bg-2" style="border-radius: 10px;border: 1px solid var(--secondary-text);"> -->
                        <!-- <a-select v-model:value="timeMinute" placeholder="选择分钟" dropdownSyle=""
                                style="width:100%;  height: 40px; border-radius: 10px;position: relative;">
                                <a-select-option :value="index" v-for="(i, index) in new Array(60)"
                                    class="absolute z-auto xt-bg xt-text-2 selsect-options">
                                    {{ index }}
                                </a-select-option>
                            </a-select> -->
                        <!-- </div> -->
                        <a-input-number id="inputNumber" v-model:value="timeMinute" :min="0" :max="59" defaultValue="0"
                            style="border-radius: 12px; width: 100%; height: 42px; line-height: 40px;" />
                    </div>
                    <div class="w-full mt-4 mb-3">
                        <div class="mt-4 mb-3 font-16 xt-text">
                            重复
                        </div>
                        <RadioTab :navList="dataType" v-model:selectType="defaultType"></RadioTab>
                        <!-- {{ defaultType }} -->
                    </div>
                    <div class="flex justify-between ">
                        <xt-button type="primary" class="mt-2 font-16 xt-text"
                            style="width: 48%; height: 40px;border: 1px solid var(--active-bg); "
                            @click="settingClock">取消</xt-button>
                        <xt-button type="primary" class="mt-2 font-16 xt-text"
                            style="width: 48%; height: 40px; background-color: var(--active-bg);"
                            @click="addSettingClock">确认添加</xt-button>
                    </div>
                </div>

            </vue-custom-scrollbar>
        </div>
        <!-- 倒计时设置界面 -->
        <div v-show="countDownVisible"
            style="position: absolute; left:-330px;top: -1px;box-shadow: 0px 0px 3.12px 0px rgba(0,0,0,0.03);box-shadow: 0px 0px 10.23px 0px rgba(0,0,0,0.1);box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.2);"
            class="p-3 rounded-lg xt-bg-2">
            <vue-custom-scrollbar :settings="outerSettings"
                style="position: relative; height: 400px;color: var(--primary-text);width: 300px; " class="scroll">
                <div class="">
                    <div class="flex justify-between">
                        <div class="mb-3 font-14 xt-text-2">添加计时器</div>
                        <clockIcon icon="fluent:dismiss-16-filled" style="font-size: 18px;" @click="settingCountDown"
                            class="xt-text-2">
                        </clockIcon>
                    </div>
                    <div>
                        <div class="w-full font-16 xt-text h-[40px] text-center xt-bg mt-2 rounded-lg pointer"
                            style="line-height: 40px;" @click="onCountDown(3)">3分钟</div>
                        <div class="w-full font-16 xt-text h-[40px] text-center xt-bg mt-3 rounded-lg pointer"
                            style="line-height: 40px;" @click="onCountDown(5)">5分钟</div>
                        <div class="w-full font-16 xt-text h-[40px] text-center xt-bg mt-3 rounded-lg pointer"
                            style="line-height: 40px;" @click="onCountDown(10)">10分钟</div>
                        <div class="w-full font-16 xt-text h-[40px] text-center xt-bg mt-3 rounded-lg pointer"
                            style="line-height: 40px;" @click="onCountDown(15)">15分钟</div>
                        <div class="w-full font-16 xt-text h-[40px] text-center xt-bg mt-3 rounded-lg pointer"
                            style="line-height: 40px;" @click="onCountDown(30)">30分钟</div>
                        <div class="w-full font-16 xt-text h-[40px] text-center xt-bg mt-3 rounded-lg pointer"
                            style="line-height: 40px;" @click="onCountDown(60)">60分钟</div>
                        <div class="w-full font-16 xt-text h-[40px] text-center xt-bg mt-3 rounded-lg pointer"
                            style="line-height: 40px;" @click="onCountDown(300)">自定义</div>
                    </div>


                </div>

            </vue-custom-scrollbar>

        </div>
        <!-- 一级快捷面板 -->
        <div class="w-[300px] h-[300px] relative xt-bg-2  rounded-lg p-0 " v-show="customizeSetting">
            <vue-custom-scrollbar :settings="outerSettings" style="position: relative; height:100%;box-shadow: 0px 0px 3.12px 0px rgba(0,0,0,0.03);box-shadow: 0px 0px 10.23px 0px rgba(0,0,0,0.1);box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.2);" class="scroll">
                <div class="p-4 ">
                    <div class="flex justify-between w-full h-[56px] rounded-md items-center xt-bg-2 pl-4 pr-4 mb-3"
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
                        <div>
                            <a-tooltip arraw="false"  autoAdjustOverflow title="添加闹钟">
                                <button class="mr-2 text-center xt-bg-2" style="border: none;width: 25px;">
                                    <clockIcon class=" xt-text font-20 clock-icon" @click="settingClock"
                                        icon="fluent:add-16-filled"></clockIcon>
                                </button>
                            </a-tooltip>
                            <a-tooltip  autoAdjustOverflow title="设置定时器">
                                <button class="mr-2 xt-bg-2" style="border: none;width: 25px;">
                                    <clockIcon class=" xt-text font-20 clock-icon" icon="fluent:clock-12-regular"
                                        @click="settingCountDown">
                                    </clockIcon>
                                </button>
                            </a-tooltip>
                            <a-tooltip autoAdjustOverflow title="铃声调节">
                                <button class="mr-2 xt-bg-2" style="border: none;width: 25px;">
                                    <clockIcon class=" xt-text font-20 clock-icon" icon="akar-icons:sound-on"
                                        v-if="soundVisible" @click="changeSoundStatus"></clockIcon>
                                    <clockIcon class="xt-text font-20 clock-icon" icon="akar-icons:sound-off"
                                        v-if="!soundVisible" @click="changeSoundStatus"></clockIcon>
                                </button>

                            </a-tooltip>
                            <a-tooltip autoAdjustOverflow color="var(--primary-bg) !important;" title="设置">
                                <button class=" xt-bg-2" style="border: none;width: 25px;">
                                    <clockIcon icon="fluent:settings-16-regular"
                                        style="font-size: 24px; vertical-align: sub; " @click="changeSettingStatus"
                                        class="rounded-md xt-text font-20 clock-icon setting-hover">
                                    </clockIcon>
                                </button>

                            </a-tooltip>

                        </div>
                    </div>
                    <div class="flex items-center mt-3 overflow-hidden" v-for="(item, index) in clockEvent" @contextmenu="deleteClock(index)">
                        <div class="flex items-center rounded-lg event-list"
                            style="background: var(--primary-bg);color: var(--primary-text);width: calc(100% );height: 56px; ">
                            <div class="w-full">
                                <div class="flex items-center justify-between ml-4 mr-4 card-list">
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
                </div>
            </vue-custom-scrollbar>
            <a-modal v-model:visible="custom" title="" @ok="() => { }" :footer="null" centered
                style="font-size: 8px;color: var(--primary-text); " :maskClosable="false">
                <div style="display: flex;flex-direction: column;align-items: center;">
                    <div style="">自定义倒计时</div>
                    <a-space direction="vertical" style="margin: 14px" :popupStyle="{ zIndex: 9999999999999 }">
                        <a-time-picker v-model:value="value1" size="large" :popupStyle="{ zIndex: 9999999999999 }" :showNow="false" :popupClassName="{popupClass}"/>
                    </a-space>
                    <xt-button type="primary" @click="addCustom"
                        style="margin: 14px; background: var(--active-bg);">开始倒计时</xt-button>
                </div>
            </a-modal>
        </div>
    </div>

    <!-- `linear-gradient(to-right,${currentColor.value} ${100-progress.value}% ,${targetColor.value} ${progress.value}%)` -->
    <div style="position: relative">
        <xt-button class="flex items-center justify-center mr-3 rounded-md clock-timer progress-bar "
            @click="closeDetail" v-if="useCountDownStore.countDowntime.hours !== undefined"
            style="width: 150px; height: 32px;"
            :style="{ background: `linear-gradient(to-right, var(--secondary-bg) ${100 - useCountDownStore.progress}%, var(--warning) ${useCountDownStore.progress}%)  ` }">
            <div class="flex items-center">
                <clockIcon icon="fluent:clock-alarm-16-filled" class="mr-1 text-base"></clockIcon>
                <!-- {{ useCountDownStore.countDowntime.hours }} -->
                <!-- {{ TopClockTimerVisible }} -->
                <div class="mr-1 xt-text font-14">倒计时</div>
                <div class="xt-text font-14">{{ useCountDownStore.countDowntime.hours }} : {{
                    useCountDownStore.countDowntime.minutes }} : {{ useCountDownStore.countDowntime.seconds }}</div>
            </div>

        </xt-button>
        <xt-button class="flex items-center justify-center mr-3 rounded-md clock-timer top-bar " v-else @click="closeDetail"
            style="width: 82px; height: 32px;background: rgba(80,139,254,0.20);">
            <div class="flex items-center">
                <clockIcon icon="fluent:clock-alarm-16-filled" class="mr-1 text-base"></clockIcon>
                <!-- <div class="mr-2 xt-text font-14">闹钟</div> -->
                <div class="xt-text font-14" v-if="firstClockTime?.hours !== undefined">{{ firstClockTime?.hours }} : {{
                    firstClockTime?.minutes }} </div>
            </div>
        </xt-button>
    </div>

    <a-drawer v-model:visible="topClockSettingVisible" class="custom-class xt-text"
        style="color: red" title="设置" placement="right" :width="600">
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
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { getDateTime } from '../../../../src/util/dateTime'
import { countDownStore } from '../../store/countDown'
import { timeStamp, transDate } from "../../util";
import { Notifications } from '../../js/common/sessionNotice'
import RadioTab from '../RadioTab.vue';
import SetupClock from './setupClock.vue'
const notifications = new Notifications()

const usetopClockSettingStore = topClockSettingStore()
onMounted(() => {
    if (useCountDownStore.countDowntime.seconds == '00' && useCountDownStore.countDowntime.minutes == '00' && useCountDownStore.countDowntime.hours == '00') {
        useCountDownStore.dCountDown()
    }

})
const topClockSettingVisible=ref(false)
const dataType = ref([{ title: '不重复', name: '不重复' }, { title: '每天', name: '每天' }])
const defaultType = ref({ title: '不重复', name: '不重复' })
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
const isStop = ref(true)
const inputRef = ref(null)
const eventValue = ref("未命名")
const timeHour = ref(0)
const clockType = ref("不重复")
const timeMinute = ref(0)
const flag = ref(true)
const custom = ref(false)
const soundVisible = ref(true)
const value1 = ref(dayjs('00:00:00', 'HH:mm'))
const changeSoundStatus = () => {
    soundVisible.value = !soundVisible.value
    usetopClockSettingStore.changeSoundStatus(soundVisible.value)
}
const changeStutas = () => {
    isStop.value = !isStop.value
}
const selectText = () => {
    inputRef.value.select()
}
const deleteClock = (index) => {
    console.log(index);
    
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


    useCardStore.addClock({
        clockType: defaultType.value.name,
        eventValue: eventValue.value,
        dateValue: timeSpan,
        clockTimeStamp: timeSpan
    });
    // this.$router.push({
    //   name: "home",
    // });
    message.success("添加成功！");
}
// 开启倒计时设置页面
const settingCountDown = () => {
    if (clockSettingVisible.value) {
        clockSettingVisible.value = false
    }
    countDownVisible.value = !countDownVisible.value
    // console.log(useCountDownStore.countDowndate);
}
// 打开闹钟的设置页面
const settingClock = () => {
    // console.log(clockSettingVisible.value);
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
// 设置倒计时
const onCountDown = (value) => {
    switch (value) {
        case 3:
            useCountDownStore.setCountDown({ hours: 0, minutes: 3, seconds: 0 })
            break
        case 5:
            useCountDownStore.setCountDown({ hours: 0, minutes: 5, seconds: 0 })
            break
        case 10:
            useCountDownStore.setCountDown({ hours: 0, minutes: 10, seconds: 0 })
            break
        case 15:
            useCountDownStore.setCountDown({ hours: 0, minutes: 15, seconds: 0 })
            break
        case 30:
            useCountDownStore.setCountDown({ hours: 0, minutes: 30, seconds: 0 })
            break
        case 60:
            useCountDownStore.setCountDown({ hours: 1, minutes: 0, seconds: 0 })

            break
        case 300:
            custom.value = true
            countDownVisible.value = false
            customizeSetting.value = false
            break
    }
    //   this.$refs.cardSlot.hideMenu()
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
// 当开启第一个页面时，二级页面应该处于关闭状态
const closeDetail = () => {
    countDownVisible.value = false
    clockSettingVisible.value = false
    customizeSetting.value = !customizeSetting.value


    // console.log(customizeSetting.value);
}
const changeSettingStatus = () => {
    // usetopClockSettingStore.changeSettingStatus()
    customizeSetting.value = false
    countDownVisible.value = false
    clockSettingVisible.value = false
    topClockSettingVisible.value=true
}
let notificationShow = false
// const detailTime=useCountDownStore.countDowntime
const countDownDate = computed(() => useCountDownStore.countDowndate)
const clockFlag = computed(() => useCardStore.clockFlag)
const countDownTime = useCountDownStore.regularTime()
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
    if (newVal < 0) {
        const key = `open${Date.now()}`
        let message = `${countDownTotalTime.value}到了`
        notifications.clockToast(message, '计时器', false)
    }




})
// 闹钟完成时弹出
watch(() => useTimerStore.appDate.minutes, (newVal, oldVal) => {
    // const audio = new Audio('/sound/clock.mp3')
    // console.log(useTimerStore.appDate.minutes, 'useTimerStore.appDate.minutes');
    const firstClock = computed(() => {
        return `${useTimerStore.appDate.hours}:${useTimerStore.appDate.minutes}`
    })
    useCardStore.sortClock()
    if (useTimerStore.appDate.minutes === firstClockTime.value?.minutes &&
        useTimerStore.appDate.hours === firstClockTime.value?.hours && clockEvent.value[0].flag === undefined) {
        const key = `open${Date.now()}`
        let message = `${firstClock.value}到了,${clockEvent.value[0].eventValue}`
        notifications.clockToast(message, '闹钟', true)
        if(clockEvent.value[0].clockType==='不重复'){
            // console.log(1111);
            useCardStore.removeClock(0,1)
        }
    }

})

</script>
<style lang='scss' scoped>
:deep(.tippy-content) {
    padding: 0px !important;
}
// :deep(.ant-radio-button-wrapper) {
//     // border: 1px solid var(--primary-text);
//     border-bottom: none;

// }

// :deep(.ant-radio-button-wrapper) {
//     &:nth-child(21) {
//         border-bottom: 1px solid var(--secondary-text);
//         // border-left:  solid var(--primary-text);
//     }
//     &:nth-child(22),&:nth-child(23),&:nth-child(24),&:nth-child(19),&:nth-child(20) {
//         border-bottom: 1px solid var(--primary-text);
//     }
//     &:nth-child(1){
//         border-radius:10px 0 0 0;
//     }
//     &:nth-child(6){
//         border-radius:0 10px 0 0;
//     }
//     &:nth-child(19){
//         border-radius:0 0 0 10px ;
//     }
//     &:nth-child(24){
//         border-radius:0 0 10px 0 ;
//     }
//     // &:nth-child(7),&:nth-child(13){
//     //     border-left: 1px solid var(--primary-text);
//     // }
//     // &:nth-child(19){
//     //     border-left: 1px solid var(--primary-text);
//     // }
// }
.popupClass {
    background: var(--primary-bg) !important;
    color: var(--primary-text) !important;
}
*>>>.tippy-box[data-theme~='tippy-trigger']>.tippy-content {
    padding: 0px !important;
}

.tippy-trigger {
    padding: 0px !important;
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
    font-family: PingFangSC-Medium;
    font-size: 14px;
    font-weight: 500;
}

.font-20 {
    font-family: PingFangSC-Medium;
    font-size: 20px;
    font-weight: 500;
}

.font-16 {
    font-family: PingFangSC-Regular;
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
    font-family: PingFangSC-Regular;
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
.setting-hover{
    &:hover{
        background: rgba(80,139,254,0.20);
    }
}
:deep(.ant-input-number-handler-wrap) {
    background-color: var(--secondary-bg);
    border: none !important;
}
</style>
