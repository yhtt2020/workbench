<template>
 <div class="flex items-center justify-start w-full" style="height:100%;">
  <vue-custom-scrollbar  :settings="settingsScroller" class="h-full w-full">
   <div style="height: 8px;"></div>
   <viewer :images="paperList" :options="options">
    <a-row :gutter="[16,16]" id="bingImages">
     <a-col class="image-wrapper" v-for="img in paperList" :span="6">
      <div class="pointer w-full h-full img-hide">
       <xt-mix-menu :menus="paperMenus" fn="callBack" @mounted="currentPaperImg = img" :stopPropagation="false">
        <img :src="img.thumbPath" :data-source="img.fullPath"  class="image-item pointer relative " />
        <div class="absolute top-1/2 left-1/2 " style="transform: translate(-50% ,-50%);">
          <xt-button w="100" :h="isModal ? 32 : 40"  style="opacity: 0; border-radius: 8px;" class="img-button xt-bg-t-2" @click="setAppPaper(img)">
            <div class="flex items-center justify-center">
              <xt-new-icon icon="fluent:checkmark-circle-16-filled" :size="isModal ? 16 : 20" class="mr-1 " style="color: var(--active-text) !important;"></xt-new-icon>
              <span :class="isModal ? 'font-14 font-400': 'font-16 font-400'" class="xt-active-text xt-font">设为壁纸</span>
            </div>
          </xt-button>
        </div>
        <div class="absolute right-2 top-1  flex">
         <xt-button :w="modalWidth" :h="modalWidth" class="xt-bg-t-2 img-button mr-1" style="border-radius: 8px; opacity: 0;" @click="download(img)" >
          <div class="flex items-center justify-center">
           <xt-new-icon icon="fluent:arrow-download-16-regular" :size="isModal ? 16 : 20" style="color: var(--active-text) !important;"></xt-new-icon>
          </div>
         </xt-button>
         <xt-button :w="modalWidth" :h="modalWidth" class="xt-bg-t-2 img-button mr-1" style="border-radius: 8px;" @click="addToMy(img)" :style="isInMyPapers(img) ? { opacity: '1' } :{ opacity: '0' }">
          <div class="flex items-center justify-center">
           <xt-new-icon icon="fluent:star-16-filled" v-if="isInMyPapers(img)" :size="isModal ? 16 : 20" style="color: var(--warning) !important;"></xt-new-icon>
           <xt-new-icon icon="fluent:star-16-regular" v-else :size="isModal ? 16 : 20" style="color: var(--active-text) !important;"></xt-new-icon>
          </div>
         </xt-button>
        </div>
       </xt-mix-menu>
      </div>
     </a-col>
    </a-row>
   </viewer>
   <div style="height: 16px;"></div>
  </vue-custom-scrollbar>
 </div>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia';
import { paperStore } from '../../../../store/paper';
import { isInMyPapers,getFileName } from '../../libs/utils';
import { message } from 'ant-design-vue';
import { appStore } from '../../../../store';

export default {
 props:['isModal','paperList'],

 data(){
  return{
   options: { url: 'data-source',},
   currentPaperImg:null,

   settingsScroller: {
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true,
   },
   paperMenus:[
    { 
     newIcon:'fluent:desktop-16-regular',name:'设为工作台背景', 
     callBack:()=>{ this.setAppPaper(this.currentPaperImg) },
    },
    { 
     newIcon:'mingcute:windows-line',name:'设置桌面壁纸',
     callBack:()=>{ this.setDesktopPaper() },
    },
    {
     newIcon:'fluent:arrow-download-16-regular',name:'下载壁纸', 
     callBack:()=>{ this.doStartDownload(this.currentPaperImg) },
    },
   ],
  }
 },

 computed:{
  ...mapWritableState(paperStore,['myPapers','settings']),
  modalWidth(){
   if(this.isModal){ return 32;}
   else { return 40; }
  },

 },

 methods:{
  isInMyPapers,
  ...mapActions(paperStore,['removeToMyPaper','addToMyPaper']),
  ...mapActions(appStore,['setBackgroundImage']),
  // 添加收藏
  addToMy(img){
   let image = img
   this.removeToMyPaper(image)
  },

  // 下载
  download(img){
    if(this.settings.savePath === ''){
      this.$xtConfirm('您尚未设置壁纸保存目录，请设置目录，设置目录后下载将自动开始。','',{
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
      willDownload: (args) => {}
    })
  },
  async queryStart (){
    let savePath = await tsbApi.dialog.showOpenDialog({
      title: '选择目录', message: '请选择下载壁纸的目录',
      properties: [ 'openDirectory', 'createDirectory',]
    })
    if (savePath) {
      this.settings.savePath = savePath[0]
      this.doStartDownload(this.currentPaperImg)
    } 
  },

  // 设置工作台背景和桌面壁纸
  setAppPaper(img){
    if(img !== null){  message.info('正在为您设置背景'); }
    if (img.srcProtocol){ this.setBackgroundImage({path: '',  runpath: `file://${img.src}`}); }
    else {
      if (!img.path) { img.path = img.path }
      else { this.setBackgroundImage(img) }
    }
  },

   // 设置桌面壁纸
   setDesktopPaper(){
    if(this.currentPaperImg !== null){
      this.$xtConfirm('确定将此壁纸设置为系统桌面壁纸','确定将此壁纸设置为系统桌面壁纸？注意，此处设置不是工作台的壁纸。',{
        index:1020,
        ok: () => {
          message.info('正在为您下载并设桌面壁纸');
          tsbApi.system.setPaper(this.currentPaperImg.path);
        },
        no: () => {},
        noText: '取消',
        type:'warning'
      })
    }
  },
    

 },
};
</script>

<style lang="scss" scoped>
.img-hide{
 &:hover{
   .img-button{
    opacity: 1 !important;
   }
 }
}

.xt-bg-t-2{
  background: rgba(0,0,0,0.4) !important;
}
</style>