<template>
  <vue-custom-scrollbar id="containerWrapper" :settings="settingsScroller" class="grow shrink" style="height: 100%;">
   <viewer :images="myPaperList" :options="options" class="px-2.5">
    <a-row :gutter="[20, 20]" id="bingImages">
     <a-col class="image-wrapper" v-for="img in myPaperList" :span="6" >
      <xt-mix-menu :menus="myMenus" fn="callBack" @mounted="this.myCurrentID = img" >
        <img :src="fileImageExtension(img) ? img.path : img.src" :data-source="img.path" :alt="img.resolution"   class="image-item pointer relative" 
        @mouseenter="show(img)" @mouseleave="hide(img)"
        />
        <div v-if="fileImageExtension(img)" @click="previewVideo(img)"  class="play-icon flex items-center justify-center pointer" style="">
          <MyContentIcon icon="fluent:play-16-filled" style="font-size: 1.8rem;"/>
        </div>
        <div class="absolute" style="left:16px;" :style="isModal ? {top: '4px'}:{top: '8px'}">
          <xt-button :w="isModal ? 32 : 40" :h="isModal ? 32 : 40" class="xt-bg-t-2" style="border-radius: 8px;" @click="addToActive(img)" >
            <a-checkbox :checked="isInActive(img)"></a-checkbox>
          </xt-button>
        </div>
        <div class="absolute flex " style="right:20px;" :style="isModal ? {top: '4px'}:{top: '8px'}">
          <xt-button :w="isModal ? 32 : 40" :h="isModal ? 32 : 40" class="xt-bg-t-2 mr-3" style="border-radius: 8px;" @click="download(img)">
            <div class="flex items-center justify-center">
              <xt-new-icon icon="fluent:arrow-download-16-regular" :size="isModal ? 16 : 20"></xt-new-icon>
            </div>
          </xt-button>
          <xt-button :w="isModal ? 32 : 40" :h="isModal ? 32 : 40" class="xt-bg-t-2" style="border-radius: 8px;" @click="removeToMyPaper(img)">
            <div class="flex items-center justify-center">
              <xt-new-icon icon="fluent:star-16-filled" v-if="isInMyPapers(img)" :size="isModal ? 16 : 20" style="color: var(--warning) !important;"></xt-new-icon>
              <xt-new-icon icon="fluent:star-16-regular" v-else :size="isModal ? 16 : 20"></xt-new-icon>
            </div>
          </xt-button>
        </div>
      </xt-mix-menu>
     </a-col>
    </a-row>
   </viewer>
  </vue-custom-scrollbar>
 </template>
 
 <script>
 import { mapActions,mapWritableState } from 'pinia';
 import { fileImageExtension,isInActive,getFileName,isInMyPapers } from '../../libs/utils';
 import { paperStore } from '../../../../store/paper';
 import { Icon as MyContentIcon } from '@iconify/vue';
 import { message } from 'ant-design-vue';
 import { appStore } from '../../../../store';
 import { useWidgetStore } from '../../../../components/card/store';

 import GradeSmallTip from '../../../../components/GradeSmallTip.vue';

 const fs = window.$models.fs
 const path = require('path')

 export default {
   name: "MyContent",
 
   components:{
    MyContentIcon,
   },
 
   props: ['myPaperList','isModal'],
 
   data() {
     return {
      options: { url: 'data-source',},
      myCurrentID:null,
      hoverVisible:false,
 
      settingsScroller: {
       useBothWheelAxes: true,
       swipeEasing: true,
       suppressScrollY: false,
       suppressScrollX: true,
       wheelPropagation: true,
      },
      myMenus:[
       { 
         newIcon:'mingcute:windows-line',name:'设置桌面壁纸',
         callBack:()=>{ this.setDesktopPaper(); } 
       },
       {
         newIcon:'fluent:arrow-download-16-regular',name:'下载壁纸',
         callBack:()=>{ this.download(this.myCurrentID); } 
       },
       { 
         newIcon:'fluent:delete-16-regular',name:'删除该壁纸',
         callBack:()=>{
          this.delCurrentPaper();
         } 
       },
       { 
         newIcon:'fluent:desktop-16-regular',name:'设为工作台背景',
         callBack:()=>{ this.setAppPaper() } 
       },
      ]
     }
   },
 
   computed:{
    ...mapWritableState(useWidgetStore,['rightModel']),
    ...mapWritableState(paperStore,['settings','activePapers','myPapers']),
   },
 
   methods:{
    fileImageExtension,isInActive,isInMyPapers,
    ...mapActions(paperStore,['addToActive','removeToMyPaper']),
    ...mapActions(appStore,['setBackgroundImage']),

    // 播放动态壁纸
    previewVideo(img){
     this.$emit('playPaperVideo',img);
    },
    // 设置桌面壁纸
    setDesktopPaper(){
     if(this.myCurrentID !== null){
      this.$xtConfirm('确定将此壁纸设置为系统桌面壁纸','确定将此壁纸设置为系统桌面壁纸？注意，此处设置不是工作台的壁纸。',{
        index:1020,
        ok: () => {
          message.info('正在为您下载并设桌面壁纸')
          tsbApi.system.setPaper(this.myCurrentID.path)
        },
        no: () => {},
        noText: '取消',
        type:'warning'
      })
     }
    },
    // 删除壁纸
    delCurrentPaper(){
      if(this.myCurrentID !== null){
        const imageExtensions = ['jpg', 'jpeg', 'gif', 'bmp', 'png'];
        if (fileImageExtension(this.myCurrentID)){
          this.activePapers.filter(img => {
           if (img.path === this.myCurrentID.path) {
            this.activePapers.splice(this.myCurrentID.path, 1)
           }
          })
          fs.removeSync(path.join(this.myCurrentID.src))
          if (this.myPapers.indexOf(this.myCurrentID) !== -1) return  this.myPapers.splice(this.myPapers.indexOf(this.myCurrentID), 1);
        }
        else {
          const findIndex = this.activePapers.findIndex(img => { return img.src === this.myCurrentID.src });
          this.activePapers.splice(findIndex, 1);
          if (this.myCurrentID.src.split('//')[0] === 'file:' && imageExtensions.indexOf(this.myCurrentID.src.split('.')[1]) !== -1){
            fs.removeSync(path.join(this.myCurrentID.src.split('//')[1]))
            if (this.myPapers.indexOf(this.myCurrentID) !== -1)  return this.myPapers.splice(this.myPapers.indexOf(this.myCurrentID), 1);
          }
          else {
            if (this.myPapers.indexOf(this.myCurrentID) !== -1) return this.myPapers.splice(this.myPapers.indexOf(this.myCurrentID), 1);
          }
        } 
      }
    },
    // 下载
    download(img){
     if(this.settings.savePath === ''){
      this.$xtConfirm('您尚未设置壁纸保存目录，请设置目录，设置目录后下载将自动开始。',{
        index:1020,
        ok: async() => {
          await this.queryStart();
        },
        no: () => {},
        noText: '取消',
        type:'warning'
      })
     }
     else {
      const fileRegex = /^file:/;
      const regex = /^https:\/\/up\.apps\.vip/;
      const exist = fileRegex.test(img.path);
      // 判断是否为本地图片
      if(!exist && !regex.test(img.path)){ this.doStartDownload(img); }
      else { 
        this.$xtConfirm('图片已下载','',{
          index:1020, 
          ok: async() => {},
          no: () => {},
          noText: null,
          type:'warning'
        }) 
      }
     }
    },
    doStartDownload(item){
      message.info('开始下载壁纸');
      item.percent = 0;
      const name = getFileName(item.src);
      tsbApi.download.start({
        url:item.src,
        savePath: this.settings.savePath + '/static/' + name,
        updated: (args) => {
          item.done = 1
          item.percent = (args.downloadInfo.receivedBytes / args.downloadInfo.totalBytes * 100).toFixed(0)
        },
        done: (args) => {
          item.percent = 100
          item.done = 1
          message.success('下载完成')
        },
        willDownload: (args) => {
        }
      })
    },
    async queryStart (){
     let savePath = await tsbApi.dialog.showOpenDialog({
      title: '选择目录', message: '请选择下载壁纸的目录',
      properties: [ 'openDirectory', 'createDirectory',]
     })
     if (savePath) {
      this.settings.savePath = savePath[0]
      this.doStartDownload(this.myCurrentID)
     } 
    },
    // 设置工作台背景和桌面壁纸
    setAppPaper(){
      if(this.myCurrentID !== null){
        message.info('正在为您设置背景');
      }
      if (this.myCurrentID.srcProtocol){
        this.setBackgroundImage({path: '',  runpath: `file://${this.myCurrentID.src}`});
      }
      else {
        if (!this.myCurrentID.path) { this.myCurrentID.path = this.myCurrentID.src }
        else { this.setBackgroundImage(this.myCurrentID) }
      }
    },

    // 鼠标移入事件
    show(item){
      // console.log(item,this.myCurrentID);
      // this.hoverVisible = true;
    },
    // 鼠标移出事件
    hide(){
      // this.hoverVisible = false;
    },
   },
 };
 </script>
 
 <style lang="scss" scoped>
 .play-icon {
  position: absolute;
  z-index: 99;
  /**background: rgba(0, 0, 0, 0.51);**/
  text-align: center;
  width: 4em;
  height: 4em;
  left: 50%;
  top: 50%;
  border-radius: 100px;
  transform: translate(-50%, -50%);
 }

 :deep(.ant-checkbox-inner){
    border: 1px solid var(--active-text);
 }
 </style>