<template>
  <div class="flex items-center justify-center text-shadow">
    <div
      class="flex items-center justify-center"
      :class="size[1] > 1 ? 'flex-col' : ''"
    >
      <div class="flex text-[100px] font-bold" style="line-height: 1">
        {{ time }}
        <span :style="{ display: isSnow == true ? 'inline-block' : 'none' }">{{
          min
        }}</span>
      </div>
      <Weather v-if="size[0] > 2 && customData.showWeather" />
    </div>
    <Calendar
      class="ml-3"
      v-if="size[0] >= 4 && size[1] >= 2  && customData.showCalendar"
      style="
        color: var(--primary-text) !important;
        zoom: 0.8;
        padding-top: 35px;
      "
      :is-dark="true"
      :attributes="attributes"
      transparent
      borderless
      color="theme-bg"
    >
    </Calendar>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject, computed } from "vue";
import Weather from "./Weather.vue";
import { Calendar } from "v-calendar";
const data = inject("_data");

const size = computed(() => {
  let res = data.value.customSize.split("x");
  res[0] = parseInt(res[0]);
  res[1] = parseInt(res[1]);

  return res;
});
// 使用 ref 创建响应式数据
const time = ref("");
const min = ref("");
const timerID = ref(0);
const attributes = [
  {
    highlight: true,
    dates: new Date(),
  },
];
// 定义 props
const props = defineProps({
  isSnow: {
    type: String,
    default: "true",
  },
  hideDate: {
    type: Boolean,
    default: true,
  },
  customData:{
    type:Object,
    default:{
      showWeather:true,
      showCalendar:true
    }
  }
});

// 组件方法
const zeroPadding = (num, digit) => {
  let zero = "";
  for (let i = 0; i < digit; i++) {
    zero += "0";
  }
  return (zero + num).slice(-digit);
};

const updateTime = () => {
  let cd = new Date();
  time.value =
    zeroPadding(cd.getHours(), 2) + ":" + zeroPadding(cd.getMinutes(), 2);
  min.value = ":" + zeroPadding(cd.getSeconds(), 2);
};

// 生命周期钩子
onMounted(() => {
  timerID.value = setInterval(updateTime, 1000);
  updateTime();
});

onUnmounted(() => {
  clearInterval(timerID.value);
});
</script>

<style lang="scss" scoped>
.vc-pane-header-wrapper {
  display: none !important;
}
.vc-weekdays {
  display: none !important;
}
:deep(.vc-header) {
  display: none !important;
}
:deep(.vc-theme-bg) {
  // background: var(--tt-theme-color) !important;
  --vc-accent-50: var(--tt-theme-color) !important;
  --vc-accent-100: var(--tt-theme-color) !important;
  --vc-accent-200: var(--tt-theme-color) !important;
  --vc-accent-300: var(--tt-theme-color) !important;
  --vc-accent-400: var(--tt-theme-color) !important;
  --vc-accent-500: var(--tt-theme-color) !important;
  --vc-accent-600: var(--tt-theme-color) !important;
  --vc-accent-700: var(--tt-theme-color) !important;
  --vc-accent-800: var(--tt-theme-color) !important;
  --vc-accent-900: var(--tt-theme-color) !important;
}
// .class="vc-weekdays"
.text-shadow{
  text-shadow:0px 0px 9px rgb(0 0 0 / 45%);
}
</style>
