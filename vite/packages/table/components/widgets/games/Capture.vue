<template>
   <Widget :options="options" :customData="customData" :customIndex="customIndex" :desk="desk">
      <div class="flex justify-center items-center mx-5 my-8">
          <div class="flex justify-center pointer  items-center mr-6 flex-col ml-6">
              <span class="px-4 voice-hover py-4 btn-active rounded-full mb-3" style="background: rgba(32, 32, 32, 1);">
                <Icon  icon="camera" style="font-size: 2em;"></Icon>
              </span>
              <span>截屏</span>
          </div>
          <div class="flex justify-center pointer items-center mr-6 flex-col">
            <span class="px-4 voice-hover py-4  btn-active rounded-full mb-3" style="background: rgba(32, 32, 32, 1);">
              <Icon icon="record-circle-line" style="font-size: 2em;"></Icon>
            </span>
            <span>录制</span>
          </div>
          <div @click="closeMicrophone" class="flex  justify-center pointer items-center mr-6 flex-col">
            <span class="px-4 voice-hover btn-active py-4 rounded-full mb-3" style="background: rgba(32, 32, 32, 1);">
              <Icon icon="mic-on" style="font-size: 2em;" v-if="microphoneShow === true"></Icon>
              <Icon icon="mic-off" style="font-size: 2em;" v-else></Icon>
            </span>
            <span>麦克风</span>
          </div>
      </div>
   </Widget>
</template>

<script>
import Widget from '../../card/Widget.vue'
export default {
  name:'Capture',
  components:{
    Widget
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
    },
    desk:{
      type:Object
    }
  },
  data(){
    return{
      options: {
        className: 'card small',
        title: '捕获',
        icon: 'video',
        type: 'games',
      },
      microphoneShow:false,
      muteShow:false,
    }
  },
  methods:{
    closeMicrophone(){
      this.microphoneShow = !this.microphoneShow
    }
  }

}
</script>

<style lang="scss" scoped>
.voice-hover:hover{
  opacity: 0.5;
}
</style>
