<template>
  <!-- 音频输出设备选项 -->
  <div class="mt-4">
    <vue-custom-scrollbar :settings="settingsScroller" style="height: 350px;">
       <div v-for="(item,index) in outputList" :class="selectIndex === index ? 'select-active':''"
        @click="selectAudio(item,index)" class="flex pointer items-center justify-center" style="padding: 8px 10px 6px 10px;">
          <span class="item-name" style="font-size: 1.2em; font-weight: 400;">
            {{ item.name }}
          </span>
       </div>
    </vue-custom-scrollbar> 
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
        selectIndex:0
      }
    },
    methods:{
      selectAudio(item,index){
        this.selectIndex = index
        this.$emit('updateOutput',item)
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
.select-active{
  background: rgba(32, 32,32, 1);
  border-radius: 8px;
}
</style>