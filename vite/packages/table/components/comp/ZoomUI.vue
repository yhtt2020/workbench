<template>
  <div v-if="showRestore" class="no-drag"
    style="z-index:9999;position:fixed;left: 1em;top: 1em;background: #333;border-radius:3px;padding: 8px 14px 8px 14px;box-shadow: 0 0 4px rgba(0,0,0,0.76);">
    <div class="mb-3">当前窗口分辨率：{{ currentWidth }} * {{ currentHeight }}，将于{{ timeout }}秒后还原</div>
    <a-button @click="restore" class="ml-3">还原</a-button>
    <a-button @click="reset" class="ml-3">重置</a-button>
    <a-button @click="sure" type="primary" class="ml-3">确认</a-button>

  </div>

  <div class="line" >
    缩放比例（输入后回车确认）：
    <!-- 后期可删 -->
    <a-input-number style="color: var(--primary-text);" :min="30" :max="500" @pressEnter="inputEnter"
      v-model:value="inputZoom"></a-input-number>
    %<br>
  </div>
  <div class="line">

    分辨率：<span :class="{ 'unfit': fitWidth.status !== 0 }">
      <Icon icon="kuandu" />宽 {{ currentWidth }} <template v-if="fitWidth.status !== 0">（
        <Icon icon="tishi-xianxing" />

        <span v-if="fitWidth.status === -1">低</span><span v-if="fitWidth.status === 1">高</span>于推荐值）
      </template>
    </span>
    <Icon icon="guanbi1" />


    <span :class="{ 'unfit': fitHeight.status !== 0 }">
      <Icon icon="gaodu" />
      高 {{ currentHeight }} <template v-if="fitHeight.status !== 0">（
        <Icon icon="tishi-xianxing" />

        <span v-if="fitHeight.status === -1">低</span><span v-if="fitHeight.status === 1">高</span>于推荐值{{ fitHeight.suggest
        }}）
      </template>
    </span>
<div>还原分辨率快捷键（ctrl + alt + shift + r）</div>
    <a-slider @afterChange="setZoomFactor" :min="30" :max="500" v-model:value="newZoom"></a-slider>
  </div>
</template>

<script>
import { mapWritableState } from 'pinia'
import { appStore } from '../../store'

export default {
  name: 'ZoomUI',
  data() {
    return {
      timer: null,
      inputZoom: 100,
      showRestore: false,
      currentWidth: '-',
      currentHeight: '-',
      newZoom: 100,
      oldZoom: 100,
      timeout: 10,
    }
  },
  async mounted() {
    this.newZoom = await tsbApi.window.getZoomFactor() * 100
    this.oldZoom = this.newZoom
    this.inputZoom = +(this.newZoom).toFixed(0)

    this.getSize()

    this.$bus.on('resetWindow',()=>{
console.log('启动 :>> ', );
this.inputZoom =100
    })
  },
  methods: {
    inputEnter() {
      if (!this.inputZoom) {
        this.inputZoom = 30
      }
      this.newZoom = this.inputZoom
      this.setZoomFactor(this.inputZoom)
    },
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
    async restore() {

      this.oldZoom = this.settings.zoomFactor
      this.newZoom = this.oldZoom
      this.inputZoom = this.oldZoom
      await tsbApi.window.setZoomFactor(+this.settings.zoomFactor / 100)
      setTimeout(() => {
        this.getSize()
      }, 300)
    },
    sure() {
      this.clearTimer()
      this.settings.zoomFactor = this.newZoom
      this.oldZoom = this.settings.zoomFactor
      this.newZoom = this.settings.zoomFactor
      this.timeout = 10
      this.showRestore = false
    },
    clearTimer() {
      clearInterval(this.timer)
      this.timer = null
      this.timeout = 10
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
    getSize() {
      this.currentWidth = document.body.offsetWidth
      this.currentHeight = document.body.offsetHeight
    },
    async setZoomFactor(zoom = this.newZoom) {
      zoom = +zoom.toFixed(0)
      this.inputZoom = zoom
      this.oldZoom = this.settings.zoomFactor
      await tsbApi.window.setZoomFactor(+zoom / 100)
      this.showRestore = true
      this.setTimer()
      setTimeout(() => {
        this.getSize()
      }, 300)
      this.showRestore = true
    },
  },
  computed: {

    ...mapWritableState(appStore, ['settings']),
    fitWidth() {
      const width = Number(this.currentWidth)
      if (width < 800) {
        return {
          status: -1,//适合
          text: '过小',
          suggest: 800
        }

      } else if (width > 2000) {
        return {
          status: 1,//适合
          text: '过大',
          suggest: 2000
        }
      } else {
        return {
          status: 0,//适合
          text: '适合'
        }
      }
    },
    fitHeight() {
      const height = Number(this.currentHeight)
      if (height < 480) {
        return {
          status: -1,//适合
          text: '过小',
          suggest: 480
        }

      } else if (height > 1500) {
        return {
          status: 1,//适合
          text: '过大',
          suggest: 1500
        }
      } else {
        return {
          status: 0,//适合
          text: '适合'
        }
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
