<template>
  <div class="clock2">
    <p class="time">{{ time }}</p>
    <p class="date" v-if="display == 'block'">{{ date }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      time: "",
      date: "",
      timerID: 0,
      week: [
        "星期天",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ],
    };
  },
  props: {
    display: {
      type: String,
      default: "block",
    },
  },
  mounted() {
    this.timerID = setInterval(this.updateTime, 1000);
    this.updateTime();
  },
  methods: {
    zeroPadding(num, digit) {
      let zero = "";
      for (let i = 0; i < digit; i++) {
        zero += "0";
      }
      return (zero + num).slice(-digit);
    },
    updateTime() {
      let cd = new Date();
      this.time =
        this.zeroPadding(cd.getHours(), 2) +
        ":" +
        this.zeroPadding(cd.getMinutes(), 2) +
        ":" +
        this.zeroPadding(cd.getSeconds(), 2);
      this.date =
        this.zeroPadding(cd.getFullYear(), 4) +
        "年" +
        this.zeroPadding(cd.getMonth() + 1, 2) +
        "月" +
        this.zeroPadding(cd.getDate(), 2) +
        "日 " +
        this.week[cd.getDay()];
    },
  },
  destroyed() {
    // 销毁定时器
    clearInterval(this.timerID);
  },
};
</script>

<style lang="scss" scoped>
@import "./clock2.css";
</style>
