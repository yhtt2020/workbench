<script setup lang="ts">
import { computed, inject } from "vue";
import { storeToRefs } from "pinia";
import { weatherStore } from "../../../../store/weather";
const { cities } = storeToRefs(weatherStore());
const city = computed(() => {
  if (cities.value.length === 0) {
    return false;
  }
  return cities.value[0];
});
const data: any = inject("_data");

const height = computed(() => {
  let res = data.value.customSize.split("x");
  return res[1];
});
</script>

<template>
  <div
    class="flex items-center justify-center"
    v-if="city"
    :class="[height < 2 ? 'flex-col' : '']"
  >
    <div class="flex items-center">
      <div
        class="text-[30px] flex justify-center items-center"
        :class="'qi-' + city.now.icon + '-fill'"
      ></div>
      <div class="text-[22px] font-bold ml-2.5">{{ city.now.temp }} °</div>
    </div>

    <div class="flex" :class="[height >= 2 ? 'flex-col ml-4' : '']">
      <div class="flex items-center font-bold my-1">
        {{ city.adm2 }}
        <div>·</div>
        {{ city.now.text }}
      </div>
      <div class="text-sm font-bold flex items-center">
        最低 {{ city.d7.daily[0].tempMin }}° 最高
        {{ city.d7.daily[0].tempMax }}°
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "qweather-icons/font/qweather-icons.css";
</style>
