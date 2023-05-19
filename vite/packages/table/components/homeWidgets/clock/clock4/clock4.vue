<template>
  <div class="gutter-example clock4">
    <a-row :gutter="16">
      <a-col class="gutter-row" :span="span">
        <div class="gutter-box">{{ hours }}</div>
      </a-col>
      <a-col class="gutter-row" :span="span">
        <div class="gutter-box">{{ min }}</div>
      </a-col>
      <template v-if="span == 8">
        <a-col class="gutter-row" :span="8">
          <div class="gutter-box">{{ second }}</div>
          {{ date }}
        </a-col>
      </template>
    </a-row>
  </div>
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
    span: {
      type: Number,
      default: 8,
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
.gutter-box {
  color: #fff;
  font-family: Impact;
  font-size: 64px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 900;
  line-height: 138px;
  text-align: center;
  height: 138px;
  width: 120px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
}
</style>
