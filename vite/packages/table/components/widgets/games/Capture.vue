<template>
   <xt-container
    v-model:customSize="customData.customSize"
    :header="header"
    :envLimit="['web']"
    :menuList="menuList"
    :options="options"
    :customData="customData"
    :customIndex="customIndex"
    @titleHover="goCapture"
    @leftClick="goCapture"
    :desk="desk"
    @delete="deleteCard">
     <CaptureCore @selectSource="visibleSource=true"></CaptureCore>
   </xt-container>
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
import CaptureCore from './CaptureCore.vue'
import SourceSelector from '../../modal/SourceSelector.vue'
import CaptureSettings from '../../modal/CaptureSettings.vue'
import Modal from '../../Modal.vue'
export default {
  name:'Capture',
  components:{
    Modal, CaptureSettings, SourceSelector,
    CaptureCore,
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
    desk:{
      type:Object
    },
    openWay:{
      type:String,
      default:'desk'
    }

  },
  emit:['delete'],
  data(){
    return{
      visibleSettings:false,
      visibleSource:false,
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
      header:{
        titleHover:true,
        title:'捕获',
        ifyIcon:'fluent:resize-video-20-regular',
        leftHoverName:'打开应用',
        leftHover:true,
        leftHoverIcon:'fluent:open-16-regular'
      },

    }
  },
  computed:{
    options(){
      return {
        customDel:this.openWay === 'nav' ? true : false
      }
    }
  },
  methods:{
    choosenSource(){
      this.visibleSource=false
    },
    goCapture(){
      this.$router.push({
        name:'GameCapture'
      })
    },
    deleteCard(){
      this.$emit('delete')
    },

  },
  mounted(){
    this.customData.customSize = '2x2'
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
