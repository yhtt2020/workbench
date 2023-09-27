<template>
    <tippy trigger=" click" placement="bottom" :interactive="true">
        <template #content>
            <div v-show="clockSettingVisible" style="position: absolute;left:-330px;top: -1px;"
                class="p-3 rounded-lg xt-bg-2">
                <vue-custom-scrollbar :settings="outerSettings"
                    style="position: relative; height: 500px;color: var(--primary-text);width: 300px; " class="scroll">
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
                            <a-select v-model:value="timeMinute" placeholder="选择分钟"
                                style="width:100%;  height: 40px; border-radius: 10px;">
                                <a-select-option :value="index" v-for="(i, index) in new Array(60)"
                                    class="xt-active-bg xt-text-2 ">
                                    {{ index }}
                                </a-select-option>
                            </a-select>
                            <!-- </div> -->

                        </div>
                        <div class="w-full mt-4 mb-3">
                            <div class="mt-4 mb-3 font-16 xt-text">
                                重复
                            </div>
                            <a-radio-group v-model:value="clockType" button-style="solid"
                                class="flex justify-between w-full xt-bg-2" buttonStyle="solid">
                                <a-radio-button value="不重复" style="color:var(--primary-text);width: 50%;"
                                    class="text-center font-16">不重复</a-radio-button>
                                <a-radio-button value="每天" class="text-center font-16"
                                    style="width: 50%;">每天</a-radio-button>
                            </a-radio-group>
                        </div>
                        <div class="flex justify-between">
                            <xt-button type="primary" class=" font-16 xt-text"
                                style="width: 48%; height: 40px;border: 1px solid var(--active-bg); "
                                @click="settingClock">取消</xt-button>
                            <xt-button type="primary" class=" font-16 xt-text"
                                style="width: 48%; height: 40px; background-color: var(--active-bg);"
                                @click="addSettingClock">确认添加</xt-button>
                        </div>
                    </div>

                </vue-custom-scrollbar>
            </div>
            <div v-show="countDownVisible" style="position: absolute; left:-330px;top: -1px;z-index: 999;"
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
                            <div class="w-full font-16 xt-text h-[40px] text-center xt-bg mt-2 rounded-lg"
                                style="line-height: 40px;" @click="onCountDown(3)">3分钟</div>
                            <div class="w-full font-16 xt-text h-[40px] text-center xt-bg mt-3 rounded-lg"
                                style="line-height: 40px;" @click="onCountDown(5)">5分钟</div>
                            <div class="w-full font-16 xt-text h-[40px] text-center xt-bg mt-3 rounded-lg"
                                style="line-height: 40px;" @click="onCountDown(10)">10分钟</div>
                            <div class="w-full font-16 xt-text h-[40px] text-center xt-bg mt-3 rounded-lg"
                                style="line-height: 40px;" @click="onCountDown(15)">15分钟</div>
                            <div class="w-full font-16 xt-text h-[40px] text-center xt-bg mt-3 rounded-lg"
                                style="line-height: 40px;" @click="onCountDown(30)">30分钟</div>
                            <div class="w-full font-16 xt-text h-[40px] text-center xt-bg mt-3 rounded-lg"
                                style="line-height: 40px;" @click="onCountDown(60)">60分钟</div>
                            <div class="w-full font-16 xt-text h-[40px] text-center xt-bg mt-3 rounded-lg"
                                style="line-height: 40px;" @click="onCountDown(300)">自定义</div>
                        </div>


                    </div>

                </vue-custom-scrollbar>

            </div>
            <div class="w-[320px] h-[320px] relative xt-bg rounded-lg">
                <vue-custom-scrollbar :settings="outerSettings" style="position: relative; height:100%" class="scroll">
                    <div class="p-4 ">
                        <div class="flex justify-between w-full h-[56px] rounded-md items-center xt-bg pl-4 pr-4 mb-3"
                            v-if="useCountDownStore.countDowntime">
                            <div>
                                <clockIcon icon="akar-icons:pause" style="font-size: 24px; vertical-align: sub;"
                                    @click="stopCountDown" class="xt-text" v-show="!useCountDownStore.countDownBtn">
                                </clockIcon>
                                <clockIcon icon="fluent:play-16-filled" style="font-size: 24px; vertical-align: sub;"
                                    @click="startCountDown" class="xt-text" v-show="useCountDownStore.countDownBtn">
                                </clockIcon>
                                <clockIcon icon="fluent:dismiss-16-filled" style="font-size: 24px; vertical-align: sub;"
                                    @click="deleteCountDown" class="ml-2 xt-text">
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
                                <clockIcon class="mr-3 xt-text font-20" @click="settingClock" icon="fluent:add-16-filled">
                                </clockIcon>
                                <clockIcon class="mr-3 text-base xt-text font-20" icon="fluent:clock-12-regular"
                                    @click="settingCountDown">
                                </clockIcon>
                                <clockIcon class=" xt-text font-20" icon="akar-icons:sound-on"></clockIcon>
                            </div>
                        </div>
                        <div class="flex items-center mt-3 overflow-hidden" v-for="(item, index) in clockEvent">
                            <div class="flex items-center rounded-lg event-list"
                                style="background: var(--secondary-bg);color: var(--primary-text);width: calc(100% );height: 56px; ">
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
            </div>
        </template>

        <xt-button class="flex items-center justify-center mr-3 rounded-sm clock-timer top-bar " v-if="countDownVisible"
            style="width: 150px; height: 32px;position: relative;background: var(--warning) !important;">
            <div class="flex items-center">
                <clockIcon icon="fluent:clock-alarm-16-filled" class="mr-1 text-base"></clockIcon>
                <div class="mr-1 xt-text font-14">倒计时</div>
                <div class="xt-text font-14">{{ useCountDownStore.countDowntime.hours }} : {{
                    useCountDownStore.countDowntime.minutes }} : {{ useCountDownStore.countDowntime.seconds }}</div>
            </div>

        </xt-button>
        <xt-button class="flex items-center justify-center mr-3 rounded-md clock-timer xt-bg-2 top-bar" v-else
            style="width: 132px; height: 32px;position: relative;">
            <div class="flex items-center">
                <clockIcon icon="fluent:clock-alarm-16-filled" class="mr-2 text-base"></clockIcon>
                <div class="mr-2 xt-text font-14">闹钟</div>
                <div class="xt-text font-14">{{ firstClockTime.hours }} : {{ firstClockTime.minutes }} </div>
            </div>

        </xt-button>
    </tippy>
