<template>
 <a-drawer v-model:visible="bottomVisible" placement="bottom" :height="200" style="z-index:1010;">
  <a-row :gutter="20" style="text-align: center">
   <a-col :span="3">
    <xt-button h="93" class="btn" @click="setDesktopPaper">
      <div class="flex items-center justify-center flex-col ">
       <!-- <Icon style="font-size: 3em" icon="tianjia1"></Icon> -->
       <xt-new-icon icon="mingcute:windows-line"></xt-new-icon>
       <span class="font-14 font-400 xt-font xt-text">设置桌面壁纸</span>
      </div>
    </xt-button>
   </a-col>

   <a-col :span="3">
    <xt-button h="93" class="btn" @click="download">
     <div class="flex items-center justify-center flex-col ">
      <!-- <Icon style="font-size: 3em" icon="xiazai"></Icon> -->
      <xt-new-icon icon="fluent:arrow-download-16-regular"></xt-new-icon>
      <span  class="font-14 font-400 xt-font xt-text">下载壁纸</span>
     </div>
    </xt-button>
   </a-col>

   <a-col :span="3" v-if="!isDel">
    <xt-button h="93" class="btn" @click="deletePaper">
     <div class="flex items-center justify-center flex-col ">
      <!-- <Icon icon="guanbi2" style="font-size: 3em"></Icon> -->
      <xt-new-icon icon="fluent:delete-16-regular"></xt-new-icon>
      <span  class="font-14 font-400 xt-font xt-text">删除该壁纸</span>
     </div>
    </xt-button>
   </a-col>

   <a-col :span="4">
    <xt-button h="93" class="btn relative" @click="setAppPaper">
     <div class="flex items-center justify-center flex-col">
      <!-- <Icon icon="tianjia1" style="font-size: 3em"></Icon> -->
      <xt-new-icon icon="fluent:desktop-16-regular"></xt-new-icon>
      <span  class="font-14 font-400 xt-font xt-text">设为工作台背景</span>
     </div>
     <GradeSmallTip powerType="mainWallpaper"></GradeSmallTip>
    </xt-button>
   </a-col>
  </a-row>
 </a-drawer>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia';
import { paperStore } from '../../../../store/paper';
import { appStore } from '../../../../store';
import { fileImageExtension } from '../../libs/utils';
import _ from 'lodash-es';
import { message, Modal } from 'ant-design-vue'

import GradeSmallTip from '../../../../components/GradeSmallTip.vue';

const fs = window.$models.fs
const path = require('path')

export default {
 props:['isDel','currentPaper'],

 components:{ GradeSmallTip },

 data(){
  return{
   bottomVisible:false,
   // currentPaper: null,//当前壁纸，显示菜单用
  }
 },

 computed:{
  ...mapWritableState(paperStore,['settings','activePapers','myPapers']),
 },

 methods:{
  ...mapActions(appStore,['setBackgroundImage']),
  // 开启底部抽屉菜单
  openBottomDrawer(){this.bottomVisible = true;  },

  // 设置工作台背景和桌面壁纸
  setAppPaper(){
    if(this.currentPaper !== null){
      // // 1 清除样式
      // const value = cache.get("style")
      // document.documentElement.classList.remove(value);
      // cache.del("background")
      // // 2 判断白天黑夜
      // if (this.styles) {
      //   document.documentElement.classList.add("light-model");
      //   cache.set("style","light-model")
      // } else {
      //   document.documentElement.classList.add('dark-model');
      //   cache.set("style","dark-model")
      // }
      message.info('正在为您设置背景');
      if (this.currentPaper.srcProtocol){
        this.setBackgroundImage({path: '',  runpath: `file://${this.currentPaper.src}`});
      }
      else {
        if (!this.currentPaper.path) { this.currentPaper.path = this.currentPaper.src }
        else { this.setBackgroundImage(this.currentPaper) }
      }
      this.bottomVisible = false;
    }
  },
  setDesktopPaper(){
    if(this.currentPaper !== null){
      Modal.confirm({
        content: '确定将此壁纸设置为系统桌面壁纸？注意，此处设置不是工作台的壁纸。',
        okText: '设置桌面壁纸',
        onOk:()=>{
          message.info('正在为您下载并设桌面壁纸')
          tsbApi.system.setPaper(this.currentPaper.path)
          this.visibleMenu = false
        }
      })
    }
  },

  // 壁纸下载
  download(){
    if(this.settings.savePath === ''){
      Modal.confirm({
        centered:true,
        style:{'z-index':999999},
        content: '您尚未设置壁纸保存目录，请设置目录，设置目录后下载将自动开始。',
        onOk: async () =>{ await  this.queryStart(); }
      });
    }
    else {
      if(this.currentPaper !== null){
        // console.log('测试::>>',this.currentPaper.path)
        this.doStartDownload(this.currentPaper.path)
      }
    }
  },
  doStartDownload(item){
    message.info('开始下载壁纸')
    const name = this.currentPaper.path.split('&')[1].slice(3)
    // item.percent = 0
    tsbApi.download.start({
      url: item,
      savePath: this.settings.savePath + '/static/' + name,
      // updated: (args) => {
      //   // item.done = 1
      //   // item.percent = (args.downloadInfo.receivedBytes / args.downloadInfo.totalBytes * 100).toFixed(0)
      //   //https://www.electronjs.org/zh/docs/latest/api/download-item#%E4%BA%8B%E4%BB%B6%E5%90%8D-updated
      // },
      done: (args) => {
          // item.percent = 100
          // item.done = 1
          message.success('壁纸下载完成')
      },
      willDownload: (args) => {},
    })
    this.visibleMenu = false
  },
  async queryStart (){
    let savePath = await tsbApi.dialog.showOpenDialog({
      title: '选择目录', message: '请选择下载壁纸的目录',
      properties: [ 'openDirectory', 'createDirectory',]
    })
    if (savePath) {
      this.settings.savePath = savePath[0]
      this.doStartDownload(this.currentItem)
    } 
  },

  // 壁纸删除
  deletePaper(){
    if(this.currentPaper !== null){
      const imageExtensions = ['jpg', 'jpeg', 'gif', 'bmp', 'png']
      if (fileImageExtension(this.currentPaper)) {
        this.activePapers.filter(img => {
          if (img.path === this.currentPaper.path) {
            this.activePapers.splice(this.currentPaper.path, 1)
          }
        })
        fs.removeSync(path.join(this.currentPaper.src))
        if (this.myPapers.indexOf(this.currentPaper) !== -1) {
          this.myPapers.splice(this.myPapers.indexOf(this.currentPaper), 1)
        }
      } 
      else {
        const findIndex = this.activePapers.findIndex(img => {
          if (img.src === this.currentPaper.src)
            return true
        })
        this.activePapers.splice(findIndex, 1)
        if (this.currentPaper.src.split('//')[0] === 'file:' && imageExtensions.indexOf(this.currentPaper.src.split('.')[1]) !== -1) {
          fs.removeSync(path.join(this.currentPaper.src.split('//')[1]))
          if (this.myPapers.indexOf(this.currentPaper) !== -1) {
            this.myPapers.splice(this.myPapers.indexOf(this.currentPaper), 1)
          }
        } else {
          if (this.myPapers.indexOf(this.currentPaper) !== -1) {
            this.myPapers.splice(this.myPapers.indexOf(this.currentPaper), 1)
          }
        }
      }
      this.bottomVisible = false;
    }
  },

 },
}
</script>

<style lang="scss" scoped>

</style>