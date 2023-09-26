<template>
    <tippy trigger=" click" placement="bottom" :interactive="true" style="z-index: 9999999; " class="xt-bg">
        <template #content>
            <div class="w-[320px] h-[320px] relative xt-bg rounded-lg">
                <vue-custom-scrollbar :settings="outerSettings" style="position: relative; height:100%" class="scroll">
                    <div class="p-4 ">
                        <div class="flex justify-between">
                            <div class="font-14 xt-text">
                                我的闹钟
                            </div>
                            <div>
                                <clockIcon class="mr-3 xt-text font-20" icon="fluent:add-16-filled"></clockIcon>
                                <clockIcon class="mr-3 text-base xt-text font-20" icon="fluent:clock-12-regular">
                                </clockIcon>
                                <clockIcon class="text-base xt-text font-20" icon="akar-icons:sound-on"></clockIcon>
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
        <xt-button class="flex items-center justify-center mr-3 rounded-lg clock-timer xt-bg-2 top-bar"
            style="width: 132px; height: 32px;">
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
const useCardStore = cardStore();
const clockVisible = ref(false)
const myClockVisible = () => {
    clockVisible.value = !clockVisible.value
    console.log(clockVisible.value);
}
const clockEvent = computed(() => useCardStore.clockEvent)
const firstClockTime = computed(() => clockEvent.value[0].clockTimeStamp)
onMounted(() => {
    console.log(clockEvent.value[0].clockTimeStamp, 'clockTimeStamp');
})
const outerSettings = reactive({
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true,
})
</script>
<style lang='scss' scoped>
// :deep(.tippy-box){
//     padding: 0px;
// }
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
</style>