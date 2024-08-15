<template>
  <xt-modal v-model="clockVisible" v-if="clockVisible" title="时钟设置" :index="zIndex" @close="closeClockModal">
    <div style="height: calc(66vh);width: 500px;">
      <xt-scrollbar  :y="true" style="height: 100%;">
        <div class="flex flex-col xt-bg-2 p-4 rounded-lg mb-4">
          <div class="flex flex-col">
            <div class="flex justify-between mb-2.5">
              <span class="xt-font xt-text font-16">秒针</span>
              <a-switch v-model:checked="customData.enableSecond"/>
            </div>
            <span class="xt-font xt-text-2 font-14">
              显示秒针可能会影响性能。
            </span>
          </div>
          <div class="my-4" >
            <div class="xt-bb mx-auto"></div>
          </div>
          <div class="flex flex-col" v-if="!isFull">
            <div class="flex justify-between mb-2.5">
             <span class="xt-font xt-text font-16">无边框模式</span>
             <a-switch v-model:checked="customData.noBorder"/>
            </div>
            <span class="xt-font xt-text-2 font-14">
             关闭时钟组件的背景框。
            </span>
          </div>
          <div class="my-4" v-if="!isFull">
            <div class="xt-bb mx-auto"></div>
          </div>
          <template v-if="!isFull">
            <div class="flex flex-col">
              <div class="flex items-center justify-start">
                <span class="xt-font xt-text font-16 mr-3">缩放比例</span>
                <xt-button style="width: auto !important;" h="0" @click="restZoom">
                  <div class="flex items-center justify-center">
                    <xt-new-icon icon="fluent:arrow-clockwise-16-regular" size="20"></xt-new-icon>
                  </div>
                </xt-button>
              </div>
              <a-slider v-model:value="customData.currentZoom" :max="maxScale" :min="50" />
            </div>
          </template>
          <template v-if="customData.clockId==='clock7'">
            <div class="my-4" >
              <div class="xt-bb mx-auto"></div>
            </div>
            <div class="flex flex-col">
              <div class="flex justify-between mb-2.5">
                <span class="xt-font xt-text font-16">显示日历</span>
                <a-switch v-model:checked="customData.showCalendar"/>
              </div>
              <span class="xt-font xt-text-2 font-14">
            </span>
            </div>
            <div class="my-4" >
              <div class="xt-bb mx-auto"></div>
            </div>
            <div class="flex flex-col">
              <div class="flex justify-between mb-2.5">
                <span class="xt-font xt-text font-16">显示天气</span>
                <a-switch v-model:checked="customData.showWeather"/>
              </div>
              <span class="xt-font xt-text-2 font-14">
              需要先<a @click="goWeather">设置</a>天气，否则不显示
            </span>
            </div>
          </template>

           <slot name="modelScale" v-else></slot>
        </div>

        <div class="flex flex-col xt-bg-2 p-4 rounded-lg mb-4 " >
          <div class="flex flex-col">
            <span class="xt-text mb-3 font-16">时钟样式</span>
            <xt-option-tab  v-model="customData.currentStatus" :list="clockTabList" circle  style="height: 40px;margin-bottom: 0 !important;" />
          </div>

          <template v-if="customData.currentStatus === 'font'">
            <div class="my-4" >
              <div class="xt-bb mx-auto"></div>
            </div>
            <div class="flex flex-col">
              <span class="xt-text font-16 mb-3 ">字体</span>
              <xt-option-tab :list="clockSelectList" class="xt-bg-t-2" v-model="customData.font" circle  style="height: 40px;"/>
            </div>
            <div class="mb-4" >
              <div class="xt-bb mx-auto"></div>
            </div>
            <div class="flex flex-col">
              <div class="flex items-center mb-3">
                <span class="xt-text font-16 mr-3">文字颜色</span>
                <xt-button style="width: auto !important;" h="0" @click="restClockColor">
                  <div class="flex justify-center items-center">
                    <xt-new-icon icon="fluent:arrow-clockwise-16-regular" size="20"></xt-new-icon>
                  </div>
                </xt-button>
              </div>
              <xt-option-color :isLinear="false" v-model:color="customData.fontColor" :colorList="colorList" class="pl-2"></xt-option-color>
            </div>
            <div class="mb-4" >
              <div class="xt-bb mx-auto"></div>
            </div>
            <div class="clock-box no-drag rounded-lg pointer xt-bg-t-2" @click="updateClock('clock4')">
              <clock4 :clockFont="customData.font" :customData="customData" :noBg="false"></clock4>
            </div>
          </template>

          <template v-else>
            <ClockStyle @updateClockStyle="updateClock"/>
          </template>
        </div>
      </xt-scrollbar>
    </div>
  </xt-modal>
