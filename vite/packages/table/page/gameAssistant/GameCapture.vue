<template>
  <div class="flex justify-between px-4">
    <div class="s-bg capture-container rounded-lg p-4">
      <div class="flex mb-3">
        <div @click="startScreenshot" class="cp-w cp-orange-active cp-orange flex pointer flex-col rounded-lg items-center justify-center mr-3">
            <div class="cp-orange-2 mb-3 w-20 flex items-center justify-center  rounded-full h-20">
              <div class="rounded-full orange-full flex items-center justify-center cp-lw">
                <Icon icon="camera" style="font-size: 2em;color:rgba(255, 255, 255, 0.8);"></Icon>
              </div>
            </div>
            <div class="cp-text">截取屏幕</div>
        </div>
        <div @click="startRecording" class="cp-w cp-red-active orange-red-1 pointer flex flex-col rounded-lg items-center justify-center mr-3">
          <div class="w-20 h-20 flex orange-red-2  items-center rounded-full justify-center mb-3">
            <div class="rounded-full orange-red-full flex items-center justify-center cp-lw">
              <Icon icon="record-circle-line" style="font-size: 2em;color:rgba(255, 255, 255, 0.8);"></Icon>
            </div>
          </div>
          <div class="cp-text">开始录制</div>
        </div>
        <div @click="startMonitoring" class="cp-w dark-blue-1 cp-blue-active pointer flex flex-col rounded-lg items-center justify-center ">
          <div class="w-20 h-20 flex dark-blue-2  items-center rounded-full justify-center mb-3">
            <div class="rounded-full dark-blue-full flex items-center justify-center cp-lw">
              <AreaChartOutlined style="font-size: 2em;color:rgba(255, 255, 255, 0.8);"></AreaChartOutlined>
            </div>
          </div>
          <div class="cp-text" v-if="isMonitor === false">开启监控</div>
          <div class="cp-text" v-else>关闭监控</div>
        </div>
      </div>
      <vue-custom-scrollbar  @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height: 80vh;"> 
        <div class="flex flex-col mb-3">
          <div class="flex justify-between mb-3">
            <div class="flex items-center justify-center">
              <Icon icon="setting" style="font-size: 1.5em;color:rgba(255, 255, 255, 0.85);"></Icon>
              <span class="record-set ml-1">录制设置</span>
            </div>
            <div class="flex items-center pointer justify-center" @click="openRecordSet">
              <Icon icon="gengduo1" style="font-size: 1.5em;color:rgba(255, 255, 255, 0.6);"></Icon>
            </div> 
          </div>
          <div class="s-item rounded-md p-4">
            <div class="flex items-center mb-5">
              <div class="pointer" @click="closeSound">
                <Icon icon="yinliang" style="font-size: 1.5em;color:rgba(255, 255, 255, 0.85);" v-if="soundShow"></Icon>
                <Icon icon="jingyin" v-else style="font-size: 1.5em;color:rgba(255, 255, 255, 0.85);"></Icon>
              </div>
              <span class="mx-3" style="color:rgba(255, 255, 255, 0.85);">系统声音</span>
              <div style="width:331px;">
                <a-slider v-model:value="systemSound"></a-slider>
              </div>
            </div>
            <div class="flex items-center">
              <div class="pointer" @click="closeMicrophone">
                <Icon icon="mic-on" style="font-size: 1.5em;color:rgba(255, 255, 255, 0.85);" v-if="microphoneShow"></Icon>
                <Icon icon="mic-off" style="font-size: 1.5em;color:rgba(255, 255, 255, 0.85);" v-else></Icon>
              </div>
              <span style="margin: 0 19px;color:rgba(255, 255, 255, 0.85);">麦克风</span>
              <div style="width:331px;">
                <a-slider v-model:value="systemMicrophone"></a-slider>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col">
          <HorizontalCapture :navList="captureType" v-model:selectType="defaultRecordingType" class="mb-4"></HorizontalCapture>
          <template v-if="defaultRecordingType.name === 'recordGame'">
            <div v-if="recordGameData.length === 0">
              <a-empty :image="simpleImage" />
            </div>
            <div class="flex justify-between flex-wrap" v-else>
              <div v-for="(item,index) in recordGameData" class="flex flex-col s-bg rounded-lg mb-4  record-game-item"
               @click="clickRecordGame(item,index)" :class="{'s-active':defaultIndex === index}"
              >
                <img :src="item.url" class="w-full rounded-lg h-full object-cover">
                <span class="px-4 py-3 truncate" style="max-width:207px;">{{ item.name}} </span>
              </div>
            </div> 
          </template>
          <template v-if="defaultRecordingType.name === 'recordFullScreen'">
            <div v-if="recordGameData.length === 0">
              <a-empty :image="simpleImage" />
            </div>
            <div class="flex justify-between flex-wrap" v-else>
              <div v-for="(item,index) in  recordFullScreenData" 
               class="flex flex-col s-bg rounded-lg mb-4  record-game-item"
               @click="clickRecordGame(item,index)" :class="{'s-active':defaultIndex === index}"
              >
                <img :src="item.url" class="w-full rounded-lg h-full object-cover">
                <span class="px-4 py-3 truncate" style="max-width:207px;">{{ item.name}} </span>
              </div>
            </div>
          </template>
          <template v-if="defaultRecordingType.name === 'logger'">
            <div v-if="recordLogger.length === 0">
              <a-empty :image="simpleImage" />
            </div>
            <div class="flex justify-between flex-wrap" v-else>
              <div v-for="(item,index) in  recordLogger" 
               class="flex flex-col s-bg rounded-lg mb-4  record-game-item"
               @click="clickRecordGame(item,index)" :class="{'s-active':defaultIndex === index}"
              >
                <img :src="item.url" class="w-full rounded-lg h-full object-cover">
                <span class="px-4 py-3 truncate" style="max-width:207px;">{{ item.name}} </span>
              </div>
            </div>
          </template>
        </div> 
      </vue-custom-scrollbar>
    </div>
    <div class="w-full ml-3  flex flex-col">
      <div class="s-bg rounded-md mb-3" v-if="isMonitor === true">123</div>
      <div class="s-bg rounded-md">456</div>
    </div>
  </div>
  <a-drawer width="500"  title="设置" :placement="right" v-model:visible="recordSetShow"></a-drawer>

