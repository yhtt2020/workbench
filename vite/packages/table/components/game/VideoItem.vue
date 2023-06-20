<template>
  <div>
    <div ref="clipVideo"></div>
  </div>
</template>

<script>
import Player from 'xgplayer/dist/simple_player'
export default {
  props:{
    videoUrl:{
      type:String,
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
        window.$xgplayer = new Player({
          el:this.$refs.clipVideo,
          url: url,
          fitVideoSize: 'fixWidth',
          width:'302',
          height:'240',
          loop: true,
          videoInit: true,
          controls:false,
          controlsList: ['nofullscreen'],
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
