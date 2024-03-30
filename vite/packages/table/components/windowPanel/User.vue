<template>
    <MyAvatar @click="openControl"></MyAvatar>
    <Teleport to="body">
        <div class="absolute" v-if="isControl" :style="{left: pos.x + 'px', top: pos.y + 'px'}" style="z-index: 500;">
            <ControlModal 
                :title="title"
                @close="isControl = false">
            </ControlModal>
        </div>
    </Teleport>
</template>

<script setup lang='ts'>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia';

import { timerStore } from '../../store/timer';
import { weatherStore } from '../../store/weather';


import MyAvatar from '../small/MyAvatar.vue';
import ControlModal from '../desk/navigationBar/components/control/ControlModal.vue';

import { usePosition } from './hook/usePosition';


const useTimer = timerStore()
const { appDate } = storeToRefs(useTimer)

const useWeather = weatherStore()
const { cities } = storeToRefs(useWeather)

const isControl = ref(false)
const pos = ref({})

const openControl = (e) => {
    isControl.value = !isControl.value
    const position = {
        x: e.clientX,
        y: e.clientY
    }
    const itemPos = {
        x:548,
        y: 548
    }
    pos.value = usePosition(position, itemPos)

}

const title = computed(() => {
    let city
    let date = appDate.value
    const time = `${date.hours} : ${date.minutes} ${date.month}月 ${date.day}日 ${date.week}`
    if(cities.value.length > 0) {
        city = cities.value[0]
        return `${time} · ${city.now.text} ${city.now.temp}℃`
    }
    return time
})
</script>
<style lang='scss' scoped></style>