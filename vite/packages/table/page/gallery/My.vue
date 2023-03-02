<template>
  <div class="rotate-center" style="font-size: 2em;margin-bottom: 1em">
    我的收藏
  </div>
  <div>
  </div>
  <div class="pointer" style="position: fixed;right: 2em;top: 2em">
   <div  @click="playAll" style="display: inline-block;margin-right: 1em">
      <span><Icon style="font-size: 2em;vertical-align: top"
                                icon="bofang"></Icon></span><span  style="font-size:1.2em">轮播全部</span>
   </div>
    <div  @click="playActive" style="display: inline-block">
      <span><Icon style="font-size: 2em;vertical-align: top"
                                icon="bofang"></Icon></span><span  style="font-size:1.2em">激活壁纸（{{appData.papers.activePapers.length}}）</span>
    </div>
  </div>
  <div>
    <vue-custom-scrollbar  id="containerWrapper" :settings="settingsScroller" style="height: 80vh">
    <viewer :images="appData.papers.myPapers">
      <a-row :gutter="[20,20]" id="bingImages" style="margin-right: 1em">
        <a-col class="image-wrapper " :span="6" style="">
          <a-avatar    class="image-item pointer"   style="font-size:2em;position: relative;line-height:118px;height: 118px;background: rgba(10,10,10,0.31)">
            <Icon  style="font-size: 1.3em;vertical-align: text-bottom" icon="tianjiawenjianjia"></Icon> 导入
          </a-avatar>
        </a-col>
        <a-col class="image-wrapper " v-for="img in appData.papers.myPapers" :span="6" style="">
          <img @contextmenu.stop="visibleMenu=true"  class="image-item pointer" :src="img.src" style="position: relative">
          <div style="position: absolute;right: 0;top: -10px ;padding: 10px">
            <div @click.stop="addToActive(img)" class="bottom-actions pointer" :style="{background:isInActive(img)?'rgba(255,0,0,0.66)':''}">
            <Icon v-if="!isInActive(img)" icon="tianjia1"></Icon>
            <Icon v-else style="" icon="yiwancheng"></Icon>
          </div>
          </div>
        </a-col>
      </a-row>
    </viewer></vue-custom-scrollbar>
  </div>
  <a-drawer v-model:visible="visibleMenu" placement="bottom">
    <a-row :gutter="20" style="text-align: center">
      <a-col :span="4">
        <div @click="add()" class="btn">
          <Icon style="font-size: 3em" icon="tianjia1"></Icon>
          <div>设置为桌面壁纸</div>
        </div>

      </a-col>
      <a-col>
        <div  @click="add()" class="btn">
          <Icon style="font-size: 3em" icon="xiazai"></Icon>
          <div>下载该壁纸</div>
        </div>
      </a-col>
    </a-row>
  </a-drawer>
</template>

<script>
import {mapWritableState,mapActions} from 'pinia'
import { appStore } from '../../store'
import Spotlight from 'spotlight.js'
import path from 'path'
export default {
  name: 'My',
  data(){
    return{
      visibleMenu:false,
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      livelyPapers:[]
    }
  },
  computed:{
    ...mapWritableState(appStore,['appData'])
  },mounted () {
    console.log(this.appData.papers.myPapers,'我的壁纸')
    this.loadLivelyPapers()
  },
  methods:{
    ...mapActions(appStore,['addToActive']),
    loadLivelyPapers(){
      let fs=require('fs-extra')
      let path=require('path')
      let videos=fs.readdirSync(require('path').join(this.appData.papers.settings.savePath,'lively'))
      this.livelyPapers= videos.map(v=>{
        return {
          src:path.join(this.appData.papers.settings.savePath,'lively',v),
          srcProtocol:'file://'+path.join(this.appData.papers.settings.savePath,'lively',v),
        }
      })
    },
    isInActive(image){
      return this.appData.papers.activePapers.findIndex(img=>{
        return image.src===img.src
      })>-1
    },
    playAll(){
      window.Spotlight.show(this.appData.papers.myPapers, {
          control: 'autofit,page,fullscreen,close,zoom,prev,next',
          play: true,
          autoslide: true,
          infinite: true,
          progress: false,
          title: false
        })
    },
    playActive(){
      console.log('active')
      window.Spotlight.show(this.appData.papers.activePapers, {
        control: 'autofit,page,fullscreen,close,zoom,prev,next',
        play: true,
        autoslide: true,
        infinite: true,
        progress: false,
        title: false
      })
    }
  }
}
</script>

<style scoped>

</style>
