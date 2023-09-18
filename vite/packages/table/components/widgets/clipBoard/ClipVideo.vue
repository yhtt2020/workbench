<template>
  <div class="rounded-md w-full video-body" style="overflow: hidden">
    <!-- 剪切板视频组件 -->
     <div class="rounded-lg video-col" ref="clipVideo"></div>
  </div>
</template>

<script>
import Player from 'xgplayer/dist/simple_player'
export default {
  props:{
      videoUrl:{
        type:String,
      },
      playerProps:{
        type:Object,
      }
  },

  mounted(){
    this.loadXgPlayer()
  },
  methods:{
    // 初始化西瓜视频播放器
    loadXgPlayer(){
      const url = this.videoUrl
      this.$nextTick(()=>{
        // console.log(this.playerProps,'播放参数')
        // if(window.$xgplayerClipboard){
        //   window.$xgplayerClipboard.destroy()
        // }
        window.$xgplayerClipboard = new Player({
          el:this.$refs.clipVideo,
          url: url,
          fitVideoSize: 'fixWidth',
          width:'302',
          height:'300',
          loop: true,
          // fluid: true,
          videoInit: true,
          controlsList: ['nofullscreen'],
          ...this.playerProps
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>

  .video-body{
    // border: 1px solid #fff;
    // height: 127px;
    width: 266px !important;
  }
  .video-col{
    width: 266px;
    height: 127px !important;
  }
</style>
