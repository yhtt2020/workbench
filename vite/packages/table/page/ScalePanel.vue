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
      <Icon class="pointer " @click="close" icon="fluent:dismiss-circle-16-filled" width="24" height="24" />
      <!-- <div class="icon-dismiss flex items-center justify-center pointer" @click="close" >
      </div> -->

    </div>
    <div class="xt-text font-16">当前屏幕分辨率和缩放比例可能无法正常使用工作台，建议调整缩放比例。</div>

    <div class="font-16 px-4">
      <div class="xt-text-2 font-14 text-center">推荐使用以下缩放比例</div>
      <div class="flex mt-4 justify-between">
        <div v-for="(item, index) in proportion">
          <xt-button class="" style="border-radius: 10px;background-color: var(--secondary-bg);" @click="setZoomFactor(item.scale, index)" :w="73" :h="40" :type="item.isCheck?'theme':''">{{ item.ratio }}</xt-button>
        </div>
      </div>
      <div class="flex items-center w-full mt-4 justify-between" v-if="proportion[4].isCheck">
        <a-slider 
        @afterChange="setZoomFactor" 
        :min="30" :max="500"
        v-model:value="newZoom"></a-slider>
        <a-input style="width:62px;height: 40px;" class="w-full xt-mask" v-model:value="newZoom" @pressEnter="inputEnter"></a-input>
      </div>
    </div>
    <xt-button class="button-bottom float-right mt-4 mb-4" style="border-radius: 10px;" @click="close" :w="64" :h="40" type="theme">确定</xt-button>
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
          ratio: '100%',
          scale: 100,
          isCheck: false,
        },
        {
          ratio: '125%',
          scale: 125,
          isCheck: false,
        },
        {
          ratio: '150%',
          scale: 150,
          isCheck: false,
        },
        {
          ratio: '200%',
          scale: 200,
          isCheck: false,
        },
        {
          ratio: '自定义',
          scale: 100,
          isCheck: false,
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
      // 记住上次的选择 用于还原功能
      tmpIndex: 0,
      
    }
  },
  async mounted(){
    this.newZoom = await tsbApi.window.getZoomFactor() * 100
    this.oldZoom = this.newZoom
    this.inputZoom = +(this.newZoom).toFixed(0)
    this.getSize()
    this.scaleInit = true
    // 调整缩放比例功能 暂时不需要 隐藏
    // this.getWindowSize()
  },
  components: { 
    Icon,
  },
  computed:{
    ...mapWritableState(appStore, ['settings', 'scaleInit']),
  },
  methods: {
    // 获取当前显示器宽高 根据最长的一段进行判断
    async getWindowSize(){
      var screenWidth = window.screen.width; // 获取显示器的宽度
      var screenHeight = window.screen.height; // 获取显示器的高度
      let min = screenWidth<screenHeight?screenWidth:screenHeight;
      if(min<=1080){
        await tsbApi.window.setZoomFactor(100 / 100)
        this.proportion[0].isCheck = true
      }else if(min<=1440){
        await tsbApi.window.setZoomFactor(125 / 100)
        this.proportion[1].isCheck = true
      }else if(min<=2160){
        await tsbApi.window.setZoomFactor(150 / 100)
        this.proportion[2].isCheck = true
      }else{
        await tsbApi.window.setZoomFactor(200 / 100)
        this.proportion[3].isCheck = true
      }
    },
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

    clearCheck(n){
      this.proportion.forEach(item => {
        item.isCheck = false
      });
    },

    async setZoomFactor(zoom, index) {
      // zoom = +zoom.toFixed(0)
      if (index < this.proportion.length) {
        this.proportion.forEach((item, i)=>{
          if(item.isCheck){
            this.tmpIndex = i
          }
        })
        this.clearCheck()
        this.proportion[index].isCheck = true
      }
      this.inputZoom = zoom
      this.proportion[4].scale = zoom
      this.oldZoom = this.settings.zoomFactor
      await tsbApi.window.setZoomFactor(zoom / 100)
      this.showRestore = true
      this.setTimer()
      setTimeout(() => {
        this.getSize()
      }, 300)
    },
    //  
    close(){
      this.sure()
      this.visibleScale = false
      this.$emit('closeScale')
    },
    // 还原
    async restore() {
      this.oldZoom = this.settings.zoomFactor
      this.newZoom = this.oldZoom
      this.inputZoom = this.oldZoom

      // 还原时 变更按钮
      if (this.proportion[this.tmpIndex]) {
        this.clearCheck()
        this.proportion[this.tmpIndex].isCheck = true
      }
      this.showRestore = false
      this.clearTimer()
      this.timeout = 10

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
      this.clearCheck()
      this.proportion[0].isCheck = true
      await tsbApi.window.setZoomFactor(1)
      setTimeout(() => {
        this.clearTimer()
        this.timeout = 10
        this.settings.zoomFactor = 100
        this.newZoom = 100
        this.proportion[4].scale = 100
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
    // height: 308px;
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

  :deep(.ant-slider){
    margin:  10px 0px !important;
  }

  :deep(.ant-input){
    border-radius: 10px;
  }

  :deep(.ant-slider){
    width: 335px;
  }
</style>
