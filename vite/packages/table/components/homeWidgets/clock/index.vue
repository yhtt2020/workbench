<template>
  <HomeComponentSlot :customData="customData" :size="reSize" :customIndex="customIndex" :options="options"
    :formulaBar="formulaBar">
    <cardDrag ref="drag" @reSizeInit="reSizeInit">
      <template #="{ row }">
        <div class="box" @click="fullScreen()">
          <component :is="customData.clockiD" display="none" />
        </div>
      </template>
    </cardDrag>
  </HomeComponentSlot>
  <a-drawer :width="500" v-model:visible="settingVisible" placement="right">
    <template #title>
      <div class="text-center">设置</div>
    </template>
    <cardSize @__updateSize="__updateSize" :isActive="isActive"></cardSize>
    <ClockStyle @updateClockStyle="updateClockStyle"></ClockStyle>
  </a-drawer>

  <ClockFullScreen @updateBlur="updateBlur" v-if="isClockFullScreen" :imgUrl="customData.imgUrl"
    :clock="customData.clockiD" @exit="isClockFullScreen = false" @updateClockStyle="updateClockStyle"
    @updateImgUrl="updateImgUrl" :blur="blur">
  </ClockFullScreen>
</template>

<script>
import HomeComponentSlot from "../HomeComponentSlot.vue";
import ClockStyle from "./clockState/ClockStyle.vue";
import ClockFullScreen from "./clockState/ClockFullScreen.vue"


import mixin from "./hooks/clockMixin.js"
import { cardStore } from "../../../store/card.ts";
import { mapActions } from "pinia";


import cardDrag from "../note/hooks/cardDrag.vue"
import cardDragHook from "../note/hooks/cardDragHook"

import cardSize from "../note/hooks/cardSize.vue"
import cardSizeHook from "../note/hooks/cardSizeHook"
export default {
  mixins: [mixin, cardDragHook, cardSizeHook],
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
        icon: "time-circle",
        type: "games",
      },
      isClockFullScreen: false,
      settingVisible: false,
      isSnow: "block",
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
      blur: 10
    };
  },
  components: {
    HomeComponentSlot,
    ClockStyle,
    ClockFullScreen,
    cardDrag,
    cardSize
  },
  created() {
    if (!this.customData.clockiD) {
      this.increaseCustomComponents(this.customIndex, {
        clockiD: "clock4",
      });
    }
    if (!this.customData.imgUrl) {
      this.increaseCustomComponents(this.customIndex, {
        imgUrl: "url(https://p.ananas.chaoxing.com/star3/origin/fa7d6f2c69aae528484d8278575c28ef.jpg)"
      });
    }
    if (!this.customData.blur) {
      this.increaseCustomComponents(this.customIndex, {
        blur: 10,
      });
    }
  },
  mounted() {
    this.blur = this.customData.blur
    this.updateTime();

  },

  methods: {
    ...mapActions(cardStore, ["increaseCustomComponents"]),
    reSizeCB(e) {
      let str = e.split(",")
      if (str[0] > 285) {
        console.log('1 :>> ', 1);
      }
    },
    updateBlur(e) {
      this.increaseCustomComponents(this.customIndex, {
        blur: e,
      });
      this.blur = e
    },
    updateClockStyle(e) {
      this.increaseCustomComponents(this.customIndex, {
        clockiD: e,
      });
    },
    updateImgUrl(url) {
      this.increaseCustomComponents(this.customIndex, {
        imgUrl: url,
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
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  :deep(.clock3) {
    position: absolute;
    transform: scale(0.36, 0.36);
  }

  :deep(.gutter-box) {
    height: 140px;
  }

  :deep(.clock2) {
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
