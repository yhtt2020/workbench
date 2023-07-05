<template>
  <Widget :customData="customData" :customIndex="customIndex" :options="options" :desk="desk">
    <HorizontalPanel :navList="audioTitle" v-model:selectType="audioType"  class="mt-4"></HorizontalPanel>
    <div v-if="audioType.name === 'output'" class="mt-4 flex flex-col xt-text" style="">
      <div class="flex">
        <div class="flex-1 flex flex-col mr-4">
          <div class="flex my-1 justify-between">
            <span style=" font-size: 14px;font-weight: 400;">音量</span>
            <span style=" font-size: 14px;font-weight: 400;">{{ defaultOutput.volume }}%</span>
          </div>
          <div class="flex items-center justify-between">
            <div style="width:180px;">
              <a-slider v-model:value="defaultOutput.volume" @afterChange="changeVolume()" :tooltip-visible="false" />
            </div>
          </div>
        </div>
        <div class="flex-1">
          <div @click="closeVolume" class="flex btn-active voice-hover items-center rounded-full pointer justify-center px-3 py-3 s-item xt-bg-2">
            <Icon icon="yinliang" style="font-size: 2.286em;" v-if="muteShow === true"></Icon>
            <Icon icon="jingyin" style="font-size: 2.286em;" v-else></Icon>
          </div>
        </div>
      </div>
      <span class="mt-2 mb-2" style="font-size: 14px;font-weight: 400;">输出</span>
      <vue-custom-scrollbar  @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height:184px;">
        <template v-for="(item,index) in outputList">
        <div   :class="item.isDefaultForMultimedia ? 's-item xt-bg-2' :''" @click="selectDefaultDevice(item,outputList)" class="w-full py-1 flex btn-active voice-hover  items-center rounded-lg  pointer " style="padding: 8px 10px 6px 10px;font-size: 14.64px;font-weight: 200;">
          <span class="item-name">
            {{ item.name }}（{{item.deviceName}}）
          </span>
        </div>
        </template>
      </vue-custom-scrollbar>

    </div>
    <div v-else class="mt-4" style="color: var(--primary-text);">
      <div class="flex flex-col">
        <span style="font-size: 14px;font-weight: 400;">输入检测</span>
        <div class="flex">
          <div style="width: 180px;" class="mr-4 flex items-center justify-center">
            <a-progress :percent="audioTest" :showInfo="false"/>
          </div>
          <div @click="closeMicrophone" class="flex btn-active voice-hover items-center rounded-full pointer justify-center px-3 py-3 s-item xt-bg-2" style="">
            <Icon icon="mic-on" style="font-size: 2.286em;" v-if="microphoneShow === true"></Icon>
            <Icon icon="mic-off" style="font-size: 2.286em;" v-else></Icon>
          </div>
        </div>
      </div>
      <span class="mt-2 " style="font-size: 14px;font-weight: 400;">输入</span>
      <vue-custom-scrollbar class="mt-2" :settings="settingsScroller" style="height:200px;">
        <template v-for="(item,index) in inputList">
        <div :class="item.isDefaultForMultimedia ? 's-item xt-bg-2' :''" class="w-full py-1 voice-hover pointer voice-hover rounded-lg flex items-center  py-2 px-2  xt-text" @click="selectDefaultDevice(item,inputList)" style=" font-size: 15px;font-weight: 200;color: var(--primary-text) !important;">
          <span class="item-name">
            {{ item.name }}（{{item.deviceName}}）
          </span>
        </div>
        </template>
      </vue-custom-scrollbar>
    </div>
  </Widget>
</template>
<script>
import Widget from '../../card/Widget.vue'
import HorizontalPanel from '../../HorizontalPanel.vue';
import audio from '../../../js/common/audio'
import { inspectorStore } from '../../../store/inspector'
import {mapWritableState,mapActions} from 'pinia'
import Template from '../../../../user/pages/Template.vue'
import {
  getDefaultMic,
  getDefaultVolume,
  listInputs, listOutputs, setAsDefault,
  setDefaultVolume,
  setMicVolume
} from '../../../js/ext/audio/audio.ts'
export default {
  name:'Audio',
  components:{
    Template,
    Widget,
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
    desk:{
      type:Object
    }
  },
  computed:{
    ...mapWritableState(inspectorStore,['audioTest'])
  },
  watch:{
    'audioType':{
      handler(newValue,oldValue){
        if(newValue.name==='input'){
         this.startListenAudioTest()
        }
      }
    }
  },
  async mounted () {
    this.outputList=await listOutputs()
    this.inputList=await listInputs()
    this.defaultOutput = await getDefaultVolume()
    this.defaultMic=await getDefaultMic()
    this.muteShow=!this.defaultOutput.muted
    this.microphoneShow=!this.defaultMic.muted
  },
  data(){
    return{
      options: {
        className: 'card',
        title: '音频',
        icon: 'sound',
        type: 'games',
      },
      devices:[],
      defaultOutput:{},
      defaultMic:{},
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
      outputList:[],//name
      inputList:[],
      inputIndex:0,
      outputIndex:0,
      microphoneShow:true,
      muteShow:true,
    }
  },
  methods:{
    ...mapActions(inspectorStore,['startListenAudioTest','stopListenerAudioTest']),
    // 选中输入设备
    selectInputDevice(item,index){
      item.isDefaultForMultimedia=true

    },
    // 选中输出设备
    selectDefaultDevice(item,list){
      list.forEach(li=>{li.isDefaultForMultimedia=false})
      item.isDefaultForMultimedia=true
      setAsDefault(item)
    },
    // 关闭麦克风逻辑
    closeMicrophone(){
      this.microphoneShow = !this.microphoneShow
      setMicVolume({muted:!this.microphoneShow})
    },
    // 关闭音量逻辑
    closeVolume(){
      this.muteShow = !this.muteShow
      setDefaultVolume({
        volume:this.defaultOutput.volume,
        muted:!this.muteShow
      })
    },
    changeVolume(){
      setDefaultVolume({
        volume:this.defaultOutput.volume
      })
    }
  },
  unmounted () {
    this.stopListenerAudioTest()
  }
}
</script>

<style lang="scss" scoped>
.nav-list-container{
  box-shadow: none !important;
  background: rgba(255, 255, 255, 0.2) !important;
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
:deep(.ant-slider-handle){
  background: rgba(255, 255, 255, 0.85) !important;
  border-color: rgba(151, 151, 151, 1) !important;
}
:deep(.ant-slider-rail){
  // background: rgba(255, 255, 255, 0.4) !important;
}
.voice-hover:hover{
  background: rgba(32, 32,32, 1);
  opacity: 0.8;
}

</style>
