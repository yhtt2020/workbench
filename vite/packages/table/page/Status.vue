<template >
  <div v-if="loaded">
    <div style="margin: 3em;background: #282828;padding:2em;border-radius: 0.5em;width: 52em">

      <a-row>
        <a-col :span="3">
          <div style="cursor: pointer" v-if="!muted" @click="setMuted">
            <Icon icon="#icon-yinliang" style="font-size: 3em"></Icon>
          </div>
          <div style="cursor: pointer" v-else @click="cancelMuted">
            <Icon icon="#icon-jingyin" style="font-size: 3em"></Icon>
          </div>
        </a-col>
        <a-col :span="21">
          <a-slider @after-change="setVol" v-model:value="vol"></a-slider>
        </a-col>
      </a-row>

      <div>

      </div>
    </div>
    <div style="margin: 3em;background: #282828;padding:2em;border-radius: 0.5em;width: 52em">

      <a-row>
        <a-col :span="3">
          <div>
            <Icon icon="#icon-icon_qingtian" style="font-size: 3em;filter: grayscale(100%)"></Icon>
          </div>
        </a-col>
        <a-col :span="21">
          <a-slider @after-change="setBright" v-model:value="bright"></a-slider>
          <p style="margin-top:1em;font-size: 1.2em;padding-left: 0.3em">
            调整屏幕亮度需要用到高权限接口，可能造成安全软件误报。请添加信任。</p>
        </a-col>
      </a-row>


      <div>

      </div>
    </div>
    <div>

    </div>
  </div>

</template>

<script>
const loudness = require('loudness')
const brightness = require('brightness')
export default {
  name: 'Status',
  data () {
    return {
      muted: false,
      vol: 50,
      bright: 50,
      timer: null,
      loaded:false
    }
  },
  async mounted () {
    this.loaded=true
    await this.getVals()

    this.timer = setInterval(() => {
      this.getVals()
    }, 2000)
  },
  beforeUnmount () {
    clearInterval(this.timer)
  },
  methods: {
    async getVals () {
      this.muted = await loudness.getMuted()
      this.vol = await loudness.getVolume()
      this.bright = (await brightness.get()) * 100
    },
    async setVol () {
      await loudness.setVolume(Number(this.vol))
    },
    async setBright () {
      console.log(this.bright)
      await brightness.set((Number(this.bright) / 100))
      console.log((Number(this.bright) / 100).toFixed(1))
    },
    async setMuted () {
      await loudness.setMuted(true)
      this.muted = true
    },
    async cancelMuted () {
      await loudness.setMuted(false)
      this.muted = false
    }
  }
}
</script>

<style scoped>

</style>
