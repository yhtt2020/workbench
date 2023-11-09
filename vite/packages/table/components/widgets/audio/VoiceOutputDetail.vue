<template>
  <!-- 音频输出设备选项 -->
  <div class="mt-4 flex flex-col">
    <vue-custom-scrollbar @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height: 300px;">
      <template v-for="(item,index) in outputList">
        <div  :class="item.isDefaultForMultimedia ? 's-item xt-bg-2':''"
             @click="selectAudio(item,outputList)" class="flex pointer rounded-lg btn-active voice-item-hover  items-center " style="padding: 7px  10px;">
          <span class="item-name" style="font-size: 14.64px; font-weight: 400;">
            {{ item.name }}（{{item.deviceName}}）
          </span>
        </div>
      </template>
    </vue-custom-scrollbar>
    <div @click="backOutput" style="background: var(--primary-bg);color: var(--primary-text);" class="flex items-center voice-item-hover select-active justify-center rounded-lg py-3 my-2 pointer s-item w-full xt-bg-2">
      <Icon icon="xiangzuo" style="font-size: 1.429em;"></Icon>
      <span class="text-center" style="font-size: 16px; font-weight: 400;">返回</span>
    </div>
  </div>
</template>

<script>
  import audio from '../../../js/common/audio'
  import { listOutputs, setAsDefault } from '../../../js/ext/audio/audio'

  export default {
    name:'VoiceOutputDetail',
    data(){
      return{
        outputList:[],
        settingsScroller: {
         useBothWheelAxes: true,
         swipeEasing: true,
         suppressScrollY: false,
         suppressScrollX: true,
         wheelPropagation: true
        },
        selectIndex:0,
        defaultItem:{},
      }
    },
    async mounted () {
      this.outputList = await listOutputs()
      // audio.getDevices(devices => {
      //   this.outputList = devices.outputs
      //   this.defaultItem = this.outputList.find(li => {
      //     return li.deviceId === 'default'
      //   })
      // })
    },
    methods:{
      selectAudio(item,list){
        list.forEach(li=>{li.isDefaultForMultimedia=false})
        item.isDefaultForMultimedia=true
        setAsDefault(item)
      },
      backOutput(){
        this.$emit('updateOutput',this.defaultItem)
      }
    }
  }
</script>

<style lang="scss" scoped>
.item-name{
  word-break: normal;
  display: block;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: hidden;
}
.select-active:active{
  filter: brightness(0.8);
  background:rgba(42, 42, 42, 0.25);
}
::v-deep .ps__thumb-y{
  display: none !important;
}
.voice-item-hover:hover{
  background:rgba(42, 42, 42, 0.8);
}
</style>
