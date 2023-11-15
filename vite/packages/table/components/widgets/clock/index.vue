<template>
  <Widget
    :customData="customData"
    :size="reSize"
    :customIndex="customIndex"
    :options="options"
    :menuList="menuList"
    ref="homelSlotRef"
    :desk="desk"
  >
  <template #left-title-icon>
        <div
          class="icon"
          style=" width: 38px;height: 24px; display: flex;justify-content: center;align-items: center;position: absolute;
            left: 2px; ">
          <!-- <RobotOutlined style="font-size: 20px" /> -->
          <clockIcon icon="fluent:clock-12-regular" style="font-size: 20px;" />
        </div>
      </template>
    <cardDrag ref="drag" @reSizeInit="reSizeInit" class="drag">
      <template #="{ row }">
        <div class="box no-drag" @click="fullScreen()">
          <component
            :is="customData.clockId"
            :isSnow="isSnow"
            :class="{
              isClock5: isClock5 == true,
              isClock5w420: isClock5w420 == true,
            }"
            :style="{ zoom: zoom }"
          />
        </div>
      </template>
    </cardDrag>
  </Widget>
  <a-drawer :width="500" v-model:visible="settingVisible" placement="right">
    <template #title>
      <div class="text-center">设置</div>
    </template>
    <!--  -->
    <XtRadio @onChange="__updateSize" :data="customData.dragCardSize"></XtRadio>
    <ClockStyle @updateClockStyle="updateClockStyle"></ClockStyle>
  </a-drawer>

  <ClockFullScreen
    @updateBlur="updateBlur"
    @updateBgZoom="updateBgZoom"
    v-if="isClockFullScreen"
    :imgUrl="customData.imgUrl"
    :clock="customData.clockId"
    @exit="isClockFullScreen = false"
    @updateClockStyle="updateClockStyle"
    @updateImgUrl="updateImgUrl"
    :blur="customData.blurs"
    :bgZoom="bgZoom"
  >
  </ClockFullScreen>
</template>

<script>
import Widget from "../../card/Widget.vue";
import ClockStyle from "./clockState/ClockStyle.vue";
import ClockFullScreen from "./clockState/ClockFullScreen.vue";

import mixin from "./hooks/clockMixin.js";
import { cardStore } from "../../../store/card.ts";
import { mapActions } from "pinia";

import cardDrag from "../../card/hooks/cardDrag.vue";
import cardDragHook from "../../card/hooks/cardDragHook";

