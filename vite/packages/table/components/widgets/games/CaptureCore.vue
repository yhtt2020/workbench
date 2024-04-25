<script lang="ts">
import Modal from '../../Modal.vue'
import SourceSelector from '../../modal/SourceSelector.vue'
import { mapActions, mapWritableState } from 'pinia'
import { captureStore } from '../../../store/capture'
import Template from '../../../../user/pages/Template.vue'
import CaptureSettings from '../../modal/CaptureSettings.vue'
import { getDefaultMic, setMicVolume } from '../../../js/ext/audio/audio'
import SaveImage from '../../game/SaveImage.vue'
import { useToast } from 'vue-toastification'
import { formatSeconds } from '../../../util'
import {defineComponent} from "vue";
const toast = useToast()
export default defineComponent({
  name: "CaptureCore",
  components: {Modal, CaptureSettings, SourceSelector},
  data(){
    return {

      systemMicrophone:{
        muted:false,
      },
      microphoneShow:false,
      muteShow:false,

    }
  },
  computed:{
    ...mapWritableState(captureStore, ['recordedSeconds','sources', 'settings', 'images', 'videos','currentSource','recording']),
  },
  mounted () {
    if (this.$useDev()) return
    this.reloadMic()
  },
  methods:{
    ...mapActions(captureStore, ['screenShoot','startRecording','stopRecording']),
    formatSeconds:formatSeconds,
    reloadMic(){
      getDefaultMic().then(defaultVolume => {
        this.systemMicrophone = {
          volume: defaultVolume.volume.toFixed(0),
          muted: defaultVolume.muted
        }
      })
    },

    closeMicrophone(){
      this.microphoneShow = !this.microphoneShow
    },
    clickMicMute () {
      this.systemMicrophone.muted = !this.systemMicrophone.muted
      setMicVolume({
        muted: this.systemMicrophone.muted
      })
    },
    showToast (src) {
      toast(
        {
          component: SaveImage,
          props: {
            image: src
          },
        }, {
          icon: false,
          closeOnClick: false,
          closeButton: false,
          pauseOnFocusLoss: false,
          pauseOnHover: false
        }
      )
    },
    captureScreen(){
      this.screenShoot((src)=>{
        console.log(src)
        this.showToast(src)
      })
      // 截图 支线任务点

    },
    startRecord(){
      // console.log('object :>> ', object);
      this.startRecording()
      // 录制 支线任务点
    },
    stopRecord(){
      this.stopRecording()
    },
    selectSource(){
      this.$emit('selectSource')
    }
  }
})
</script>

<template>
  <div class="overflow-hidden">
  <div style="min-height: 100px"  v-if="!currentSource.id">
    <div @click="selectSource" class="flex flex-col items-center justify-center " style="margin-top: 30px">
      <span class="w-full py-3 mb-3 text-center rounded-lg s-item pointer my-active btn-active voice-hover "><icon icon="wanggeshitu"></icon> 选择捕获源使用</span>
    </div>
  </div>
  <div v-else class="relative flex items-center justify-center mx-5 my-8 mb-5" style="color:var(--primary-text)">
    <div @click="selectSource" style="width: 200px;position: absolute;left: -10px;top: -30px" class="truncate pointer" >
      <a-avatar style="vertical-align: top" shape="square" :size="20" :src="'file://'+currentSource.icon"></a-avatar> {{currentSource.name}}
    </div>
    <div  @click="captureScreen" :class="{disable:!this.settings.imageSavePath}" class="flex flex-col items-center justify-center ml-6 mr-6 pointer" >
              <span class="px-4 py-4 mb-3 rounded-full voice-hover btn-active" style="background: var(--secondary-bg);">
                <Icon  icon="camera" style="font-size: 2em;"></Icon>
              </span>
      <span>截屏</span>
    </div>

    <div v-if="!recording" @click="startRecord"  :class="{disable:!this.settings.videoSavePath}" class="flex flex-col items-center justify-center mr-6 pointer">
            <span class="px-4 py-4 mb-3 rounded-full voice-hover btn-active" style="background: var(--secondary-bg);">
              <Icon icon="record-circle-line" style="font-size: 2em;"></Icon>
            </span>
      <span>录制</span>
    </div>
    <div v-else @click="stopRecord"  :class="{disable:!this.settings.videoSavePath}" class="flex flex-col items-center justify-center mr-6 pointer">
            <span class="px-4 py-4 mb-3 rounded-full voice-hover btn-active" style="background: var(--secondary-bg);">
              <Icon icon="record-circle-line" style="font-size: 2em;color:red"></Icon>
            </span>
      <span>{{ formatSeconds(this.recordedSeconds )||'0秒' }}</span>
    </div>
    <div @click="clickMicMute" class="flex flex-col items-center justify-center mr-6 pointer">
            <span class="px-4 py-4 mb-3 rounded-full voice-hover btn-active" style="background:  var(--secondary-bg);">
              <Icon icon="mic-on" style="font-size: 2em;" v-if="systemMicrophone.muted === false"></Icon>
              <Icon icon="mic-off" style="font-size: 2em;" v-else></Icon>
            </span>
      <span>麦克风</span>
    </div>


  </div>
</div>


</template>

<style scoped lang="scss">
.my-active{
  background: var(--active-bg) !important;
}
.disable {
  pointer-events: none;
  opacity: 0.5;
}
</style>
