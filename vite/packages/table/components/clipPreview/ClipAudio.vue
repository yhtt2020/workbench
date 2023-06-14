<template>
  <div>
     <div ref="audioRef"></div>
  </div>
</template>

<script>
// import Player from 'xgplayer/dist/simple_player'
// import Music from 'xgplayer-music';
export default {
  props:{
    aUrl:{
      type:String
    }
  },
  mounted(){
    this.loadAudio()
  },
  methods:{
    loadAudio(){
      // const url = this.aUrl
      // this.$nextTick(()=>{
      //   window.$xgplayer = new Player({
      //     // el:this.$refs.audioRef,
      //     // url:url,
      //     // music:true,
      //     // width: '302',
      //     // height: '148'
      //   })
      // })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>