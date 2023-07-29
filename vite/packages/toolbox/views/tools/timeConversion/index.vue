<template>
  <div class="mx-auto text-base" style="width: 80%">
    <div>当前时间：{{ getDate() }}</div>
    <div class="my-3">当前时间戳：{{ currentTimeStamp }}</div>
    <div class="flex">
      <XtInput
        class="xt-bg-2 xt-border rounded-xl overflow-hidden"
        :limit="{ number: true, space: true }"
        style="height: 48px"
        v-model:data="timeStamp"
        @keyup="timeStampKeyup()"
        @change="timeStampKeyup()"
        @input="timeStampKeyup()"
      >
        <template #addonBefore>
          <div
            class="text-base xt-text flex justify-center items-center"
            style="width: 80px; height: 46px; background: var(--secondary-text)"
          >
            时间戳
          </div>
        </template>
      </XtInput>
      <XtIcon :copy="timeStamp" icon="fuzhi" size="28" type=""></XtIcon>
    </div>
    <div class="my-3 flex justify-center" style="width: 100%">
      <icon icon="paixu" style="font-size: 28px"></icon>
    </div>
    <div class="flex">
      <XtInput
        class="xt-bg-2 xt-border rounded-xl overflow-hidden"
        style="height: 48px"
        v-model:data="time"
        @keyup="timeKeyup()"
      >
        <template #addonBefore>
          <div
            class="text-base xt-text flex justify-center items-center h-full"
            style="width: 80px; height: 100%; background: var(--secondary-text)"
          >
            时间
          </div>
        </template>
        <template #suffix>
          <div style="width: 125px">
            <a-date-picker v-model:value="datePicker" />
          </div>
        </template>
      </XtInput>
      <XtIcon :copy="time" icon="fuzhi" size="28" type=""></XtIcon>
    </div>
    <div class="mt-3">时间转时间戳，请输入时间格式：“xxxx-xx-xx xx:xx:xx”</div>
  </div>
</template>

<script>
import dayjs from "../../../../table/components/card/hooks/day";

import { timeConversion } from "../../../store/timeConversion";
import { mapWritableState, mapActions } from "pinia";

export default {
  data() {
    return {
      currentTimeStamp: 0,
      currentTimeStampTimer: "",
      datePicker: "",
    };
  },
  computed: {
    ...mapWritableState(timeConversion, ["time", "timeStamp"]),
  },
  mounted() {
    this.updateCurrentTimeStamp();
    this.currentTimeStampTimer = setInterval(this.updateCurrentTimeStamp, 1000);
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.currentTimeStampTimer);
    next();
  },
  watch: {
    datePicker(newV) {
      let date = dayjs(newV).format("YYYY-MM-DD HH:mm:ss");
      this.time = date;
      this.timeKeyup();
    },
  },
  methods: {
    ...mapActions(timeConversion, ["timeKeyup", "timeStampKeyup"]),
    updateCurrentTimeStamp() {
      const now = new Date();
      this.currentTimeStamp = now.getTime();
    },
    getDate() {
      let time = dayjs().format("YYYY-MM-DD HH:mm:ss");
      return time;
    },
  },
};
</script>

<style lang="scss" scoped>
:deep(.ant-picker) {
  background: none;
  border: none;
}

:deep(.ant-picker-input) {
  font-size: 22px;
}
:deep(.ant-picker-focused) {
  box-shadow: none !important;
}
</style>