</template>

<script>
import {AreaChartOutlined} from '@ant-design/icons-vue'
import HorizontalCapture from '../../components/HorizontalCaptrue.vue'
export default {
  name:'GameCapture',
  components:{
    AreaChartOutlined,
    HorizontalCapture
  },
  data(){
    return{
      systemSound:10, // 系统声音
      soundShow:false,
      microphoneShow:false,
      recordSetShow:false,
      isMonitor:false,
      systemMicrophone:20, // 麦克风
      captureType:[
        {title:'录游戏',name:'recordGame'},
        {title:'录全屏',name:'recordFullScreen'},
        {title:'录程序',name:'logger'}
      ],
      defaultRecordingType:{title:'录游戏',name:'recordGame'},
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      recordGameData:[
        {url:'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg',name:'Counter-Strike: Global Offensive'},
        {url:'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg',name:'Dota2'},
        {url:'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg',name:'Counter-Strike: Global Offensive'},
        {url:'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg',name:'Dota2'},
      ],
      recordFullScreenData:[
        {url:'/public/img/cpatureone.png',name:'桌面1'},
        {url:'/public/img/cpaturetwo.png',name:'桌面2'},
        {url:'/public/img/cpatureone.png',name:'桌面1'},
        {url:'/public/img/cpaturetwo.png',name:'桌面2'},
      ],
      recordLogger:[
        // {url:'/public/img/test.png',name:'程序1'},
        // {url:'/public/img/test.png',name:'程序2'},
        // {url:'/public/img/test.png',name:'程序3'},
        // {url:'/public/img/test.png',name:'程序4'},
      ],
      defaultIndex:0,
      simpleImage:'/public/img/test/not-data.png',
    }
  },
  methods:{
    // 开始截屏事件
    startScreenshot(){},
    // 开始录制事件
    startRecording(){},
    // 开始监控事件
    startMonitoring(){
      this.isMonitor = !this.isMonitor
    },
    // 关闭系统声音
    closeSound(){
      this.soundShow = !this.soundShow
    },
    // 闭麦事件
    closeMicrophone(){
      this.microphoneShow = !this.microphoneShow
    },
    // 打开录制设置入口
    openRecordSet(){
      this.recordSetShow = true
    },
    clickRecordGame(item,index){
      this.defaultIndex = index
    }

  }
}
</script>

<style lang="scss" scoped>
.capture-container{
  max-width: 512px;
}

.s-active{
  border: 3px solid rgba(80,139,254,1);
}
.s-bg{
  box-shadow: none !important;
}
.cp-w{
  max-width: 150px;
  padding: 13px 35px;
}
.cp-orange{
  background: rgba(250,173,20,0.1);
}
.orange-full{
  background: rgba(250,173,20,1);
}
.cp-orange-2{
  background: rgba(250,173,20,0.2);
}
.cp-lw{
  width: 64px;
  height: 64px;
}
.orange-red-1{
  background: rgba(255,77,79,0.1);
}
.cp-text{
 font-size: 16px;
 color: rgba(255,255,255,0.85);
 font-weight: 500;
}

.orange-red-2{
  background: rgba(255,77,79,0.2);
}
.orange-red-full{
  background: rgba(255,77,79,1);
}
.dark-blue-1{
  background:rgba(80,139,254, 0.1);
}
.dark-blue-2{
  background:rgba(80,139,254, 0.2);
}
.dark-blue-full{
  background:rgba(80,139,254, 1);
}

.cp-orange-active{
  &:active{
    filter: brightness(0.8);
    background: rgba(250,173,20,0.25);
  }
  &:hover{
    background: rgba(250,173,20,0.25);
  }
}
.cp-red-active{
  &:active{
    filter: brightness(0.8);
    background: rgba(255,77,79,0.25);
  }
  &:hover{
    background: rgba(255,77,79,0.25);
  }
}
.cp-blue-active{
  &:active{
    filter: brightness(0.8);
    background:rgba(80,139,254, 0.25);
  }
  &:hover{
    background:rgba(80,139,254, 0.25);
  }
}
.record-set{
  font-size: 16px;
  color: rgba(255,255,255,0.85);
  font-weight: 400;
}

::v-deep .ant-slider-track{
  background: linear-gradient(90deg, rgba(98, 193, 255, 1) 0%, rgba(51, 141, 255, 1) 100%) !important;
}

:deep(.ant-slider-handle){
  background: rgba(255, 255, 255, 0.85) !important;
  border-color: rgba(151, 151, 151, 1) !important;
}
:deep(.ant-slider-rail){
  background: rgba(255, 255, 255, 0.4) !important;
}
:deep(.ps__thumb-y){
  display: none !important;
}
.record-game-item{
  max-width: 234px;
}
</style>