<template>
  <!-- 确认框 -->
  <div v-if="showRestore" class="no-drag"
    style="z-index:9999;position:fixed;right: 1em;top: 1em;background: #333;border-radius:3px;padding: 8px 14px 8px 14px;box-shadow: 0 0 4px rgba(0,0,0,0.76);">
    <div class="mb-3">当前窗口分辨率：{{ currentWidth }} * {{ currentHeight }}，将于{{ timeout }}秒后还原</div>
    <a-button @click="restore" class="ml-3">还原</a-button>
    <a-button @click="reset" class="ml-3">重置</a-button>
    <a-button @click="sure" type="primary" class="ml-3">确认</a-button>
  </div>


  <div class="fixed modal-float xt-modal rounded-lg px-4" style="">
    <div style="height:52px" class="flex justify-between items-center">
      <div class="flex items-center">
        <Icon icon="fluent-emoji-flat:desktop-computer" width="24" height="24" />
        <span class="ml-3">屏幕缩放建议</span>
      </div>
      <div class="icon-dismiss flex items-center justify-center pointer" @click="close" >
        <Icon color="var(--main-bg)" icon="fluent:dismiss-16-regular" width="12" height="12" />
      </div>

    </div>
    <div class="xt-text font-16">当前屏幕分辨率和缩放比例可能无法正常使用工作台，建议调整缩放比例。</div>

    <div class="font-16 px-10">
      <div class="xt-text-2 font-14 text-center">推荐使用以下缩放比例</div>
      <div class="flex justify-center mt-3" v-for="item in proportion">
        <div class="xt-text xt-bg-2 rounded-lg pointer" style="padding:9px 28px;" @click="setZoomFactor(item.scale)">原生分辨率：{{item.ratio}}， 使用 {{ item.scale }}% 缩放</div>
      </div>
      <div class="xt-text-2 font-14 text-center mt-4">自定义设置</div>
      <div class="flex items-center justify-between xt-text mt-2">
        <span>缩放比例（输入后回车确认）：</span>
        <!-- class="h-10 rounded-lg text-center" -->
        <a-input style="width:100px;height: 40px;" class="w-full xt-mask" v-model:value="inputZoom" @pressEnter="inputEnter"></a-input>
        <span>%</span>
      </div>
      <div class="xt-text mt-2">分辨率：宽 1920 x 高 1080</div>
      <a-slider class="mt-1" 
      @afterChange="setZoomFactor" 
      :min="30" :max="500" 
      v-model:value="newZoom"></a-slider>
    </div>


  </div>

</template>

<script> 
import { Icon } from '@iconify/vue';
import { appStore } from '../store'
import { mapWritableState } from 'pinia'

export default {
  name: 'ScalePanel',
  data() {
    return {
      proportion:[
        {
          ratio: '1920x1080',
          scale: 125,
        },
        {
          ratio: '2560x1440',
          scale: 150,
        },
        {
          ratio: '3840x2160',
          scale: 200,
        },
      ],
      showRestore: false,
      currentWidth: '-',
      currentHeight: '-',
      inputZoom: 100,
      newZoom: 100,
      oldZoom: 100,
      timeout: 10,
      timer: null,
      
    }
  },
  async mounted(){
    this.newZoom = await tsbApi.window.getZoomFactor() * 100
    this.oldZoom = this.newZoom
    this.inputZoom = +(this.newZoom).toFixed(0)
    this.getSize()
    this.scaleInit = true
  },
  components: { 
    Icon,
  },
  computed:{
    ...mapWritableState(appStore, ['settings', 'scaleInit']),
  },
  methods: {
    inputEnter() {
      if (!this.inputZoom) {
        this.inputZoom = 30
      }
      this.newZoom = this.inputZoom
      this.setZoomFactor(this.inputZoom)
    },
    getSize() {
      this.currentWidth = document.body.offsetWidth
      this.currentHeight = document.body.offsetHeight
    },
    async setZoomFactor(zoom) {
      // zoom = +zoom.toFixed(0)
      this.inputZoom = zoom
      this.oldZoom = this.settings.zoomFactor
      await tsbApi.window.setZoomFactor(zoom / 100)
      this.showRestore = true
      this.setTimer()
      setTimeout(() => {
        this.getSize()
      }, 300)
      // this.showRestore = true

    },
    //  
    close(){
      this.visibleScale = false
      this.$emit('closeScale')
    },
    // 还原
    async restore() {
      this.oldZoom = this.settings.zoomFactor
      this.newZoom = this.oldZoom
      this.inputZoom = this.oldZoom
      await tsbApi.window.setZoomFactor(this.settings.zoomFactor / 100)
      setTimeout(() => {
        this.getSize()
      }, 300)
    },
    // 确认
    sure() {
      this.clearTimer()
      this.settings.zoomFactor = this.inputZoom
      this.oldZoom = this.settings.zoomFactor
      this.newZoom = this.settings.zoomFactor
      this.timeout = 10
      this.showRestore = false
    },
    // 重置
    async reset() {
      this.showRestore = false
      await tsbApi.window.setZoomFactor(1)
      setTimeout(() => {
        this.clearTimer()
        this.timeout = 10
        this.settings.zoomFactor = 100
        this.newZoom = 100
        this.oldZoom = 100
        this.inputZoom = 100
        this.getSize()
      }, 300)
    },
    setTimer() {
      if (this.timer) {
        this.clearTimer()
      }
      if (!this.timer) {
        this.timeout = 10
        this.timer = setInterval(() => {
          this.timeout--
          if (this.timeout === 0) {
            this.restore()
            this.clearTimer()
            this.showRestore = false
          }
        }, 1000)
      }
    },
    clearTimer() {
      clearInterval(this.timer)
      this.timer = null
      this.timeout = 10
    },
  }
}
</script>

<style scoped lang="scss">
  .modal-float{
    width: 480px;
    height: 484px;
    // background:red;
    z-index: 1000;
    top: 59px;
    right: 12px;
    border: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.03);
    box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.1);
    box-shadow: 0px 0px 40px 0px rgba(0,0,0,0.2);
  }

  .icon-dismiss{
    height: 21px;
    width: 21px;
    border-radius: 50%;
    background-color: var(--secondary-text);
  }
</style>
