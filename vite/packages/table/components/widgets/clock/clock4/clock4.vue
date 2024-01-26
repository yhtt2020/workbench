<template>
  <div class="clock4">
    <a-row :gutter="16">
      <div class="gutter-box" :style="[clockFont,noBg ? { background:'transparent !important'}:{ background:' var(--secondary-bg) !important' }]">{{ hours }}</div>
      <div class="gutter-box" :style="clockFont">:</div>
      <!-- ant-row -->
      <div class="gutter-box" :style="[clockFont,noBg ? { background:'transparent !important'}:{ background:' var(--secondary-bg) !important' }]">{{ min }}</div>
      <div class="gutter-box" :style="clockFont">:</div>
      <template :style="{ display: isSnow == true ? 'inline-block' : 'none' }">
        <div class="gutter-box" :style="[clockFont,noBg ? { background:'transparent !important'}:{ background:' var(--secondary-bg) !important' }, ]">{{ second }}</div>
      </template>
    </a-row>
  </div>
  
  <!-- <div class="gutter-box" :style="[clockFont,noBg ? { background:'transparent !important'}:{ background:' var(--secondary-bg) !important' }]">{{ hours }}</div>
  <div class="gutter-box">:</div>
  <div class="gutter-box" :style="[clockFont,noBg ? { background:'transparent !important'}:{ background:' var(--secondary-bg) !important' }]">{{ min }}</div>
  <div class="gutter-box" v-if="isSnow">:</div>
  <div class="gutter-box" v-if="isSnow" :style="[clockFont,noBg ? { background:'transparent !important'}:{ background:' var(--secondary-bg) !important' }, ]">{{ second }}</div> -->
</template>

<script>
export default {
  data() {
    return {
      hours: 0,
      min: 0,
      second: 0,
      timerID: 0,
    };
  },
  props: {
    isSnow: {
      type: Boolean,
      default: true,
    },
    clockFont:{
      type:String,
    },
    noBg:{
      type:Boolean,
      default:false,
    }
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
      this.hours = this.zeroPadding(cd.getHours(), 2);
      this.min = this.zeroPadding(cd.getMinutes(), 2);
      this.second = this.zeroPadding(cd.getSeconds(), 2);
    },
  },
  destroyed() {
    clearInterval(this.timerID);// 销毁定时器
  },
};
</script>

<style lang="scss" scoped>
.clock4 {
  // padding: 10px;
  width: 100%;
  // height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.gutter-box {
  color: #fff;
  font-family: Impact;
  font-size: 64px;
  color: var(--primary-text);
  // font-weight: 900;
  line-height: 138px;
  text-align: center;
  height: 138px;
  // width: 110px;
  padding: 8px;
  border-radius: 10px;
  // background: var(--secondary-bg);
  border-radius: 12px;
  margin: 8px;
}
</style>
