<script lang="ts">
import {defineComponent} from 'vue'
import {mapWritableState} from "pinia";
import {appStore} from "../store";

export default defineComponent({
  name: "DeskBg",
  computed: {
    ...mapWritableState(appStore, [ 'backgroundImage', 'backgroundName','settings','backgroundColor']),
  },
  data(){
    return {
      videoPath: '',
      // 独立壁纸
      independentBg:false
    }
  },
  mounted() {
    // 监听独立壁纸切换
    this.$bus.on('updateIndependentBg',(val)=>{
      if (!val) {
        this.independentBg = false
      }
      this.independentBg = val

    })
  },
  watch: {
    'backgroundImage': {
      handler() {
        if (this.backgroundImage.runpath) {
          // document.body.style.setProperty('--suspensiondBackGround', "rgb(26,26,26,.65)");
          // document.body.style.setProperty('--suspensiondBackGroundBlur', 50 + 'px');
          // document.body.style.setProperty('--gradient', "rgb(26,26,26,.65)");
          // document.body.style.setProperty('--suspensiondBackGroundBoxShadow', "0px 0px 10px 0px rgba(0,0,0,0.5)");

          document.body.style.backgroundImage = ''
          this.videoPath = this.backgroundImage.runpath
          this.$nextTick(() => {
            this.$refs.backgroundVideo.load()
            this.$refs.backgroundVideo.play()

          })
        } else if (this.backgroundImage.path !== '') {
          // document.body.style.setProperty('--suspensiondBackGround', "rgb(26,26,26,.65)");
          // document.body.style.setProperty('--suspensiondBackGroundBlur', 50 + 'px');
          // document.body.style.setProperty('--gradient', "rgb(26,26,26,.65)");
          // document.body.style.setProperty('--suspensiondBackGroundBoxShadow', "0px 0px 10px 0px rgba(0,0,0,0.5)");

        } else {
          // document.body.style.setProperty('--suspensiondBackGround', "rgb(33, 33, 33)");
          // document.body.style.setProperty('--suspensiondBackGroundBlur', 0 + 'px');
          // document.body.style.setProperty('--gradient', "linear-gradient(-33deg,#333333, #212121)");
          // document.body.style.setProperty('--suspensiondBackGroundBoxShadow', "0px");

          document.body.style.background = '#191919'
        }

      },
      deep: true
    },
  }
})
</script>

<template>
  <!-- 独立壁纸 -->
  <template v-if="independentBg">
    <div class="fixed top-0 left-0 right-0 bottom-0 video-container">
      <!-- 纯图片 -->
      <img
        v-if="independentBg.mode === 'img' && independentBg.imgValue !== ''"
        id="wallpaper"
        style="object-fit: cover; width: 100%; height: 100%"
        :src="independentBg.imgValue"
      />
      <!-- 纯色 -->
      <div
        v-if="independentBg.mode === 'color' && independentBg.colorValue !== ''"
        class="w-full h-full"
        :style="{ background: independentBg.colorValue }"
      ></div>
      <!-- 动态 -->
      <video
        v-if="independentBg.mode === 'video' && independentBg.imgValue !== ''"
        class="fullscreen-video"
        playsinline=""
        autoplay=""
        muted=""
        loop=""
        ref="backgroundVideo"
      >
        <source :src="independentBg.imgValue" type="video/mp4" id="bgVid"/>
      </video>
      <div v-else class="w-full h-full"></div>
    </div>
  </template>
  <template v-else>
    <div class="fixed inset-0 video-container " v-if="backgroundImage.runpath">
      <video class="fullscreen-video" playsinline="" autoplay="" muted="" loop="" ref="backgroundVideo">
        <source :src="videoPath" type="video/mp4" id="bgVid">
      </video>
    </div>
    <!-- 壁纸展示位置 -->
    <div v-else-if="backgroundName.name === 'img' &&  backgroundImage.path !== ''"
         class="fixed bg-image inset-0 video-container ">
      <img id="wallpaper" style="object-fit: cover;width: 100%;height: 100%" :src="backgroundImage.path">
    </div>

    <div v-else-if="backgroundName.name === 'color' && backgroundColor.color "
         class="fixed bg-image inset-0 video-container ">
      <div class="w-full h-full " :style="{background:`${backgroundColor.color}`}"></div>
    </div>

    <div v-else>
      <!-- 修改默认壁纸 -->
      <div class="fixed inset-0  none-bg default-bg" :style="{'z-index':-1}">
      </div>
    </div>
    <div class="fixed inset-0 background-img-blur-light" style="z-index: -1"></div>
  </template>


</template>

<style scoped lang="scss">

.default-bg {
  background-size: cover !important;
  background-repeat: no-repeat !important;
  background-position: center !important;

}
</style>
