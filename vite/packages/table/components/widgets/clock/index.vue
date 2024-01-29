<template>
 <xt-container :customIndex="customIndex" :customData="customData" :desk="desk" 
  :defaultData="defaultClockData" :menuList="menuList" v-model:customSize="customData.customSize"
  :header="header" :options="option"  @leftClick="fullScreen" @resize="resize"
 >
  <div class="box no-drag" @click="fullScreen">
    <div style="width: 100%;height: 100%;" class="flex items-center justify-center" :style="newZoom">
      <component :is="customData.clockId"  :noBg="true" :customData="customData"
      :isSnow="customData.enableSecond" :hideDate="false" :clockFont="customData.font"
      :style="{zoom:customZoom}"
      ></component>
    </div>
  </div>

 </xt-container>

 <ClockSettingModal  ref="clockSettingRef" :customIndex="customIndex" 
  :desk="desk" :customData="customData" @updateClockStyle="updateClockStyle" :isFull="false"
  @restZoom="restZoom"
 />


 <ClockFullScreen  v-if="isClockFullScreen"  :customData="customData"  :clock="customData.clockId"
  :imgUrl="backgroundImage.path !== '' ? backgroundImage.path : customData.imgUrl"
  @exit="isClockFullScreen = false" 
 />

</template>

<script>
import mixin from "./hooks/clockMixin.js";
import { mapActions, mapWritableState } from "pinia";
import { defaultClockData } from "../../../apps/folder/src/components/options";
import { cardStore } from "../../../store/card";
import { appStore } from '../../../store';

import Resize from "../../../apps/folder/src/components/Resize.vue";
import ClockSettingModal from "./components/ClockSettingModal.vue";
import ClockFullScreen from "./clockState/ClockFullScreen.vue";

// import cardDragHook from "../../card/hooks/cardDragHook";
// import cardSizeHook from "../../card/hooks/cardSizeHook";

export default {
 // cardSizeHook  cardDragHook
 mixins: [mixin,],
 components:{
  Resize,ClockSettingModal,ClockFullScreen,
 },
 props:{
  customIndex: { type: Number, default: 0,},
  customData: { type: Object,default: () => {},},
  desk: { type: Object, },
  
 },

 data(){
  return{
   menuList: [
    { 
     icon: "shezhi1",title: "设置",
     fn: () => {
      this.$refs.clockSettingRef.openClockModal();
     },
    },
   ],
   key: Date.now(),
   week: ["周末", "周一", "周二", "周三", "周四", "周五", "周六"],
   defaultClockData:defaultClockData,
   isClockFullScreen:false,
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

  }
 },

 computed:{
  ...mapWritableState(appStore,["backgroundImage"]),
  // 组件头部
  header(){
   const headerOption = {
    title:this.customData.backgroundFrame ? this.customData.name : "",
    ifyIcon: this.customData.backgroundFrame ? "fluent:clock-12-regular" : "",
    leftHover: true,
    leftHoverName:"进入全屏",
    leftHoverIcon: "fluent:open-16-regular",
    rightIcon:[],
   }
   return headerOption;
  },

  // 配置数据
  option(){
   const clockOption = {
    shadow:!this.customData.backgroundFrame,
    bg:!this.customData.backgroundFrame ? "transparent" : "",
    resize: true,
   }
   return clockOption;
  },

  // 拖拽缩放
  customZoom(){
    let width = Number(this.customData.customSize.split("x")[0]);
    let height = Number(this.customData.customSize.split("x")[1]);
    let min = width < height ? width:height;
    let minProp;
    if(this.customData.enableSecond){
      minProp = ((1.5 - 0.5) + (Number(min)-2) * 0.5) ;
      this.customData.zoom = minProp;
      return minProp;
    }
    else {
      minProp = (1.5 + (Number(min)-2) * 0.7) ;
      this.customData.zoom = minProp;
      return minProp;
    }
  },

  // // 设置滑块缩放
  // newZoom(){
  //   const w = this.customData.customSize.split("x")[0];
  //   const h = this.customData.customSize.split("x")[1];
  //   const min = w < h ? w:h;
  //   console.log("this.customData.currentZoom",min);
  //   if(min <= 2 || h<=2){
  //     const minZoom = ((100  / min) * 0.4 / 10) - 1;
  //     console.log("minZoom",minZoom);
      
  //   }

  //   // return {
  //   //   zoom:this.customData.currentZoom / 100,
  //   // }
  //   // const newScale = Math.floor(this.customData.currentZoom)/100;
  //   // if(this.customData.enableSecond){
  //   //   const trueZoom = ((Number(newScale) / 1));
  //   //   return {zoom:trueZoom};
  //   // }
  //   // else {
  //   //   const falseZoom = (Number(newScale) / 0.7);
  //   //   return{ zoom:falseZoom};
  //   // }
  // },

 },

 mounted(){},

 methods:{
  ...mapActions(cardStore, ["updateCustomData"]),
  // 更换时钟组件
  updateClockStyle(e){
   this.updateCustomData(this.customIndex,{ clockId:e },this.desk);
  },

  // 时组件全屏
  fullScreen(){ 
    this.secondary =!this.secondary;
    this.isClockFullScreen = true; 
  },

  // 卡片组件缩放处理
  resize(data) {
    this.customData.customSize = data;
  },
  
  restZoom(){
    this.customData.currentZoom = 100;
  }

 },

 watch:{
  "customData.customZoom":{
    handler(){},

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