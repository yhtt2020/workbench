<template>
  <div class="clock2">
    <p class="time">{{ time }}<span :style="{ display: isSnow == true ? 'inline-block' : 'none' }">{{ min }}</span></p>
    <p class="date" :style="{ display: isSnow == true ? 'inline-block' : 'none' }">{{ date }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      time: "",
      min: "",
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
    isSnow: {
      type: String,
      default: true,
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
        this.zeroPadding(cd.getMinutes(), 2)
      this.min = ":" +
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

    clearInterval(this.timerID);   //  销毁定时器
  },
};
</script>

<style lang="scss" scoped>
.clock2 {
  color: #ffffff;
  text-align: center;
  /* width: 100%;
  height: 100%; */
  text-shadow: 0 0 20px #a9a9a9, 0 0 10px rgba(31, 31, 31, 0.25);

}

.clock2 .time {
  font-family: "sans-serif";
  letter-spacing: 0.05em;
  font-size: 60px;
  padding: 0 0;
  margin-top: -10px;
  margin-bottom: 0;
}

.clock2 .date {
  letter-spacing: 0.1em;
  font-size: 15px;
  margin-top: -15px;
}

.clock2 .name {
  letter-spacing: 0.1em;
  font-size: 12px;
  padding: 20px 0 0;
}
</style>
