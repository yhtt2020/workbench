<template>
  <HomeComponentSlot :customIndex="customIndex" :customData="customData" :options="options">
    <div class="mt-5 flex flex-col" v-if="inputShow === false && outputShow === false ">
      <div class="flex">
        <div class="flex-1 flex flex-col mr-4">
          <div class="flex my-1 justify-between">
            <span style="color: rgba(255, 255, 255, 0.6); font-size: 14px;font-weight: 400;">音量</span>
            <span style="color: rgba(255, 255, 255, 0.6); font-size: 14px;font-weight: 400;">{{ defaultOutput.volume  }}%</span>
          </div>
          <div class="flex items-center justify-between">
            <div style="width:180px;">
              <a-slider v-model:value="defaultOutput.volume"  @afterChange="changeVolume()"  :tooltip-visible="false" />
            </div>
          </div>
        </div>
        <div class="flex-1">
          <div @click="clickMute" class="flex btn-active items-center voice-hover btn-hover rounded-full pointer justify-center px-3 py-3 s-item" >
            <Icon icon="yinliang" style="font-size: 2.286em;" v-if="muteShow === true"></Icon>
            <Icon icon="jingyin" style="font-size: 2.286em;" v-else></Icon>
          </div>
        </div>
      </div>
      <span class="mt-2" style="color: rgba(255, 255, 255, 0.6); font-size: 14px;font-weight: 400;">输出</span>
      <div @click="selectOutputVoice" class="flex mt-3 btn-active pointer items-center rounded-lg justify-center s-item" style="padding: 8px 10px">
        <div class="item-name">{{ defaultOutput.name }}（{{defaultOutput.deviceName}}）</div>
        <Icon icon="xiangxia" style="font-size: 1.5em;"></Icon>
      </div>
      <span class="mt-2" style="color: rgba(255, 255, 255, 0.5); font-size: 14px;font-weight: 400;">输入检测</span>
      <div class="flex">
        <div style="width: 180px;" class="mr-4 flex items-center justify-center">
          <a-progress :percent="audioTest" :showInfo="false"/>
        </div>
        <div @click="closeMicrophone" class="flex items-center voice-hover btn-active rounded-full pointer justify-center px-3 py-3 s-item">
          <Icon icon="mic-on" style="font-size: 2.286em;" v-if="microphoneShow === true"></Icon>
          <Icon icon="mic-off" style="font-size: 2.286em;" v-else></Icon>
        </div>
      </div>
      <span style="color: rgba(255, 255, 255, 0.6); font-size: 14px;font-weight: 400;">输入</span>
      <div @click="selectInputVoice"  class="flex mt-2 btn-active pointer items-center rounded-lg justify-center s-item" style="padding: 8px 10px">
        <span class="item-name">{{ defaultMic.name }}（{{defaultMic.deviceName}}）</span>
        <Icon icon="xiangxia" style="font-size: 1.5em;"></Icon>
      </div>
    </div>
    <VoiceOutputDetail v-if="outputShow" @updateOutput="receiveOutput"></VoiceOutputDetail>
    <VoiceInputDetail v-if="inputShow" @updateInput="receiveInput"></VoiceInputDetail>
  </HomeComponentSlot>
</template>

<script>
import HomeComponentSlot from '../HomeComponentSlot.vue'
import VoiceInputDetail from './VoiceInputDetail.vue'
import VoiceOutputDetail from './VoiceOutputDetail.vue'
import { mapActions, mapWritableState } from 'pinia'
import { inspectorStore } from '../../../store/inspector'
import audio from '../../../js/common/audio'
import { getDefaultMic, getDefaultVolume, setDefaultVolume, setMicVolume } from '../../../js/ext/audio/audio'
export default {
  name:'Voice',
  components:{
    HomeComponentSlot,
    VoiceOutputDetail,
    VoiceInputDetail
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
      defaultMic:{},
      defaultOutput:{},
      options: {
        className: 'card',
        title: '音频',
        icon: 'sound',
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
    ...mapWritableState(inspectorStore,['audioTest'])
  },
  async mounted () {
    this.defaultOutput = await getDefaultVolume()
    this.defaultMic=await getDefaultMic()
    this.muteShow=!this.defaultOutput.muted
    this.microphoneShow=!this.defaultMic.muted
    this.startListenAudioTest()
  },
  methods:{
    ...mapActions(inspectorStore,['startListenAudioTest','stopListenerAudioTest']),
    selectOutputVoice(){
      this.outputShow = true
      console.log('开始监听')
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
    clickMute(){
      this.muteShow = !this.muteShow
      setDefaultVolume({
        volume:this.defaultOutput.volume,
        muted:!this.muteShow
      })
    },
    closeMicrophone(){
      this.microphoneShow = !this.microphoneShow
      setMicVolume({muted:!this.microphoneShow})
    },
    changeVolume(){
      setDefaultVolume({
        volume:this.defaultOutput.volume
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
  background: linear-gradient(90deg, rgba(98, 193, 255, 1) 0%, rgba(51, 141, 255, 1) 100%) !important;
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
  background: rgba(255, 255, 255, 0.4) !important;
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