import cardSizeHook from "../../card/hooks/cardSizeHook";
import {Icon as clockIcon } from '@iconify/vue'
export default {
  mixins: [mixin, cardDragHook, cardSizeHook],
  props: {
    customIndex: {
      type: Number,
      default: 0,
    },
    customData: {
      type: Object,
      default: () => {},
    },
    desk: {
      type: Object,
    },
  },
  data() {
    return {
      key: Date.now(),
      options: {
        className: "card small",
        title: "时钟",
        icon: "",
        type: "games",
      },
      menuList: [
        {
          icon: "shezhi1",
          title: "设置",
          fn: () => {
            this.$refs.homelSlotRef.visible = false;
            this.settingVisible = true;
          },
        },
      ],
      week: ["周末", "周一", "周二", "周三", "周四", "周五", "周六"],
      isClockFullScreen: false,
      settingVisible: false,
      isSnow: true,
      isClock5: false,
      isClock5w420: false,
      zoom: "100%",
      zooms: {
        // 无限拉伸是0, 1*1是1 2*2是2
        clock1: [55, 35, 35],
        clock2: [60, 66, 50],
        clock3: [150, 0, 80],
        clock4: [40, 0, 30],
        clock5: [50, 0, 25],
        clock6: [80, 0, 80],
      },
      bgZoom: 0,
      widthHeightObj: {},
    };
  },
  components: {
    Widget,
    ClockStyle,
    ClockFullScreen,
    cardDrag,
    clockIcon
  },
  created() {},
  mounted() {
    let setData = {};
    if (!this.customData.clockId) {
      setData.clockId = "clock4";
    }
    if (!this.customData.imgUrl) {
      setData.imgUrl =
        "https://p.ananas.chaoxing.com/star3/origin/fa7d6f2c69aae528484d8278575c28ef.jpg";
    }
    if (this.customData.blurs === undefined) {
      setData.blurs = 3;
    }
    if (!this.customData.bgZoom) {
      setData.bgZoom = 0;
    }
    if (Object.keys(setData).length) {
      this.updateCustomData(this.customIndex, setData, this.desk);
    }
    this.bgZoom = this.customData.bgZoom;
    this.updateTime();
  },

  methods: {
    ...mapActions(cardStore, ["updateCustomData"]),
    onReSize(e, i, clock, widthHeightObj) {
      clock = clock ?? this.customData.clockId;
      i = widthHeightObj ?? i;
      let { width, height } = i;
      this.widthHeightObj = i;
      let zoomRatio = 0;
      let max = width > height ? width : height;
      let zoom;
      if (height <= 1 || width <= 1) {
        zoom = 100 + zoomRatio;
        if (width <= 1) {
          this.isSnow = false;
          zoom = 0;
        } else {
          this.isSnow = true;
          // zoom = this.zooms[this.customData.clockId][1]
        }
      } else if (width - height > 1 || height - width > 1) {
        this.isSnow = true;
        zoomRatio = this.zooms[clock][0];
        let h = height - width;
        let w = width - height;
        let x;
        if (h > w) {
          switch (h) {
            case 2:
              x = 1;
              break;
            case 3:
              x = 4;
              break;
            case 4:
              x = 2;
              break;
            default:
              x = 0.5;
          }
          zoomRatio /= h + x;
        } else {
          zoomRatio /= w * 0.25;
          zoomRatio /= 3;
        }
        zoom = 100 + zoomRatio * (max - 3);
      } else {
        this.isSnow = true;
        if (width > 2 && height > 2) {
          zoomRatio = this.zooms[clock][0];
          zoom = 100 + zoomRatio * (max - 2);
        } else if (width >= 2 || height <= 2) {
          zoomRatio = this.zooms[clock][2];
          zoom = 100 + zoomRatio;
        }
      }
      this.zoom = `${zoom}%`;
      if (clock == "clock5") {
        if (height > 1 && width > 1) {
          this.isClock5 = false;
          this.isSnow = true;
        } else {
          if (height <= 1 && width > 1) {
            this.isClock5w420 = true;
          } else {
            this.isClock5w420 = false;
          }
          this.isClock5 = true;
          this.isSnow = false;
        }
      }
    },
    updateBlur(e) {
      this.updateCustomData(
        this.customIndex,
        {
          blurs: e,
        },
        this.desk
      );
      this.blur = e;
    },
    updateBgZoom(e) {
      this.updateCustomData(
        this.customIndex,
        {
          bgZoom: e,
        },
        this.desk
      );
      this.bgZoom = e;
    },
    updateClockStyle(e) {
      this.onReSize(0, 0, e, this.widthHeightObj);
      this.updateCustomData(
        this.customIndex,
        {
          clockId: e,
        },
        this.desk
      );
    },
    updateImgUrl(url) {
      this.updateCustomData(
        this.customIndex,
        {
          imgUrl: url,
        },
        this.desk
      );
    },
    fullScreen() {
      this.isClockFullScreen = true;
    },
    zeroPadding(num, digit) {
      let zero = "";
      for (let i = 0; i < digit; i++) {
        zero += "0";
      }
      return (zero + num).slice(-digit);
    },
    updateTime() {
      let currentDate = new Date();

      const month = currentDate.getMonth() + 1; // 注意：月份从0开始，所以需要加1
      const day = currentDate.getDate();
      const daysOfWeek = [
        "周日",
        "周一",
        "周二",
        "周三",
        "周四",
        "周五",
        "周六",
      ];
      const dayOfWeek = daysOfWeek[currentDate.getDay()];
      this.options.title = month + "月" + day + "日 " + dayOfWeek;
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
  cursor: pointer;

  :deep(.clock3) {
    transform: scale(0.35);
  }

  :deep(.clock2) {
    transform: scale(1.2);
  }

  :deep(.clock5) {
    transform: scale(0.85);
  }

  .isClock5w420 {
    :deep(.clock5) {
      .a {
        display: block !important;
      }

      .time {
        width: 100px !important;
      }
    }
  }

  .isClock5 {
    :deep(.clock5) {
      height: 120px;

      .time {
        margin-top: 10px;
        width: 70px;
        height: 100px;
        line-height: 100px;
        padding: 0;
        text-align: center;
        font-size: 40px;
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
}
</style>
