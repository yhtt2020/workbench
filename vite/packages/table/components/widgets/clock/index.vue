<template>
  <Widget
    :customData="customData"
    :size="reSize"
    :customIndex="customIndex"
    :options="options"
    :menuList="menuList"
    ref="homelSlotRef"
    :desk="desk"
    :showRightIcon="customData.backgroundFrame"
  >
    <template #left-title-icon>
        <div class="icon"
          style=" width: 38px;height: 24px; display: flex;justify-content: center;align-items: center;position: absolute;
            left: 2px; " v-if="customData.backgroundFrame">
          <clockIcon icon="fluent:clock-12-regular" style="font-size: 20px;" />
        </div>
    </template>

    <cardDrag ref="drag" @reSizeInit="reSizeInit" class="drag">
      <template #="{ row }">
        <div class="box no-drag" @click="fullScreen()">
          <div :style="newZoom">
            <component
            :is="customData.clockId"
            :isSnow="customData.enableSecond"
            :class="{
              isClock5: isClock5 == true,
              isClock5w420: isClock5w420 == true,
            }"
            :style="{ zoom: zoom }"
            :clockFont="customData.font"
            :showBackground="true"
            :noBg="true"
            :hideDate="false"
            :customData="customData"
          />
          </div>
          
        </div>
      </template>
    </cardDrag>

    
  </Widget>

  <ClockSettingModal ref="clockSettingRef" :customIndex="customIndex" :customData="customData" :desk="desk" @updateClockStyle="updateClockStyle" />
  <!-- <a-drawer :width="500" v-model:visible="settingVisible" placement="right">
    <template #title>
      <div class="text-center">设置</div>
    </template>
    <XtRadio @onChange="__updateSize" :data="customData.dragCardSize"></XtRadio>
    <ClockStyle @updateClockStyle="updateClockStyle"></ClockStyle>
  </a-drawer> -->

  <ClockFullScreen
    @updateBlur="updateBlur"
    @updateBgZoom="updateBgZoom"
    v-if="isClockFullScreen"
    :imgUrl="backgroundImage.path !== '' ? backgroundImage.path : customData.imgUrl"
    :clock="customData.clockId"
    @exit="isClockFullScreen = false"
    @updateClockStyle="updateClockStyle"
    @updateImgUrl="updateImgUrl"
    :blur="customData.blurs"
    :bgZoom="bgZoom"
    :customData="customData"
  >
  </ClockFullScreen>
</template>

<script>
import mixin from "./hooks/clockMixin.js";
import { mapActions, mapWritableState } from "pinia";
import cardDragHook from "../../card/hooks/cardDragHook";
import cardSizeHook from "../../card/hooks/cardSizeHook";
import {Icon as clockIcon } from '@iconify/vue';
import { cardStore } from "../../../store/card.ts";
// import { clockStore } from "./hooks/clockStore";
import { appStore } from '../../../store';

import Widget from "../../card/Widget.vue";
// import ClockStyle from "./clockState/ClockStyle.vue";
import ClockFullScreen from "./clockState/ClockFullScreen.vue";
import ClockSettingModal from "./components/ClockSettingModal.vue";
import cardDrag from "../../card/hooks/cardDrag.vue";

export default {
  mixins:[mixin,cardDragHook,],
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
  components: {
    Widget,
    // ClockStyle,
    ClockFullScreen,
    cardDrag,
    clockIcon,
    ClockSettingModal
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
            this.$refs.clockSettingRef.openClockModal();
            // this.$refs.homelSlotRef.visible = false;
            // this.settingVisible = true;
          },
        },
      ],
      week: ["周末", "周一", "周二", "周三", "周四", "周五", "周六"],
      isClockFullScreen: false,
      settingVisible: false,
      // isSnow: true,
      isClock5: false,
      isClock5w420: false,
      zoom: "100%",
      zooms: {
        // 无限拉伸是0, 1*1是1 2*2是2
        clock1: [155, 35, 35],
        clock2: [160, 66, 50],
        clock3: [150, 0, 80],
        clock4: [140, 0, 30],
        clock5: [150, 0, 25],
        clock6: [180, 0, 80],
      },
      bgZoom: 0,
      widthHeightObj: {},
    };
  },
  
  computed:{
    ...mapWritableState(appStore,["backgroundImage"]),
    newZoom(){
      const newScale = Math.floor(this.customData.currentZoom)/100;
      // 是否开启秒针
      if(this.customData.enableSecond){
        console.log('开启',((Number(newScale) / 1)));
        return {transform: `scale(${((Number(newScale) / 1))})`,}
      }
      else {
        console.log('关闭',((Number(newScale) / 0.7)));
        return {transform: `scale(${((Number(newScale) / 0.7))})`,}
      }
    }
  },
  mounted() {
    let setData = {};
    if (!this.customData.clockId) { setData.clockId = "clock4";}
    if (!this.customData.imgUrl) {
      setData.imgUrl ="https://p.ananas.chaoxing.com/star3/origin/fa7d6f2c69aae528484d8278575c28ef.jpg";
    }
    if (this.customData.blurs === undefined) { setData.blurs = 3;}
    if (!this.customData.bgZoom) { setData.bgZoom = 0;}
    // 初始化组件背景颜色切换默认值
    if(!this.customData.backgroundFrame){ setData.backgroundFrame = true; }
    // 初始化组件字体样式切换默认值
    if(!this.customData.font){ 
      setData.font =  "font-family: '优设标题黑' !important;";
    }
    // 初始化组件字体颜色切换默认值
    if(!this.customData.fontColor){ setData.fontColor = '#508BFE' }
    // 初始化秒针默认值
    if(!this.customData.enableSecond){ setData.enableSecond = false }
    // 初始化状态
    if(!this.customData.currentStatus) { setData.currentStatus = 'font' }
    // 初始化缩放比
    if(!this.customData.currentZoom){ setData.currentZoom = '100'}
    if (Object.keys(setData).length) { this.updateCustomData(this.customIndex, setData, this.desk); }
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

  watch:{
    // 时钟背景开关是否开启
    "customData.backgroundFrame":{
      handler(newVal){
        if(newVal){
          const showOption = { ...this.options,background:"var(--primary-bg)",noTitle:false, };
          this.options = showOption;
          this.customData.hideFrame = false;
        }
        else {
          const hideOption = { ...this.options,background:"transparent",noTitle:true, };
          this.options = hideOption;
          this.customData.hideFrame = true;
        }
      },
      immediate:true,
      deep:true,
    }
  }
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
    transform: scale(0.65);
    & .ant-row{
      flex-flow: nowrap !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
    & .gutter-box{
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
