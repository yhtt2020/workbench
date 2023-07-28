import { defineStore } from "pinia";
import dayjs from "../../table/components/card/hooks/day";
export const timeConversion = defineStore("timeConversion", {
  state: () => ({
    timeStamp: "",
    time: "",
  }),
  actions: {
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
      console.log("21312312 :>> ", 21312312);
      let timestamp = parseInt(this.timeStamp);
      // 使用 dayjs 将时间戳转换为时间
      const dateObj = dayjs(timestamp);
      const formattedDate = dateObj.format("YYYY-MM-DD HH:mm:ss");
      this.time = formattedDate;
    },
  },
});
