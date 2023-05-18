<template>
  <HomeComponentSlot :customData="customData" :customIndex="customIndex" :options="options" :formulaBar="formulaBar">
    <div class="box">
      <component :is="customData.clockiD" span="12" display="none" @click="fullScreen()" />
    </div>
  </HomeComponentSlot>
  <a-drawer :width="500" v-model:visible="settingVisible" placement="right">
    <template #title>
      <div class="text-center">设置</div>
    </template>
    <ClockStyle @updateClockStyle="updateClockStyle"></ClockStyle>
  </a-drawer>

  <teleport to="body">
    <ClockFullScreen v-if="isClockFullScreen" :clock="customData.clockiD" @exit="isClockFullScreen = false"
      @updateClockStyle="updateClockStyle">
    </ClockFullScreen>
  </teleport>
</template>

<script>
import HomeComponentSlot from "../HomeComponentSlot.vue";
import clock1 from "./clock1/clock1.vue";
import clock2 from "./clock2/clock2.vue";
import clock3 from "./clock3/clock3.vue";
import clock4 from "./clock4/clock4.vue";
import clock5 from "./clock5/clock5.vue";
import clock6 from "./clock6/clock6.vue";
import ClockStyle from "./clockStyle/ClockStyle.vue";
import ClockFullScreen from "./clockStyle/ClockFullScreen.vue"

import { cardStore } from "../../../store/card.ts";
import { mapActions } from "pinia";
export default {
  props: {
    customIndex: {
      type: Number,
      default: 0,
    },
    customData: {
      type: Object,
      default: () => { },
    },
  },
  data() {
    return {
      options: {
        className: "card small",
        title: "时钟",
        icon: "sound",
        type: "games",
      },
      isClockFullScreen: false,
      settingVisible: false,
      formulaBar: [
        {
          icon: "shezhi1",
          title: "设置",
          fn: () => {
            this.settingVisible = true;
          },
        },
      ],
      // 时间配置
      week: ["周末", "周一", "周二", "周三", "周四", "周五", "周六"],
    };
  },
  components: {
    HomeComponentSlot,
    clock1,
    clock2,
    clock3,
    clock4,
    clock5,
    clock6,
    ClockStyle,
    ClockFullScreen
  },
  created() {
    if (!this.customData.clockiD) {
      this.increaseCustomComponents(this.customIndex, { clockiD: "clock4" });
    }
  },
  mounted() {
    this.updateTime();
  },
  methods: {
    ...mapActions(cardStore, ["increaseCustomComponents"]),

    updateClockStyle(e) {
      this.increaseCustomComponents(this.customIndex, {
        clockiD: e,
      });
    },

    fullScreen() {
      this.isClockFullScreen = true
    },
    zeroPadding(num, digit) {
      let zero = "";
      for (let i = 0; i < digit; i++) {
        zero += "0";
      }
      return (zero + num).slice(-digit);
    },
    updateTime() {
      let cd = new Date();
      this.options.title =
        this.zeroPadding(cd.getMonth() + 1, 2) +
        "月" +
        this.zeroPadding(cd.getDate(), 2) +
        "日 " +
        this.week[cd.getDay()];
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  height: 90%;
  position: relative;
  margin-top: 10px;

  :deep(.clock3) {
    position: absolute;
    top: -108px;
    left: -50px;
    transform: scale(0.4, 0.4);
  }

  :deep(.gutter-box) {
    height: 140px;
  }

  :deep(.clock2) {
    padding-top: 25px;
    margin-left: -6px;
  }

  :deep(.M-Flipper) {
    margin: 20px 2px;
    font-size: 58px;
    width: 55px;
  }

  :deep(.clock5) {
    width: 90%;
    height: 120px;
    margin-top: 10px;

    #seconds,
    .a,
    #toggle-button {
      display: none;
    }
  }
}

.clock-box {
  margin: 10px 0;
  box-sizing: border-box;
  position: relative;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
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
</style>
