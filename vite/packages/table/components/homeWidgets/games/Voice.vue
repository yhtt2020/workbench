<template>
  <HomeComponentSlot :customIndex="customIndex" :customData="customData" :options="options">
    <div class="mt-5 flex flex-col" v-if="inputShow === false && outputShow === false ">
      <div class="flex">
        <div class="flex-1 flex flex-col mr-4">
          <div class="flex my-1 justify-between">
            <span style="color: rgba(255, 255, 255, 0.6); font-size: 14px;font-weight: 400;">音量</span>
            <span style="color: rgba(255, 255, 255, 0.6); font-size: 14px;font-weight: 400;">{{ audioValue  }}%</span>
          </div> 
          <div class="flex items-center justify-between">
            <div style="width:180px;">
              <a-slider v-model:value="audioValue" :tooltip-visible="false" />
            </div>
          </div> 
        </div>
        <div class="flex-1">
          <div class="flex items-center rounded-full pointer justify-center px-3 py-3" style="background: rgba(32, 32, 32, 1);">
            <Icon icon="sound" style="font-size: 2.286em;"></Icon>
          </div>
        </div>
      </div>
      <span style="color: rgba(255, 255, 255, 0.6); font-size: 14px;font-weight: 400;">默认输出</span>
      <div @click="selectOutputVoice" class="flex mt-3 pointer items-center rounded-lg justify-center " style="background: rgba(32, 32, 32, 1);padding: 8px 10px">
        <div class="item-name">{{ outputContent }}</div>
        <Icon icon="xiangxia" style="font-size: 1.5em;"></Icon>
      </div>
      <span class="mt-1" style="color: rgba(255, 255, 255, 0.5); font-size: 14px;font-weight: 400;">输入检测</span>
      <div class="flex">
        <div style="width: 180px;" class="mr-4 flex items-center justify-center">
          <a-progress :percent="10" :showInfo="false"/>
        </div>
        <div class="flex items-center rounded-full pointer justify-center px-3 py-3" style="background: rgba(32, 32, 32, 1);">
          <Icon icon="maikefeng1" style="font-size: 2.286em;"></Icon>
        </div>
      </div>
      <span style="color: rgba(255, 255, 255, 0.6); font-size: 14px;font-weight: 400;">默认输入</span>
      <div @click="selectInputVoice"  class="flex mt-3 pointer items-center rounded-lg justify-center " style="background: rgba(32, 32, 32, 1);padding: 8px 10px">
        <span class="item-name">{{ inputContent }}</span>
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
      options: {
        className: 'card',
        title: '音频',
        icon: 'sound',
        type: 'games',
      },
      audioValue:50,
      outputShow:false,
      inputShow:false,
      outputContent:'扬声器1（High Definition Audio Device）',
      inputContent:'Microphone1（High Definition Audio Device）'
    }
  },
  methods:{
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
    }
  }
  
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
</style>