<template>
   <xt-container 
    @titleHover="enterCapture"
    v-model:customSize="customData.customSize"
    :header="header"
    :envLimit="['web']" 
    :menuList="menuList"  
    :options="options" 
    :customData="customData" 
    :customIndex="customIndex" 
    :desk="desk"
    @delete="deleteCard">
      <CaptureCore @selectSource="visibleSource=true"></CaptureCore>
    <div class="flex flex-col items-center justify-center">
      <span :class="{disable:!this.settings.imageSavePath}" @click="showImages" class="w-full py-3 mb-3 text-center rounded-lg s-item pointer btn-active voice-hover">我的截屏({{ images.length }})</span>
      <span :class="{disable:!this.settings.videoSavePath}" @click="showVideos" class="w-full py-3 mb-3 text-center rounded-lg s-item pointer btn-active voice-hover">我的录制({{ videos.length }})</span>
      <span class="w-full py-3 mb-2 text-center rounded-lg s-item pointer btn-active voice-hover" @click="visibleSettings=true">快捷键设置</span>
      <span class="w-full py-3 mb-3 text-center rounded-lg s-item pointer btn-active voice-hover" @click="visibleSettings=true">捕获设置</span>
    </div>
  </xt-container>
  <teleport to="#app">
    <Modal v-if="visibleSource" v-model:visible="visibleSource" :blurFlag="true">
      <SourceSelector @choosenSource="choosenSource">
      </SourceSelector>
    </Modal>
  </teleport>
  <a-drawer @close="reloadMic" width="500" title="设置" :bodyStyle="{ overflow: 'hidden' }"
            v-model:visible="visibleSettings">
    <CaptureSettings></CaptureSettings>
  </a-drawer>
</template>

<script>
import Widget from '../../card/Widget.vue'
import CaptureCore from './CaptureCore.vue'
import SourceSelector from '../../modal/SourceSelector.vue'
import CaptureSettings from '../../modal/CaptureSettings.vue'
import Modal from '../../Modal.vue'
import { captureStore } from '../../../store/capture'
import { mapActions,mapState } from 'pinia'
import {Icon as  newIcon } from '@iconify/vue'
export default {
  name: 'CaptureNewCard',
  components: {
    Modal, CaptureSettings, SourceSelector,
    CaptureCore,
    Widget,
    newIcon
  },
  props: {
    customIndex: {
      type: Number,
      default: 0
    },
    customData: {
      type: Object,
      default: () => {}
    },
    desk: {
      type: Object
    },
    openWay: {
      type: String,
      default: 'desk'
    }
  },
  data () {
    return {
      visibleSettings: false,
      visibleSource: false,
      menuList: [{
        icon: 'wanggeshitu',
        title: '更换录制源',
        fn: () => {
          this.visibleSource = true
        }
      }, {
        icon: 'shezhi',
        title: '设置',
        fn: () => {
          this.visibleSettings = true
        }
      }],
      captureNewShow: false,
      screenShotAddress: 'C:\PROGRAM FILES (X86)\CLIP', // 用于接收截屏获取的地址
      shortcutKey: 'CTRL + WIN + G',
      recordKey: 'CTRL + WIN + V',
      microphoneKey: 'CTRL + WIN + J',
      microphoneShow: false,
      header:{
        title:'捕获',
        ifyIcon:'fluent:resize-video-20-regular',
        titleHover:true,
        titleHoverName:'打开应用',
      },
      customSize:'2x4'
    }
  },
  mounted () {
    if (this.$useEnv()) return
    this.reloadAll()
    this.customData.customSize = '2x4'
  },
  computed:{
    ...mapState(captureStore,['images','videos','settings']),
    options(){
      return {
        customDel:this.openWay === 'nav' ? true : false
      }
    }
  },
  emits:['delete'],
  methods: {
    ...mapActions(captureStore,['reloadAll']),
    deleteCard(){
      this.$emit('delete')
    },
    closeMicrophone () {
      this.microphoneShow = !this.microphoneShow
    },
    choosenSource(){
      this.visibleSource=false
    },
    openDir(dir){
      require('electron').shell.openPath(dir)
    },
    showImages(){
      this.openDir(this.settings.imageSavePath)
    },
    showVideos(){
      this.openDir(this.settings.videoSavePath)
    },
    enterCapture(){
      this.$router.push('GameCapture')
    },
  }
}
</script>

<style scoped>
.shortcut-key {
  width: 270px;
  padding: 12px 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 400;
}

.replace-key {
  padding: 13px 12px;
}

.voice-hover:hover {
  opacity: 0.5;
}
.disable {
  pointer-events: none;
  opacity: 0.5;
}
</style>
