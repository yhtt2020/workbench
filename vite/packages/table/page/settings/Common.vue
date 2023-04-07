<template>
  <div v-if="showRestore" class="no-drag" style="z-index:9999;position:fixed;left: 1em;top: 1em;background: #333;border-radius:3px;padding: 8px 14px 8px 14px;box-shadow: 0 0 4px rgba(0,0,0,0.76)">
    当前窗口分辨率：{{currentWidth}} * {{currentHeight}}
    <a-button @click="restore" type="primary" class="ml-3">还原</a-button></div>
  <div class="line-title  ">界面缩放</div>
  <div class="line">
    当前缩放比例：<a-input-number @change="setZoomFactor" v-model:value="settings.zoomFactor"></a-input-number>%<br>
  </div>
  <div class="line">

    当前分辨率：<span :class="{'unfit':fitWidth.status!==0}" ><Icon icon="kuandu"/>宽 {{ currentWidth }} <template v-if="fitWidth.status!==0">（<Icon icon="tishi-xianxing"/>

             <span v-if="fitWidth.status===-1">低</span><span v-if="fitWidth.status===1">高</span>于推荐值）</template></span>
    <Icon icon="guanbi1"/>


    <span :class="{'unfit':fitHeight.status!==0}" ><Icon icon="gaodu"/>
            高 {{ currentHeight }}  <template v-if="fitHeight.status!==0">（<Icon icon="tishi-xianxing"/>

                <span v-if="fitHeight.status===-1">低</span><span v-if="fitHeight.status===1">高</span>于推荐值{{fitHeight.suggest}}）</template></span>

    <a-slider @change="setZoomFactor" :min="50" :max="500" v-model:value="settings.zoomFactor"></a-slider>
  </div>
</template>

<script>
import {mapWritableState} from 'pinia'
import { appStore } from '../../store'
export default {
  name: 'Common',
  data(){
    return {
      timer:null,
      showRestore:false,
      currentWidth:'-',
      currentHeight:'-',
    }
  },
  async mounted () {
    this.settings.zoomFactor = await tsbApi.window.getZoomFactor() * 100
    this.getSize()
  },
  methods:{
    async restore(){
      await tsbApi.window.setZoomFactor(1)
      setTimeout(()=>{
        this.settings.zoomFactor=100
        this.getSize()
      },300)
    },
    setTimer(){
      if(this.timer){
        clearTimeout(this.timer)
        this.timer=null
      }
      if(!this.timer){
        this.timer=setTimeout(()=>{
          this.showRestore=false
        },5000)
      }
    },
    getSize(){
      this.currentWidth=document.body.offsetWidth
      this.currentHeight=document.body.offsetHeight
    },
    async setZoomFactor () {
      await tsbApi.window.setZoomFactor(+this.settings.zoomFactor/100)
      this.showRestore=true
      this.setTimer()
      setTimeout(()=> {
        this.getSize()
      },300)
      this.showRestore=true
    },
  },
  computed:{

    ...mapWritableState(appStore,['settings']),
    fitWidth(){
      const width=Number(this.currentWidth)
      if(width<800){
        return {
          status:-1,//适合
          text:'过小',
          suggest:800
        }

      }else if(width>2000){
        return {
          status:1,//适合
          text:'过大',
          suggest:2000
        }
      }else{
        return {
          status:0,//适合
          text:'适合'
        }
      }
    },
    fitHeight(){
      const height=Number(this.currentHeight)
      if(height<480){
        return {
          status:-1,//适合
          text:'过小',
          suggest:480
        }

      }else if(height>1500){
        return {
          status:1,//适合
          text:'过大',
          suggest:1500
        }
      }else{
        return {
          status:0,//适合
          text:'适合'
        }
      }
    }
  }
}
</script>

<style scoped>
.unfit{
  color:orangered
}
</style>
