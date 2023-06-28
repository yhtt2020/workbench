<script lang="ts">
import {defineComponent} from 'vue'
import {getDefaultMic, getDefaultVolume, setDefaultVolume, setMicVolume} from "../../js/ext/audio/audio";
import {mapActions, mapWritableState} from "pinia";
import {captureStore} from "../../store/capture";
import Template from "../../../user/pages/Template.vue";

export default {
  name: "CaptureSettings",
  components: {Template},
  data() {
    return {
      systemSound: {
        volume: 0,
        muted: false
      }, // 系统声音
      systemMicrophone: 20, // 麦克风,
    }
  },
  computed: {
    ...mapWritableState(captureStore, ['sources', 'settings', 'images', 'videos', 'currentSource']),
  },
  mounted() {
    getDefaultVolume().then((defaultVolume) => {
      console.log(defaultVolume, 'defaultVolume')
      this.systemSound = {
        volume: defaultVolume.volume.toFixed(0),
        muted: defaultVolume.muted
      }
    })

    getDefaultMic().then(defaultVolume => {
      this.systemMicrophone = {
        volume: defaultVolume.volume.toFixed(0),
        muted: defaultVolume.muted
      }
    })

  },
  methods: {

    clickMute() {
      this.systemSound.muted = !this.systemSound.muted
      setDefaultVolume({
        muted: this.systemSound.muted
      })
    },
    clickMicMute() {
      this.systemMicrophone.muted = !this.systemMicrophone.muted
      setMicVolume({
        muted: this.systemMicrophone.muted
      })
    },
    changeVolume() {
      setDefaultVolume({
        volume: this.systemSound.volume
      })
    },
    changeMicVolume() {
      setMicVolume({
        volume: this.systemMicrophone.volume
      })
    },
    async setImageSavePath() {
      let savePath = await tsbApi.dialog.showOpenDialog({
        title: '选择目录', message: '请选择截屏保存位置', properties: [
          'openDirectory', 'createDirectory',
        ]
      })
      if (savePath) {
        this.settings.imageSavePath = savePath[0]
      } else {
      }
    },
    async setVideoSavePath() {
      let savePath = await tsbApi.dialog.showOpenDialog({
        title: '选择目录', message: '请选择视频保存位置', properties: [
          'openDirectory', 'createDirectory',
        ]
      })
      if (savePath) {
        this.settings.videoSavePath = savePath[0]
      } else {
      }
    },
  }
}
</script>

<template>
  <div class="flex flex-col scroll-container">
    <div class="flex flex-col rounded-md p-4 mb-3" style="background: var(--secondary-bg);">
      <div class="flex items-center mb-3">
        <div class="pointer" @click="clickMute">
          <Icon icon="yinliang" style="font-size: 1.5em;color:var(--primary-text);"
                v-if="!systemSound.muted"></Icon>
          <Icon icon="jingyin" v-else style="font-size: 1.5em;color:var(--primary-text);"></Icon>
        </div>
        <span class="mx-3" style="color:var(--primary-text);">系统声音</span>
        <div style="width:310px;">
          <a-slider @afterChange="changeVolume" v-model:value="systemSound.volume"></a-slider>
        </div>
      </div>
      <div class="flex items-center">
        <div class="pointer" @click="clickMicMute">
          <Icon icon="mic-on" style="font-size: 1.5em;color:var(--primary-text);"
                v-if="!systemMicrophone.muted"></Icon>
          <Icon icon="mic-off" style="font-size: 1.5em;color:var(--primary-text);" v-else></Icon>
        </div>
        <span style="margin: 0 19px;color:var(--primary-text);">麦克风</span>
        <div style="width:310px;">
          <a-slider @afterChange="changeMicVolume" v-model:value="systemMicrophone.volume"></a-slider>
        </div>
      </div>
    </div>
    <span class="mb-3 fps-t">我的截屏保存地址</span>
    <span @click="setImageSavePath" style="background: var(--secondary-bg);"
          class="text-center mb-3 py-3 s-item rounded-lg">
      <template v-if="settings.imageSavePath">
        {{
          settings.imageSavePath
        }}
      </template>
      <template v-else>
        设置
      </template>
    </span>
    <span class="mb-3 fps-t">我的录制保存地址</span>
    <span @click="setVideoSavePath" style="background: var(--secondary-bg);" class="text-center mb-3 py-3 rounded-lg">
     <template v-if="settings.videoSavePath">
        {{
         settings.videoSavePath
       }}
      </template>
      <template v-else>
        设置
      </template>

    </span>
    <span class="mb-3 fps-t ">视频码率</span>
    <a-select v-model:value="settings.videoBitsPerSecond">
      <a-select-option :value="1.5e6">
        1.5Mbps
      </a-select-option>
      <a-select-option :value="2.5e6">
        2.5Mbps
      </a-select-option>
      <a-select-option :value="5.0e6">
        5.0Mbps
      </a-select-option>
      <a-select-option :value="8.0e6">
        8.0Mbps
      </a-select-option>
      <a-select-option :value="10.0e6">
        10.0Mbps
      </a-select-option>
    </a-select>
  </div>
  <div class="mt-3">
    暂不支持快捷键使用
  </div>
</template>

<style scoped lang="scss">

</style>