</template>

<script>
import { clockTabList,clockSelectList } from '../hooks/clockList';
import mixin from "../hooks/clockMixin.js";
import { localCache } from '../../../../js/axios/serverCache';
import { communityAuth,communityMember } from "../../../../apps/communityDesk/hooks/deskCreateMethod";
import { saveData } from "../../../../save/saveData";


import ClockStyle from '../clockState/ClockStyle.vue';

export default{
  mixins: [mixin],
  components:{
    ClockStyle,
  },
  inject:['_data'],
  props:{
    customData:{ type:Object,default:()=>{} },
    desk:{type:Object,default:()=>{}},
    customIndex:{ type:Number,default:()=>{} },
    zIndex:{  type:String,  default:'1000'},
    isFull:{  type:Boolean, default:false, }
  },
  mounted(){
  },


  data(){
    return{
      clockTabList:clockTabList,
      clockSelectList:clockSelectList,
      clockVisible:false,
      colorList:{
       color1: '#FFFFFF',
       color2: '#000000',
       color3: '#508BFE',
       color4: '#815BD0',
       color5: '#C8BF55',
       color6: '#DE5D5D',
       color7: '#808080',
       color8: '#43CADE',
       color9: '#57BF60',
       color10: '#DE5DB3',
      }
    }
  },

  computed:{
    // 缩放滑块阈值
    maxScale(){
      return 200
      const width = this.customData.customSize.split("x")[0];
      const height = this.customData.customSize.split("x")[1];
      let max = width < height ? width : height;
      if((max-2) < 2){
        return 110
      }
      else if((max-2) < 4){
        return 130
      }
      else{
        return 140
      }
    }
  },

  methods:{
    goWeather(){
      this.$router.push({name:'weather'})
    },
    openClockModal(){
      this.clockVisible = true;
    },
    updateClock(e){
     this.$emit('updateClockStyle',e)
    },
    // 重置时钟文本颜色
    restClockColor(){
      this.customData.fontColor = "#FFFFFF";
    },
    // 重置缩放
    restZoom(){
      this.$emit("restZoom")
    },

    // 关闭时钟组件设置弹窗
    closeClockModal(){
      this.clockVisible = false;
      if(communityAuth(this.desk?.communityNo)){
        const target = {
          customIndex:this.customIndex,
          desk:this.desk
        }
        saveData(this.customData,"desk",target);
        this.$bus.emit("updateSync");
      }
    }
  },

  watch:{
    "customData.currentStatus":{
      handler(newV){
       if(newV === 'font'){
        this.updateClock('clock4');
       }
       else {
        // console.log('更新',localCache.get('clockName'));
        this.updateClock(localCache.get('clockName'));
       }
      },
      immediate:false,
    },
    "customData.currentZoom":{
      handler(newV){
        this.customData.currentZoom = newV;
      },
      immediate:true,
    }
  }
}

</script>

<style lang="scss" scoped>
:deep(.clock4) {
  // transform: scale(0.65);
  & .ant-row{
    flex-flow: wrap !important;
    margin-left: -8px !important;
    margin-right: -8px !important;
  }
  & .gutter-box{
    padding: 8px !important;
    margin: 8px 0 !important;
  }
  /**
   :deep(.ant-row){
    margin: 0 !important;
    flex-flow: nowrap !important;
  }
  **/
}
</style>