</template>

<script setup lang='ts'>
import { ref, reactive, computed, onMounted } from 'vue'
import { Icon as clockIcon } from '@iconify/vue'
import { cardStore } from '../../store/card'
import { message } from 'ant-design-vue'
import { getDateTime } from '../../../../src/util/dateTime'
import { countDownStore } from '../../store/countDown'
import { timeStamp, transDate } from "../../util";
const useCardStore = cardStore();
const clockSettingVisible = ref(false)
const clockEvent = computed(() => useCardStore.clockEvent)
const firstClockTime = computed(() => clockEvent.value[0].clockTimeStamp)
const outerSettings = reactive({
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true,
})

const countDownVisible = ref(false)
const useCountDownStore = countDownStore()
const isStop = ref(true)
const inputRef = ref(null)
const eventValue = ref("未命名")
const timeHour = ref(0)
const clockType = ref("不重复")
const timeMinute = ref(0)
const flag = ref(true)
const changeStutas = () => {
    isStop.value = !isStop.value
}
const selectText = () => {
    inputRef.value.select()
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
        clockType: clockType,
        eventValue: eventValue,
        dateValue: timeSpan,
        clockTimeStamp: timeSpan
    });
    // this.$router.push({
    //   name: "home",
    // });
    message.success("添加成功！");
}
const settingCountDown = () => {
    if (clockSettingVisible.value) {
        clockSettingVisible.value = false
    }
    countDownVisible.value = !countDownVisible.value
}
const settingClock = () => {
    console.log(clockSettingVisible.value);
    if (countDownVisible.value) {
        countDownVisible.value = false
    }
    clockSettingVisible.value = !clockSettingVisible.value
}
const deleteCountDown = () => {
    useCountDownStore.dCountDown()
}
const stopCountDown = () => {
    useCountDownStore.stopCountDown()
}
const startCountDown = () => {
    useCountDownStore.openCountDown()
}
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
            useCountDownStore.custom = true
            break
    }
    //   this.$refs.cardSlot.hideMenu()
    useCountDownStore.countDownBtn = false
}
</script>
<style lang='scss' scoped>
:deep(.tippy-content) {
    padding: 0px;
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

:deep(.ant-input) {
    color: var(--primary-text);
}

.font-12 {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    font-weight: 400;
}</style>