<template>
  <Widget :customData="customData" :customIndex="customIndex" :options="options" :desk="desk" :menu-list="menus">
    <template #left-title-icon>
      <div class="icon"
        style="width: 35px;height: 24px;display: flex; justify-content: center;align-items: center;position: absolute;left: 2px;">
        <newIcon icon="akar-icons:sound-on" class="" style="font-size: 20px;"></newIcon>
      </div>
    </template>
    <HorizontalPanel style="min-width: 100%" :navList="audioTitle" v-model:selectType="audioType"  class="mt-4"></HorizontalPanel>

    <div  v-if="audioType.name === 'output'" class="flex flex-col mt-4 xt-text" style="">
      <div class="flex">
        <div class="flex flex-col flex-1 mr-4">
          <div class="flex justify-between my-1">
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
          <div @click.stop="closeVolume" class="flex items-center justify-center px-3 py-3 rounded-full btn-active voice-hover pointer s-item xt-bg-2">
            <Icon icon="yinliang" style="font-size: 2.286em;" v-if="muteShow === true"></Icon>
            <Icon icon="jingyin" style="font-size: 2.286em;" v-else></Icon>
          </div>
        </div>
      </div>
      <span class="mt-2 mb-2" style="font-size: 14px;font-weight: 400;">输出</span>
      <vue-custom-scrollbar  @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height:184px;">
        <template v-for="(item,index) in outputList">
        <div   :class="item.isDefaultForMultimedia ? 's-item xt-bg-2' :''" @click.stop="selectDefaultDevice(item,outputList)" class="flex items-center w-full py-1 rounded-lg btn-active voice-hover pointer " style="padding: 8px 10px 6px 10px;font-size: 14.64px;font-weight: 200;">
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
          <div style="width: 180px;" class="flex items-center justify-center mr-4">
            <a-progress :percent="audioTest" :showInfo="false"/>
          </div>
          <div @click.stop="closeMicrophone" class="flex items-center justify-center px-3 py-3 rounded-full btn-active voice-hover pointer s-item xt-bg-2" style="">
            <Icon icon="mic-on" style="font-size: 2.286em;" v-if="microphoneShow === true"></Icon>
            <Icon icon="mic-off" style="font-size: 2.286em;" v-else></Icon>
          </div>
        </div>
      </div>
      <span class="mt-2 " style="font-size: 14px;font-weight: 400;">输入</span>
      <vue-custom-scrollbar class="mt-2" :settings="settingsScroller" style="height:200px;">
        <template v-for="(item,index) in inputList">
        <div :class="item.isDefaultForMultimedia ? 's-item xt-bg-2' :''" class="flex items-center w-full px-2 py-1 py-2 rounded-lg voice-hover pointer xt-text" @click.stop="selectDefaultDevice(item,inputList)" style=" font-size: 15px;font-weight: 200;color: var(--primary-text) !important;">
          <span class="item-name">
            {{ item.name }}（{{item.deviceName}}）
          </span>
        </div>
        </template>
      </vue-custom-scrollbar>
    </div>
  </Widget>
  <audio id="speakerAudio" src='/sound/gua.mp3'>
    您的浏览器暂不支持音频播放
  </audio>
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
import { appStore } from '../../../store'
import { Icon as newIcon } from '@iconify/vue';
export default {
  name:'Audio',
  components:{
    Template,
    Widget,
    HorizontalPanel,
    newIcon
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
    },

  },
  computed:{
    ...mapWritableState(inspectorStore,['audioTest']),
    ...mapWritableState(appStore,['settings'])
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
  mounted () {
    this.init()
  },
  data(){
    return{
      options: {
        className: 'card',
        title: '音频',
        // icon: 'sound',
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
      menus:[
        {
          icon: 'shezhi1',
          title:'设置',
          fn:()=>{

            this.$router.push({
              name:'status'
            })
          }
        }
      ]
    }
  },
  methods:{
    ...mapActions(inspectorStore,['startListenAudioTest','stopListenerAudioTest']),
    // 选中输入设备
    async init(){
      this.outputList=await listOutputs()
      this.inputList=await listInputs()
      this.defaultOutput = await getDefaultVolume()
      this.defaultMic=await getDefaultMic()
      this.muteShow=!this.defaultOutput.muted
      this.microphoneShow=!this.defaultMic.muted
    },
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
    goStatus(){
      this.$router.push({
        name:'status'
      })
    },
    async gua() {
      if(!this.settings.duck){
        return
      }
      let audioSpeaker = document.getElementById('speakerAudio')
      audioSpeaker.play()
    },
    // 关闭音量逻辑
    closeVolume(){
      this.muteShow = !this.muteShow
      setDefaultVolume({
        volume:this.defaultOutput.volume,
        muted:!this.muteShow
      })
      if(this.muteShow){
        setTimeout(()=>{
          this.gua()
        },800)
      }
    },
    changeVolume(){

      setDefaultVolume({
        volume:this.defaultOutput.volume
      })
      this.gua()
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
  // background: linear-gradient(90deg, rgba(98, 193, 255, 1) 0%, rgba(51, 141, 255, 1) 100%) !important;
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
