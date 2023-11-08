<template>
  <Widget :customIndex="customIndex" :customData="customData" :options="options" :desk="desk">
    <template #left-title-icon>
      <div class="icon"
        style="width: 35px;height: 24px;display: flex; justify-content: center;align-items: center;position: absolute;left: 2px;">
        <newIcon icon="akar-icons:sound-on" class="" style="font-size: 20px;"></newIcon>
      </div>
    </template>
    <a-tooltip title="更多管理" placement="top">
      <div class="px-2 rounded-full " @click="goStatus" style="position: absolute;top: 16px;right:40px;cursor: pointer;font-size: 12px"><icon icon="tiaoduguanli"></icon> </div>
    </a-tooltip>
     <div  class="flex flex-col mt-5" v-if="inputShow === false && outputShow === false " style="color:var(--primary-text) !important">
      <div class="flex">
        <div class="flex flex-col flex-1 mr-4">
          <div class="flex justify-between my-1" >
            <span style=" font-size: 14px;font-weight: 400;">音量</span>
            <span style=" font-size: 14px;font-weight: 400;">{{ defaultOutput.volume  }}%</span>
          </div>
          <div class="flex items-center justify-between">
            <div style="width:180px;">
              <a-slider v-model:value="defaultOutput.volume" @click.stop  @afterChange="changeVolume()"  :tooltip-visible="false" />
            </div>
          </div>
        </div>
        <div class="flex-1">
          <div @click.stop="clickMute" class="flex items-center justify-center px-3 py-3 rounded-full btn-active voice-hover btn-hover pointer s-item xt-bg-2"  >
            <Icon icon="yinliang" style="font-size: 2.286em;" v-if="muteShow === true"></Icon>
            <Icon icon="jingyin" style="font-size: 2.286em;" v-else></Icon>
          </div>
        </div>
      </div>
      <span class="mt-2" style=" font-size: 14px;font-weight: 400;">输出</span>
      <div @click.stop="selectOutputVoice" class="flex items-center justify-center mt-3 rounded-lg btn-active pointer s-item xt-bg-2" style="padding: 8px 10px;">
        <div class="item-name">{{ defaultOutput.name }}（{{defaultOutput.deviceName}}）</div>
        <Icon icon="xiangxia" style="font-size: 1.5em"></Icon>
      </div>
      <span class="mt-2" style="font-size: 14px;font-weight: 400;">输入检测</span>
      <div class="flex">
        <div style="width: 180px;" class="flex items-center justify-center mr-4">
          <a-progress :percent="audioTest" :showInfo="false"/>
        </div>
        <div @click="closeMicrophone" style="" class="flex items-center justify-center px-3 py-3 rounded-full voice-hover btn-active pointer s-item xt-bg-2">
          <Icon icon="mic-on" style="font-size: 2.286em;" v-if="microphoneShow === true"></Icon>
          <Icon icon="mic-off" style="font-size: 2.286em" v-else></Icon>
        </div>
      </div>
      <span style="font-size: 14px;font-weight: 400;">输入</span>
      <div @click.stop="selectInputVoice"  class="flex items-center justify-center mt-2 rounded-lg btn-active pointer s-item xt-bg-2" style="padding: 8px 10px;">
        <span class="item-name">{{ defaultMic.name }}（{{defaultMic.deviceName}}）</span>
        <Icon icon="xiangxia" style="font-size: 1.5em;"></Icon>
      </div>
    </div>
    <VoiceOutputDetail v-if="outputShow" @updateOutput="receiveOutput"></VoiceOutputDetail>
    <VoiceInputDetail v-if="inputShow" @updateInput="receiveInput"></VoiceInputDetail>
    <audio id="speakerAudio" src='/sound/gua.mp3'>
      您的浏览器暂不支持音频播放
    </audio>
  </Widget>
</template>

<script>
import Widget from '../../card/Widget.vue'
import VoiceInputDetail from './VoiceInputDetail.vue'
import VoiceOutputDetail from './VoiceOutputDetail.vue'
import { mapActions, mapWritableState } from 'pinia'
import { inspectorStore } from '../../../store/inspector'
import audio from '../../../js/common/audio'
import { getDefaultMic, getDefaultVolume, setDefaultVolume, setMicVolume } from '../../../js/ext/audio/audio'
import { appStore } from '../../../store'
import { Icon as newIcon } from '@iconify/vue'
export default {
  name:'Voice',
  components:{
    Widget,
    VoiceOutputDetail,
    VoiceInputDetail,
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
    }
  },
  data(){
    return{
      defaultMic:{},
      defaultOutput:{},
      options: {
        className: 'card',
        title: '音频',
        // icon: 'sound',
        type: 'games',
      },
      audioValue:50,
      outputShow:false,
      inputShow:false,
      outputContent:'',
      inputContent:'',
      muteShow:true,
      microphoneShow:true,
    }
  },
  computed:{
    ...mapWritableState(inspectorStore,['audioTest']),
    ...mapWritableState(appStore,['settings'])
  },
  async mounted () {
    this.defaultOutput = await getDefaultVolume()
    this.defaultMic=await getDefaultMic()
    this.muteShow=!this.defaultOutput.muted
    this.microphoneShow=!this.defaultMic.muted
    this.startListenAudioTest()
    //
    // const device = await navigator.bluetooth.requestDevice({
    //   acceptAllDevices: true
    // })
    // var {hid}=window.$models
    // console.log(hid.devices())
    // hid.devices().forEach(d=>{
    //   console.log(d)
    //   console.log(d.product+":")
    // })
    // console.log(new HID.HID())
  },
  methods:{
    ...mapActions(inspectorStore,['startListenAudioTest','stopListenerAudioTest']),
    selectOutputVoice(){
      this.outputShow = true
    },
    selectInputVoice(){
      this.inputShow = true
    },
    receiveOutput(val){
      this.outputContent = val.name
      this.outputShow = false
    },
    receiveInput(v){
      this.inputContent = v.name
      this.inputShow = false
    },
    async gua() {
      if(!this.settings.duck){
        return
      }
      let audioSpeaker = document.getElementById('speakerAudio')
      audioSpeaker.play()
    },
    clickMute(){
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
    closeMicrophone(){
      this.microphoneShow = !this.microphoneShow
      setMicVolume({muted:!this.microphoneShow})
    },
    changeVolume(){
      setDefaultVolume({
        volume:this.defaultOutput.volume
      })
      this.gua()
    },
    goStatus(){
      this.$router.push({
        name:'status'
      })
    }
  },
  unmounted () {
    this.stopListenerAudioTest()
  },


}
</script>

<style lang="scss" scoped>
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
:deep(.ant-slider-handle){
  background: rgba(255, 255, 255, 0.85) !important;
  border-color: rgba(151, 151, 151, 1) !important;
}
:deep(.ant-slider-rail){
  // background: rgba(255, 255, 255, 0.4) !important;
}
:deep(.ant-progress-inner){
  background-color: rgba(255, 255, 255, 0.4) !important;
}
:deep(.ant-progress-bg){
  height: 9px !important;
}
.voice-hover:hover{
  opacity: 0.8;
}
</style>
