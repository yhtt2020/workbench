<template>
    <div class="flex flex-col justify-center w-full text-right time pointer">
        <div v-if="settings.showTopbarTime"  @click="enterTime" class="flex">
            <div class="mr-1 xt-text font-14 xt-font">{{ dateTime.year }}/{{ dateTime.month }}/{{ dateTime.day }} </div>
            <div class="xt-text font-14 xt-font"> {{ dateTime.hours }}:{{ dateTime.minutes }} </div>
        </div>
        <div v-if="hasWeather && city.now && settings.showTopbarWeather" 
            @click="enterWeather"
            class="w-full xt-text font-14 xt-font ">
            {{ city.now.text }} {{ city.now.temp }}℃
        </div>
    </div>
</template>

<script setup lang='ts'>
import { 
    ref, 
    computed,
    onBeforeMount,
    onMounted,
    getCurrentInstance
} from 'vue'
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

import { appStore } from '../../store';
import { weatherStore } from '../../store/weather';
import { cardStore } from '../../store/card';

import { getDateTime } from '../../../../src/util/dateTime';

const { proxy } = getCurrentInstance()

const emit = defineEmits(['openRightDrawer'])

const router = useRouter()

// 控制是否显示天气和日期
const useAppStore = appStore()
const { settings } = storeToRefs(useAppStore)

// 获取当前的城市天气
const useWeather = weatherStore()
const { cities } = storeToRefs(useWeather)

// 获取卡片数据
const useCard = cardStore()

const dateTime = ref({})


/**
 * 天气相关操作
 */

// 是否添加了城市天气
const hasWeather = computed(() => {
    return cities.value.length > 0
})

// 展示第一个城市的天气
const city = computed(() => {
    if(hasWeather.value) {
        return cities.value[0]
    }
    return {}
})

// 点击进入天气的主应用
const enterWeather = () => {
    router.push({ name: "weather" })
}
/**
 * 时间相关操作
 */
const initTime = () => {
    dateTime.value = getDateTime()
    useCard.setAppDate(dateTime.value)
}

const enterTime = () => {
    console.log('进入时钟全屏')
    proxy.$bus.emit('openClockFullScreen',true)
}

onBeforeMount(() => {
    initTime()
})

onMounted(() => {
    setInterval(() => {
        initTime()
    }, 1000)
})

</script>
<style lang='scss' scoped>
.time {
    &:hover{
        background:var(--primary-bg);
        border-radius: 6px;
    }
}
</style>