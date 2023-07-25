<template>
  <div class="mx-auto text-base" style="width: 80%">
    <div>当前时间：{{ getDate() }}</div>
    <div class="my-3">当前时间戳：{{ currentTimeStamp }}</div>
    <div class="flex">
      <Tinput
        class="xt-bg-2 xt-border rounded-xl"
        style="height: 48px"
        v-model:data="timeStamp"
        @keyup="timeStampKeyup()"
      >
        <template #addonBefore>
          <div
            class="xt-bg-2 text-base xt-text flex justify-center items-center h-full"
            style="width: 80px; height: 48px; border-radius: 8px 0px 0px 8px"
          >
            时间戳
          </div>
        </template>
      </Tinput>
      <div class="p-2 cursor-pointer" @click="copyToClipboard(timeStamp)"><icon icon="fuzhi" style="font-size: 28px"></icon></div>
    </div>
    <div class="my-3"><icon icon="paixu" style="font-size: 28px"></icon></div>

    <div class="flex">
      <Tinput
        class="xt-bg-2 xt-border rounded-xl"
        style="height: 48px"
        v-model:data="time"
        @keyup="timeKeyup()"
      >
        <template #addonBefore>
          <div
            class="xt-bg-2 text-base xt-text flex justify-center items-center h-full"
            style="width: 80px; height: 48px; border-radius: 8px 0px 0px 8px"
          >
            时间
          </div>
        </template>
      </Tinput>
      <div  class="p-2 cursor-pointer" @click="copyToClipboard(time)"><icon icon="fuzhi" style="font-size: 28px"></icon></div>
    </div>
    <div class="mt-3">时间转时间戳，请输入时间格式：“xxxx-xx-xx xx:xx:xx”</div>
  </div>
</template>

<script>
import { message } from "ant-design-vue";
import dayjs from "./day";
export default {
  data() {
    return {
      currentTimeStamp: 0,
      currentTimeStampTimer: "",
      timeStamp: "",
      time: "",
    };
  },
  mounted() {
    this.updateCurrentTimeStamp();
    this.currentTimeStampTimer = setInterval(this.updateCurrentTimeStamp, 1000);
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.currentTimeStampTimer);
    next();
  },
  methods: {
    updateCurrentTimeStamp() {
      const now = new Date();
      this.currentTimeStamp = now.getTime();
    },
    getDate() {
      let time = dayjs().format("YYYY-MM-DD HH:mm:ss");
      return time;
    },
    // 时间转时间戳
    timeKeyup() {
      let timeString = this.time;
      // 使用 dayjs 将时间转换为时间戳，并补全时间
      const formattedDate = dayjs(timeString).format("YYYY-MM-DD HH:mm:ss");
      const timestamp = dayjs(formattedDate).valueOf();
      this.timeStamp = timestamp;
    },
    // 时间戳转时间
    timeStampKeyup() {
      let timestamp = parseInt(this.timeStamp);

      // 使用 dayjs 将时间戳转换为时间
      const dateObj = dayjs(timestamp);
      const formattedDate = dateObj.format("YYYY-MM-DD HH:mm:ss");
      this.time = formattedDate;
    },
    copyToClipboard(text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          message.success("已成功复制到剪切板");
        })
        .catch((err) => {});
    },
  },
};
</script>

<style lang="scss" scoped></style>
