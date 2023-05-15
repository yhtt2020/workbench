<template>
  <!-- 音频输出设备选项 -->
  <div class="mt-4 flex flex-col">
    <vue-custom-scrollbar @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height: 300px;">
       <div v-for="(item,index) in outputList" :class="selectIndex === index ? 's-item':''"
        @click="selectAudio(item,index)" class="flex pointer rounded-lg items-center justify-center " style="padding: 7px  10px;">
          <span class="item-name" style="font-size: 14.64px; font-weight: 400;">
            {{ item.name }}
          </span>
       </div>
    </vue-custom-scrollbar> 
    <div @click="backOutput" class="flex items-center select-active justify-center rounded-lg py-3 my-2 pointer s-item w-full">
      <Icon icon="xiangzuo" style="font-size: 1.429em;"></Icon>
      <span class="text-center" style="font-size: 16px; color: rgba(255,255,255,0.85); font-weight: 400;">返回</span>
    </div>
  </div>
</template>

<script>
  export default {
    name:'VoiceOutputDetail',
    data(){
      return{
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
         },
         {
          name:'扬声器7（High Definition Audio Device）'
         },
         {
          name:'扬声器8（High Definition Audio Device）'
         }
        ],
        settingsScroller: {
         useBothWheelAxes: true,
         swipeEasing: true,
         suppressScrollY: false,
         suppressScrollX: true,
         wheelPropagation: true
        },
        selectIndex:0,
        defaultItem:{ name:'扬声器1（High Definition Audio Device）'},
      }
    },
    methods:{
      selectAudio(item,index){
        this.selectIndex = index
        this.defaultItem = item
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
</style>