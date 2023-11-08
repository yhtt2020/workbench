<template>
  <!-- 音频输入设备的选项 -->
  <div class="mt-4 flex flex-col">
    <vue-custom-scrollbar @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height: 300px;">
      <template v-for="(item,index) in inputList" >
        <div  :class="item.isDefaultForMultimedia ? 's-item xt-bg-2':''"
             @click="selectAudio(item,inputList)" class="flex rounded-lg voice-item-hover  pointer items-center  " style="padding: 7px 10px;">
          <span class="item-name" style="font-size: 14.64px; font-weight: 400;">
            {{ item.name }}（{{item.deviceName}}）
          </span>
        </div>
      </template>
    </vue-custom-scrollbar>
    <div @click="backInput" class="flex items-center select-active voice-item-hover justify-center rounded-lg py-3 my-2 pointer s-item w-full xt-bg-2 xt-text">
      <Icon icon="xiangzuo" style="font-size: 1.429em;"></Icon>
      <span class="text-center" style="font-size: 16px;  font-weight: 400;">返回</span>
    </div>
  </div>
</template>

<script>
import { listInputs, setAsDefault } from '../../../js/ext/audio/audio'

export default {
  name:'VoiceInputDetail',
  data(){
    return{
      inputList:[],
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
    this.inputList = await listInputs()
  },
  methods:{
    selectAudio(item,list){
      list.forEach(li=>{li.isDefaultForMultimedia=false})
      item.isDefaultForMultimedia=true
      setAsDefault(item)
    },
    backInput(){
      this.$emit('updateInput',this.defaultItem)
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
