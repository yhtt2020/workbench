<template>
  <xt-container
    :customIndex="customIndex"
    :customData="customData"
    :desk="desk"
    :menuList="menuList"
    v-model:customSize="customData.customSize"
    :header="header"
    :options="options"
    :sizeList="sizeList"
    :resizeOptions="resizeOptions"
    @leftClick="fullScreen"
    @resize="resize"
    @delete="deleteCard"
  >
    <ClockSettingModal
      ref="clockSettingRef"
      :customIndex="customIndex"
      :desk="desk"
      :customData="customData"
      @updateClockStyle="updateClockStyle"
      :isFull="false"
      @restZoom="restZoom"
    />
    <ClockFullScreen
      v-if="isClockFullScreen"
      :customData="customData"
      :clock="customData.clockId"
      :bgZoom="customData.bgZoom"
      :imgUrl="fullImage"
      @updateClockStyle="updateClockStyle"
      @updateBgZoom="updateBgZoom"
      @exit="isClockFullScreen = false"
    >
    </ClockFullScreen>
    <div class="box no-drag" @click="fullScreen">
      <div
        style="width: 100%; height: 100%"
        class="flex items-center justify-center"
      >
        <!-- :style="sliderScale" -->
        <component
          :is="customData.clockId"
          :noBg="true"
          :customData="customData"
          :isSnow="customData.enableSecond"
          :hideDate="false"
          :clockFont="customData.font"
          :style="{ zoom: cardZoom }"
        >
          <!-- customZoom -->
        </component>
      </div>
    </div>
    {{}}
  </xt-container>
</template>

<script>
import mixin from "./hooks/clockMixin.js";
import { mapActions, mapWritableState } from "pinia";
// import { defaultClockData } from "../../../apps/folder/src/components/options";
import { cardStore } from "../../../store/card";
// import { weatherStore } from "../../../store/weather";
import { appStore } from "../../../store";
import { dateTimeStamp } from "./hooks/clockList";
// import Weather from './components/Weather.vue'
import Resize from "../../../apps/folder/src/components/Resize.vue";
import ClockSettingModal from "./components/ClockSettingModal.vue";
import ClockFullScreen from "./clockState/ClockFullScreen.vue";
import { DEFAULT } from "../../../js/const/default";

import { communityNavStore } from "../../bottomPanel/store/communityNavStore";

import { communityMember } from "../../../apps/communityDesk/hooks/deskCreateMethod";
import { loadData } from "../../../save/loadData";

