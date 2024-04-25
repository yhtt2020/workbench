<template>
    <MyAvatar @click="openControl" v-if="(!simple) && !isOffline && bottomToggle[0]"></MyAvatar>
    <div v-else class="w-16 h-16"></div>
    <Teleport to="body">
        <div class="absolute" v-if="isControl" :style="{left: pos.x + 'px', top: pos.y + 'px'}" style="z-index: 500;">
            <ControlModal 
                :title="title"
                @close="isControl = false">
            </ControlModal>
        </div>
    </Teleport>
</template>

<script setup >
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia';

import { timerStore } from '../../store/timer';
import { weatherStore } from '../../store/weather';
import { appStore } from '../../store';
import { useNavigationStore } from '../desk/navigationBar/navigationStore';


import MyAvatar from '../small/MyAvatar.vue';
import ControlModal from '../../apps/control/page/Control.vue';

import { usePosition } from './hook/usePosition';


const useAppStore = appStore()
const { simple } = storeToRefs(useAppStore)

const useNav = useNavigationStore()
const { bottomToggle } = storeToRefs(useNav)


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