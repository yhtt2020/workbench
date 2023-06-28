<template>
   <Widget :menuList="menuList"  :options="options" :customData="customData" :customIndex="customIndex" :desk="desk">
     <div  v-if="!currentSource.id">
       <div @click="visibleSource=true" class="flex flex-col items-center justify-center mt-10 ">
         <span class="mb-3 s-item w-full pointer btn-active voice-hover text-center rounded-lg py-3 "><icon icon="wanggeshitu"></icon> 选择捕获源使用</span>
       </div>
     </div>
     <div v-else class="flex justify-center items-center mx-5 my-8" style="color:var(--primary-text)">
        <div @click="visibleSource=true" style="width: 150px;position: absolute;left: 90px;top: 16px" class="truncate pointer" >
         <a-avatar style="vertical-align: top" shape="square" :size="20" :src="'file://'+currentSource.icon"></a-avatar> {{currentSource.name}}
        </div>
          <div  @click="captureScreen" :class="{disable:!this.settings.imageSavePath}" class="flex justify-center pointer  items-center mr-6 flex-col ml-6" >
              <span class="px-4 voice-hover py-4 btn-active rounded-full mb-3" style="background: var(--secondary-bg);">
                <Icon  icon="camera" style="font-size: 2em;"></Icon>
              </span>
              <span>截屏</span>
          </div>

          <div v-if="!recording" @click="startRecord"  :class="{disable:!this.settings.videoSavePath}" class="flex justify-center pointer items-center mr-6 flex-col">
            <span class="px-4 voice-hover py-4  btn-active rounded-full mb-3" style="background: var(--secondary-bg);">
              <Icon icon="record-circle-line" style="font-size: 2em;"></Icon>
            </span>
            <span>录制</span>
          </div>
       <div v-else @click="stopRecord"  :class="{disable:!this.settings.videoSavePath}" class="flex justify-center pointer items-center mr-6 flex-col">
            <span class="px-4 voice-hover py-4  btn-active rounded-full mb-3" style="background: var(--secondary-bg);">
              <Icon icon="record-circle-line" style="font-size: 2em;color:red"></Icon>
            </span>
         <span>{{ formatSeconds(this.recordedSeconds )||'0秒' }}</span>
       </div>
          <div @click="clickMicMute" class="flex  justify-center pointer items-center mr-6 flex-col">
            <span class="px-4 voice-hover btn-active py-4 rounded-full mb-3" style="background:  var(--secondary-bg);">
              <Icon icon="mic-on" style="font-size: 2em;" v-if="systemMicrophone.muted === false"></Icon>
              <Icon icon="mic-off" style="font-size: 2em;" v-else></Icon>
            </span>
            <span>麦克风</span>
          </div>
      </div>

   </Widget>
  <teleport to="#app">
    <Modal v-if="visibleSource" v-model:visible="visibleSource"  :blurFlag="true">
      <SourceSelector @choosenSource="choosenSource">
      </SourceSelector>
    </Modal>
  </teleport>
  <a-drawer @close="reloadMic"  width="500" title="设置" :bodyStyle="{ overflow: 'hidden' }"  v-model:visible="visibleSettings">
    <CaptureSettings></CaptureSettings>
  </a-drawer>
</template>

<script>
import Widget from '../../card/Widget.vue'
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
const toast = useToast()
export default {
  name:'Capture',
  components:{
    CaptureSettings,
    Template,
    SourceSelector,
    Modal,
    Widget
  },
  props:{
    customIndex: {
      type: Number,
      default: 0
    },
    customData: {
      type: Object,
      default: () => {}
    },
    confirmCCData: {
      type: Function,
      default: () => {}
    },
    desk:{
      type:Object
    },

  },
  data(){
    return{
      visibleSettings:false,
      systemMicrophone:{},
      menuList:[{
        icon:'wanggeshitu',
        title:'更换录制源',
        fn:()=>{
          this.visibleSource=true
        }
      },
        {
        icon:'shezhi',
        title:'设置',
        fn:()=>{
          this.visibleSettings=true
        }
      }],
      options: {
        className: 'card small',
        title: '捕获',
        icon: 'video',
        type: 'games',
      },
      microphoneShow:false,
      muteShow:false,
      visibleSource:false
    }
  },
  computed:{
    ...mapWritableState(captureStore, ['recordedSeconds','sources', 'settings', 'images', 'videos','currentSource','recording']),
  },
  mounted () {
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
    choosenSource(){
      this.visibleSource=false
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
    },
    startRecord(){
      this.startRecording()
    },
    stopRecord(){
      this.stopRecording()
    }
  }

}
</script>

<style lang="scss" scoped>
.voice-hover:hover{
  opacity: 0.5;
}
.disable {
  pointer-events: none;
  opacity: 0.5;
}
</style>
