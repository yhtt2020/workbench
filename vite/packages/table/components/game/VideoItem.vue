<template>
  <div>
    <div ref="clipVideo"></div>
  </div>
</template>

<script>
import Player from 'xgplayer/dist/simple_player'
const defaultOptions={
  fitVideoSize: 'fixWidth',
  width:'302',
  height:'240',
  loop: true,
  videoInit: true,
  controls:false,
  lang:'zh-cn',
  controlsList: ['nofullscreen'],
}
export default {
  props:{
    url:{
      type:String,
    },
    options:{
      default:{}
    }
  },

  mounted(){
    this.loadXgPlayer()
  },
  methods:{
    // 初始化西瓜视频播放器
    loadXgPlayer(){
      const url = this.url
      this.$nextTick(()=>{
        window.$xgplayer = new Player({
          el:this.$refs.clipVideo,
          url: url,
          ...defaultOptions,
          ...this.options
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
