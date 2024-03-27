<template>
    <div class="flex flex-col items-center ">
        <div v-if="settings.showTopbarTime">
            <span class="xt-text font-14 xt-font">{{ dateTime.month }}月{{ dateTime.day }}日</span>
            <span class="mx-1 xt-text font-14 xt-font">{{ dateTime.week }}</span>
            <span class="pr-1 xt-text font-14 xt-font">{{ dateTime.hours }}:{{ dateTime.minutes }}</span>
        </div>
        <div v-if="hasWeather && city.now && settings.showTopbarWeather" 
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
} from 'vue'
import { storeToRefs } from 'pinia';

import { appStore } from '../../store';
import { weatherStore } from '../../store/weather';
import { cardStore } from '../../store/card';

import { getDateTime } from '../../../../src/util/dateTime';

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

/**
 * 时间相关操作
 */
const initTime = () => {
    dateTime.value = getDateTime()
    useCard.setAppDate(dateTime.value)
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
<style lang='scss' scoped></style>