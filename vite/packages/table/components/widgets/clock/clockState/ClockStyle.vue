<template>
  <div class="text-base" style="margin: 12px 0">时钟样式</div>
  <div class="clock-box no-drag pointer">
    <clock1 @click="updateClockStyle('clock1')"></clock1>
  </div>
  <div class="clock-box no-drag pointer">
    <clock2 @click="updateClockStyle('clock2')"></clock2>
  </div>
  <div class="clock-box clock no-drag pointer">
    <clock3 @click="updateClockStyle('clock3')"></clock3>
  </div>
  <div class="clock-box no-drag pointer">
    <clock4 @click="updateClockStyle('clock4')"></clock4>
  </div>
  <div class="clock-box clock5 no-drag pointer">
    <clock5 @click="updateClockStyle('clock5')"></clock5>
  </div>
  <div class="clock-box no-drag pointer">
    <clock6 @click="updateClockStyle('clock6')"></clock6>
  </div>
</template>
<script>
import mixin from "../hooks/clockMixin.js"
export default {
  mixins: [mixin],
  emits:['updateClockStyle'],
  methods: {
    updateClockStyle(e) {
      this.$emit("updateClockStyle", e);
    },
  },
};
</script>

<style lang="scss" scoped>
.clock-box {
  margin: 10px 0;
  box-sizing: border-box;
  position: relative;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  background: var(--secondary-bg);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.clock {
  height: 150px;
  position: relative;

  :deep(.clock3) {
    transform: scale(0.34, 0.34);
    position: absolute;
    top: -105px;
    left: 40px;
  }
}

.clock5 {
  height: 190px;
  position: relative;

  :deep(.clock5) {
    transform: scale(0.6);
    position: absolute;
    top: -32px;
  }
}
</style>
