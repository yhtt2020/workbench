<template>
  <!-- 音频输入设备的选项 -->
  <div class="mt-4 flex flex-col">
    <vue-custom-scrollbar @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height: 300px;">
      <div v-for="(item,index) in inputList" :class="selectIndex === index ? 's-item':''"
        @click="selectAudio(item,index)" class="flex rounded-lg pointer items-center justify-center" style="padding: 7px 10px;">
          <span class="item-name" style="font-size: 14.64px; font-weight: 400;">
            {{ item.name }}
          </span>
       </div>
    </vue-custom-scrollbar>
    <div @click="backInput" class="flex items-center select-active justify-center rounded-lg py-3 my-2 pointer s-item w-full">
      <Icon icon="xiangzuo" style="font-size: 1.429em;"></Icon>
      <span class="text-center" style="font-size: 16px; color: rgba(255,255,255,0.85); font-weight: 400;">返回</span>
    </div>
  </div>
</template>

<script>
export default {
  name:'VoiceInputDetail',
  data(){
    return{
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
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      selectIndex:0,
      defaultItem:{name:'Microphone1（High Definition Audio Device）'},
    }
  },
  methods:{
    selectAudio(item,index){
      this.selectIndex = index
      this.defaultItem = item
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
</style>