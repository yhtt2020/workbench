<template>
  <HomeComponentSlot :customData="customData" :customIndex="customIndex" :options="options">
    <HorizontalPanel :navList="audioTitle" v-model:selectType="audioType"  class="mt-4"></HorizontalPanel>
    <div v-if="audioType.name === 'output'" class="mt-4 flex flex-col">
      <div class="flex flex-col">
         <div class="flex justify-between my-1">
            <span style="color: rgba(255, 255, 255, 0.6); font-size: 14px;font-weight: 400;">音量</span>
            <span style="color: rgba(255, 255, 255, 0.6); font-size: 14px;font-weight: 400;">{{ audioValue  }}%</span>
         </div>
         <div class="flex items-center justify-between">
          <div style="width:180px;">
            <a-slider v-model:value="audioValue" :tooltip-visible="false" />
          </div>
          <div class="flex items-center rounded-full pointer justify-center px-3 py-3" style="background: rgba(32, 32, 32, 1);">
            <Icon icon="maikefeng1" style="font-size: 2.286em;"></Icon>
          </div>
         </div>
      </div>
      <span class="mt-2" style="color: rgba(255, 255, 255, 0.6);font-size: 14px;font-weight: 400;">默认输出</span>
      <vue-custom-scrollbar  @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height:184px;">
        <div v-for="(item,index) in outputList" :class="outputIndex === index ? 'active-index' :''" @click="selectOutputDevice(item,index)" class="w-full flex items-center justify-center pointer" style="padding: 8px 10px 6px 10px;color: rgba(255, 255, 255, 1);font-size: 16px;font-weight: 200;">
          <span class="item-name">
            {{ item.name }}
          </span>
        </div>
      </vue-custom-scrollbar>
     
    </div>
    <div v-else class="mt-4">
      <div class="flex flex-col">
        <span style="color: rgba(255, 255, 255, 0.6); font-size: 14px;font-weight: 400;">输入检测</span>
        <div class="flex">
          <div style="width: 180px;" class="mr-4 flex items-center justify-center">
            <a-progress :percent="10" :showInfo="false"/>
          </div>
          <div class="flex items-center rounded-full pointer justify-center px-3 py-3" style="background: rgba(32, 32, 32, 1);">
            <Icon icon="maikefeng1" style="font-size: 2.286em;"></Icon>
          </div>
        </div>
      </div>
      <span style="color: rgba(255, 255, 255, 0.6); font-size: 14px;font-weight: 400;">默认输入</span>
      <vue-custom-scrollbar :settings="settingsScroller" style="height:200px;">
        <div v-for="(item,index) in inputList" :class="inputIndex === index ? 'active-index' :''" class="w-full pointer flex items-center justify-center my-1" @click="selectInputDevice(item,index)" style="padding: 8px 10px 6px 10px;color: rgba(255, 255, 255, 1);font-size: 16px;font-weight: 200;">
          <span class="item-name">
            {{ item.name }}
          </span>
        </div>
      </vue-custom-scrollbar>
    </div>
  </HomeComponentSlot>
</template>
<script>
import HomeComponentSlot from '../HomeComponentSlot.vue'
import HorizontalPanel from '../../HorizontalPanel.vue';
export default {
  name:'Audio',
  components:{
    HomeComponentSlot,
    HorizontalPanel
  },
  props:{
    customIndex: {
      type: Number,
      default: 0
    },
    customData: {
      type: Object,
      default: () => {}
    },
    confirmCCData: {
      type: Function,
      default: () => {}
    }
  },
  data(){
    return{
      options: {
        className: 'card',
        title: '音频',
        icon: 'sound',
        type: 'games',
      },
      audioTitle:[{title:'输出',name:'output'},{title:'输入',name:'input'}],
      audioType:{title:'输出',name:'output'},
      audioValue:50,
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      outputList:[
        {
          name:'扬声器1（High Definition Audio Device）'
        },
        {
          name:'扬声器2（High Definition Audio Device）'
        },
        {
          name:'扬声器3（High Definition Audio Device）'
        },
        {
          name:'扬声器4（High Definition Audio Device）'
        },
        {
          name:'扬声器5（High Definition Audio Device）'
        },
        {
          name:'扬声器6（High Definition Audio Device）'
        }
      ],
      inputList:[
        {
          name:'Microphone1（High Definition Audio Device）'
        },
        {
          name:'Microphone2（High Definition Audio Device）'
        },
        {
          name:'Microphone3（High Definition Audio Device）'
        },
        {
          name:'Microphone4（High Definition Audio Device）'
        },
        {
          name:'Microphone5（High Definition Audio Device）'
        },
        {
          name:'Microphone6（High Definition Audio Device）'
        },
      ],
      inputIndex:0,
      outputIndex:0,
    }
  },
  methods:{
    // 选中输入设备
    selectInputDevice(item,index){
      this.inputIndex = index
    },
    // 选中输出设备
    selectOutputDevice(item,index){
      this.outputIndex = index
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-list-container{
  box-shadow: none !important;
  background: rgba(255, 255, 255, 0.2) !important;
  border-radius: 8px !important;
}

.nav-list-container ::v-deep .s-item{
  border-radius: 6px !important;
}
::v-deep .ant-slider-track{
  background: linear-gradient(90deg, rgba(98, 193, 255, 1) 0%, rgba(51, 141, 255, 1) 100%) !important;
}
.item-name{
  word-break: normal;
  display: block;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: hidden;
}
.active-index{
  background: rgba(32, 32,32, 1);
  border-radius: 8px;
}
::v-deep .ps__thumb-y{
  display: none !important;
}
</style>