export default {
  mixins: [mixin],

  components: {
    Resize,
    ClockSettingModal,
    ClockFullScreen,
    // Weather
  },

  emit: ["delete"],

  props: {
    customIndex: { type: Number, default: 0 },
    customData: {
      type: Object,
      default: {
        customSize: "2x2",
        enableSecond: false,
      },
    },
    desk: { type: Object },
    openWay: {
      type: String,
      default: "desk",
    },
  },

  data() {
    return {
      menuList: [
        {
          icon: "shezhi1",
          title: "设置",
          fn: () => {
            this.$refs.clockSettingRef.openClockModal();
          },
        },
      ],
      key: Date.now(),
      week: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
      //  defaultClockData:defaultClockData,
      isClockFullScreen: false,
      bgZoom: this.customData.bgZoom,
      clockDay: this.dateTimeStamp(Date.now()),
      //  zoom: "1.05",
      //  zooms: {
      //   // 无限拉伸是0, 1*1是1 2*2是2
      //   clock1: [155, 35, 35],
      //   clock2: [160, 66, 50],
      //   clock3: [150, 0, 80],
      //   clock4: [140, 0, 30],
      //   clock5: [150, 0, 25],
      //   clock6: [180, 0, 80],
      //  },
      //  bgZoom: 0,
      //  widthHeightObj: {}
    };
  },
  // mounted() {
  //   // 当底部导航栏为windows模式时，点击导航栏中的时间，进入时间全屏
  //   this.$bus.on("openClockFullScreen", (data) => {
  //     this.isClockFullScreen = data;
  //   });
  //   if (typeof this.customData.enableSecond === "undefined") {
  //     this.customData.enableSecond = false;
  //   }
  //   if (typeof this.customData.backgroundFrame === "undefined") {
  //     this.customData.backgroundFrame = true;
  //   }
  //   if (this.customData.customZoom === undefined) {
  //     this.updateCustomData(
  //       this.customIndex,
  //       {
  //         backgroundFrame: true,
  //         clockId: "clock4",
  //         imgUrl: DEFAULT.WALLPAPER,
  //         blurs: 3,
  //         bgZoom: 100,
  //         zoom: 1.5,
  //         customSize: "2x2",
  //         font: "font-family: '优设标题黑' !important;",
  //         fontColor: "#FFFFFF",
  //         enableSecond: false,
  //         currentStatus: "font",
  //         currentZoom: 100,
  //         name: dateTimeStamp(Date.now()),
  //         _updateFlag: "24531",
  //       },
  //       this.desk
  //     );
  //   }
  //   // 在不切换页面的情况下,通过定时器来实现自动更新时钟日期标题
  //   this.clockTime = setInterval(() => {
  //     this.clockDay = this.dateTimeStamp(Date.now());
  //   }, 12 * 60 * 60 * 1000);
  //
  //   if (this.options.disableEdit) {
  //     this.menuList = [];
  //   } else {
  //     this.menuList = [
  //       {
  //         icon: "shezhi1",
  //         title: "设置",
  //         fn: () => {
  //           this.$refs.clockSettingRef.openClockModal();
  //         },
  //       },
  //     ];
  //   }
  // },
  computed: {
    cardZoom() {
      // 获取当前时钟ID
      let clockID = this.customData.clockId || 'clock7';
      // 时钟缩放列表
      let zoomList = {
        // 下标0为默认，下标1为高度为1时无边框时，下边2为高度为1非无边框时
        clock1: [0.25, 1, 0.7],
        clock2: [0.5, 1, 0.7],
        clock3: [0.5, 0.5, 0.2],
        clock4: [0.6, 0.9, 0.5],
        clock5: [0.5, 0.7, 0.4],
        clock6: [0.3, 0.65, 0.35],
        clock7: [0.05, 0.8, 0.5],
      };

      // 时钟秒针缩放列表
      let secondList = {
        clock1: 0.8,
        clock2: 0.8,
        clock3: 1,
        clock4: 0.6,
        clock5: 0.8,
        clock6: 1,
        clock7: 0.6,
      };
      let second = this.customData.enableSecond ? secondList[clockID] : 1;

      const currentZoom = zoomList[clockID];
      let res = this.customData.customSize.split("x");
      let w = parseInt(res[0]);
      let h = parseInt(res[1]);
      let num = 0;
      let zoom = 1;
      // 最大数
      let max = w > h ? w : h;
      // 宽度高度相差调整最大值
      if (w - h >= 2) {
        max = h;
      } else if (h - w >= 2) {
        max = w;
      }
      // 宽高为2
      if (w == 2 && h == 2) {
        num = 0;
        zoom = 1;
      }
      // 宽高相等
      else if (w == h) {
        num = 0;
        zoom += currentZoom[num] * (max - 2) - currentZoom[num];
      }
      // 高度为1
      else if (h == 1) {
        if (this.customData.noBorder) {
          num = 1;
        } else {
          num = 2;
        }
        zoom = currentZoom[num];
      }
      // 宽高大于2x2
      else if (w > 2 && h > 2) {
        num = 0;
        zoom += currentZoom[num] * max;
      }

      let zoomRatio = this.customData.currentZoom / 100;
      return zoom * second * zoomRatio;
    },
    ...mapWritableState(appStore, ["backgroundImage", "settings"]),
    resizeOptions() {
      return {
        minH: 1,
        odd: true,
      };
    },
    sizeList() {
      return [
        {
          name: "2x1",
          value: "2x1",
        },
        {
          name: "4x1",
          value: "4x1",
        },
        {
          name: "2x2",
          value: "2x2",
        },
        {
          name: "4x2",
          value: "4x2",
        },
        {
          name: "4x4",
          value: "4x4",
        },
      ];
    },

    // 组件头部
    header() {
      const headerOption = {
        title: this.customData.backgroundFrame ? `${this.clockDay}` : "",
        // ifyIcon: this.customData.backgroundFrame ? "fluent:clock-12-regular" : "",
        showIcon: "/logo/clock.svg",
        leftHover: true,
        leftHoverName: "进入全屏",
        leftHoverIcon: "fluent:open-16-regular",
        rightIcon: [],
      };
      return headerOption;
    },

    // 配置数据
    options() {
      return {
        // shadow: !this.customData.backgroundFrame,
        // bg: !this.customData.backgroundFrame ? "transparent" : "",
        resize: !this.isCommunityDesktop(this.desk) ? true : false,

        noBorder: this.customData.noBorder,

        defaultData: {
          noBorder: false,
          backgroundFrame: true,
          clockId: "clock7",
          imgUrl: DEFAULT.WALLPAPER,
          blurs: 3,
          bgZoom: 100,
          zoom: 1.5,
          customSize: "2x2",
          font: "font-family: '优设标题黑' !important;",
          fontColor: "#FFFFFF",
          enableSecond: false,
          currentStatus: "font",
          currentZoom: 100,
          name: dateTimeStamp(Date.now()),
        },
        customDel: this.openWay === "nav" ? true : false,
        disableEdit: this.isCommunityDesktop(this.desk),
        cardName: '时钟'
      };
    },
    // 拖拽缩放
    customZoom() {
      let width = Number(this.customData.customSize.split("x")[0]);
      let height = Number(this.customData.customSize.split("x")[1]);
      let min = width < height ? width : height;
      let minProp;
      if (this.customData.enableSecond) {
        minProp = 1.5 - 0.5 + (Number(min) - 2) * (min < 6 ? 0.4 : 0.5);
        this.customData.zoom = minProp;
        return minProp;
      } else {
        minProp = 1.5 + (Number(min) - 2) * (min < 6 ? 0.6 : 0.7);
        this.customData.zoom = minProp;
        return minProp;
      }
    },
    // 滑块缩放,是否开启秒针
    sliderScale() {
      if (!this.customData.customSize) {
        this.customData.customSize = "2x2";
      }
      let width = Number(this.customData.customSize.split("x")[0]);
      let height = Number(this.customData.customSize.split("x")[1]);
      let min = width < height ? width : height;
      if (this.customData.enableSecond) {
        return {
          transform: `scale(${
            Number(this.customData.currentZoom) / (100 + Number(min - 2) * 0.15)
          })`,
        };
      } else {
        return {
          transform: `scale(${
            Number(this.customData.currentZoom) / (100 + Number(min - 2) * 0.25)
          })`,
        };
      }
    },
    // 全屏情况下
    fullImage() {
      if (this.backgroundImage.path) {
        return this.backgroundImage.path;
      } else {
        if (this.customData.imgUrl) {
          return this.customData.imgUrl;
        } else {
          //  return this.defaultClockData.imgUrl;
        }
      }
    },
  },

  mounted() {
    console.log({...this.customData},'载入的时候customData')
    // console.log(this.desk,'clock')
    // 当底部导航栏为windows模式时，点击导航栏中的时间，进入时间全屏
    this.$bus.on("openClockFullScreen", (data) => {
      this.isClockFullScreen = data;
    });
    if (typeof this.customData.enableSecond === "undefined") {
      this.customData.enableSecond = false;
    }
    if (typeof this.customData.backgroundFrame === "undefined") {
      this.customData.backgroundFrame = true;
    }
    if (this.customData.customZoom === undefined) {
      this.updateCustomData(
        this.customIndex,
        {
          backgroundFrame: true,
          clockId: "clock7",
          imgUrl: DEFAULT.WALLPAPER,
          blurs: 3,
          bgZoom: 100,
          zoom: 1.5,
          customSize: "2x2",
          font: "font-family: '优设标题黑' !important;",
          fontColor: "#FFFFFF",
          enableSecond: false,
          currentStatus: "font",
          currentZoom: 100,
          name: dateTimeStamp(Date.now()),
          _updateFlag: "24531",
        },
        this.desk
      );
    }
    // 在不切换页面的情况下,通过定时器来实现自动更新时钟日期标题
    this.clockTime = setInterval(() => {
      this.clockDay = this.dateTimeStamp(Date.now());
    }, 12 * 60 * 60 * 1000);

    if (this.options.disableEdit) {
      this.menuList = [];
    } else {
      this.menuList = [
        {
          icon: "shezhi1",
          title: "设置",
          fn: () => {
            this.$refs.clockSettingRef.openClockModal();
          },
        },
      ];
    }

    if (communityMember(this.desk?.communityNo)) {
      //
      const target = {
        customIndex: this.customIndex,
        desk: this.desk,
      };
      loadData("desk", target).then((rs) => {
        if (rs) {
          this.updateCustomData(this.customIndex, { ...rs }, this.desk);
        }
      });
    }
  },

  methods: {
    ...mapActions(cardStore, ["updateCustomData"]),
    ...mapActions(communityNavStore, ["isCommunityDesktop"]),

    dateTimeStamp,
    deleteCard() {
      this.$emit("delete");
    },
    // 时组件全屏
    fullScreen() {
      this.isClockFullScreen = true;
    },
    // 卡片组件缩放处理
    resize(data) {
      this.updateCustomData(this.customIndex, { customSize: data }, this.desk);
      const width = this.customData.customSize.split("x")[0];
      const height = this.customData.customSize.split("x")[1];
      let max = width < height ? width : height;
      if (max - 2 < 2) {
        this.updateCustomData(this.customIndex, { customZoom: 110 }, this.desk);
      } else if (max - 2 < 4) {
        this.updateCustomData(this.customIndex, { customZoom: 130 }, this.desk);
      } else {
        this.updateCustomData(this.customIndex, { customZoom: 140 }, this.desk);
      }
    },
    // 重置卡片组件设置中缩放比例
    restZoom() {
      this.updateCustomData(this.customIndex, { currentZoom: 100 }, this.desk);
    },
    // 更新全屏情况下的缩放比例
    updateBgZoom(e) {
      this.updateCustomData(this.customIndex, { bgZoom: e }, this.desk);
      this.bgZoom = e;
    },
    // 更新时钟样式
    updateClockStyle(e) {
      this.updateCustomData(this.customIndex, { clockId: e }, this.desk);
      this.updateCustomData(this.customIndex, { currentZoom:100 }, this.desk);
    },
  },

  unmounted() {
    clearInterval(this.clockTime);
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
    // transform: scale(0.2);
    transform: scale(0.85);
  }

  :deep(.clock4) {
    //transform: scale(0.65);
    & .ant-row {
      flex-flow: nowrap !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
    & .gutter-box {
      padding: 0 !important;
    }
    /**
    :deep(.ant-row){
     margin: 0 !important;
     flex-flow: nowrap !important;
   }
   **/
  }

  :deep(.clock1) {
    transform: scale(0.65);
  }

  :deep(.clock5) {
    transform: scale(0.5);
    // transform: scale(0.85);
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
