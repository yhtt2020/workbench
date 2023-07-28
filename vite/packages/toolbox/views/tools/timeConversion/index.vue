<template>
  <div class="mx-auto text-base" style="width: 80%">
    <div>当前时间：{{ getDate() }}</div>
    <div class="my-3">当前时间戳：{{ currentTimeStamp }}</div>
    <div class="flex">
      <XtInput
        class="xt-bg-2 xt-border rounded-xl"
        :limit="{ number: true, space: true }"
        style="height: 48px"
        v-model:data="timeStamp"
        @keyup="timeStampKeyup()"
        @change="timeStampKeyup()"
        @input="timeStampKeyup()"
      >
        <template #addonBefore>
          <div
            class="xt-bg-2 text-base xt-text flex justify-center items-center h-full"
            style="width: 80px; height: 48px; border-radius: 8px 0px 0px 8px"
          >
            时间戳
          </div>
        </template>
      </XtInput>
      <XtIcon
        @click="copyToClipboard(timeStamp)"
        :limit="{ space: true }"
        icon="fuzhi"
        size="28"
        type=""
      ></XtIcon>
    </div>
    <div class="my-3 flex justify-center" style="width: 100%">
      <icon icon="paixu" style="font-size: 28px"></icon>
      <!-- <XtIcon icon="paixu"></XtIcon> -->
    </div>

    <div class="flex">
      <XtInput
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
      </XtInput>
      <XtIcon
        @click="copyToClipboard(time)"
        icon="fuzhi"
        size="28"
        type=""
      ></XtIcon>
    </div>
    <div class="mt-3">时间转时间戳，请输入时间格式：“xxxx-xx-xx xx:xx:xx”</div>
  </div>
</template>

<script>
import dayjs from "../../../../table/components/card/hooks/day";

import { message } from "ant-design-vue";
import { timeConversion } from "../../../store/timeConversion";
import { mapWritableState, mapActions } from "pinia";

export default {
  data() {
    return {
      currentTimeStamp: 0,
      currentTimeStampTimer: "",
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
