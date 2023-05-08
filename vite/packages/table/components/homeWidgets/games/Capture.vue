<template>
   <HomeComponentSlot :options="options" :customData="customData" :customIndex="customIndex">
       <div class="flex justify-center items-center mx-5 my-8">
          <div class="flex justify-center pointer items-center mr-6 flex-col ml-6">
              <span class="px-4 py-4 rounded-full mb-3" style="background: rgba(32, 32, 32, 1);">
                <Icon  icon="camera" style="font-size: 2em;"></Icon>
              </span>
              <span>截屏</span>
          </div>
          <div class="flex justify-center pointer items-center mr-6 flex-col">
            <span class="px-4 py-4 rounded-full mb-3" style="background: rgba(32, 32, 32, 1);">
              <Icon icon="record-circle-line" style="font-size: 2em;"></Icon>
            </span>
            <span>录制</span>
          </div>
          <div class="flex justify-center pointer items-center mr-6 flex-col">
            <span class="px-4 py-4 rounded-full mb-3" style="background: rgba(32, 32, 32, 1);">
              <Icon icon="maikefeng1" style="font-size: 2em;"></Icon>
            </span>
            <span>麦克风</span>
          </div>
       </div>
   </HomeComponentSlot>
</template>

<script>
import HomeComponentSlot from '../HomeComponentSlot.vue'
export default {
  name:'Capture',
  components:{
    HomeComponentSlot
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
        className: 'card small',
        title: '捕获',
        icon: 'video',
        type: 'games',
      },
    }
  }

}
</script>

<style lang="scss" scoped>

</style>