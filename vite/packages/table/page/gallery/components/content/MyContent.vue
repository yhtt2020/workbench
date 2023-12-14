<template>
  <vue-custom-scrollbar id="containerWrapper" :settings="settingsScroller" class="grow shrink" style="height: 100%;">
   <viewer :images="myPaperList" :options="options" class="px-2.5">
    <a-row :gutter="[20, 20]" id="bingImages">
     <a-col class="image-wrapper" v-for="img in myPaperList" :span="6">
      <xt-mix-menu :menus="myMenus" fn="callBack" @mounted="this.myCurrentID = img">
        <img :src="fileImageExtension(img) ? img.path : img.src" :data-source="img.path" :alt="img.resolution"   class="image-item pointer relative"/>
        <div v-if="fileImageExtension(img)" @click="previewVideo(img)"  class="play-icon flex items-center justify-center pointer" style="">
          <MyContentIcon icon="fluent:play-16-filled" style="font-size: 1.8rem;"/>
        </div>
        <div class="absolute" style="top: 4px; left:16px;">
          <xt-button w="32" h="32" class="xt-bg-t-2" style="border-radius: 8px;" @click="addToActive(img)" >
            <a-checkbox :checked="isInActive(img)"></a-checkbox>
          </xt-button>
        </div>
        <div class="absolute" style="top: 4px; right:20px;">
          
        </div>
      </xt-mix-menu>
     </a-col>
    </a-row>
   </viewer>
  </vue-custom-scrollbar>
 </template>
 
 <script>
 import { mapActions,mapWritableState } from 'pinia';
 import { fileImageExtension,isInActive } from '../../libs/utils';
 import { paperStore } from '../../../../store/paper';
 import { Icon as MyContentIcon } from '@iconify/vue';
 import { message } from 'ant-design-vue';
 import { appStore } from '../../../../store';
 
 import { useWidgetStore } from '../../../../components/card/store';
 
 export default {
   name: "MyContent",
 
   components:{
    MyContentIcon,
   },
 
   props: ["myPaperList"],
 
   data() {
     return {
      options: { url: 'data-source',},
      myCurrentID:null,
 
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
         callBack:()=>{ this.download(); } 
       },
       { 
         newIcon:'fluent:delete-16-regular',name:'删除该壁纸',
         callBack:()=>{
          this.delCurrentPaper();
         } 
       },
       { 
         newIcon:'fluent:desktop-16-regular',name:'设为工作台背景',
         callBack:()=>{} 
       },
      ]
     }
   },
 
   computed:{
    ...mapWritableState(useWidgetStore,['rightModel']),
    ...mapWritableState(appStore,['settings']),
   },
 
   methods:{
    fileImageExtension,isInActive,
    ...mapActions(paperStore,['addToActive']),
    // 播放动态壁纸
    previewVideo(img){
     this.$emit('playPaperVideo',img);
    },

    // 设置桌面壁纸
    setDesktopPaper(){
     if(this.myCurrentID !== null){
      this.$xtConfirm('确定将此壁纸设置为系统桌面壁纸','确定将此壁纸设置为系统桌面壁纸？注意，此处设置不是工作台的壁纸。',{
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
     
    },

    // 下载
    download(){
     if(this.settings.savePath === ''){
      this.$xtConfirm('您尚未设置壁纸保存目录，请设置目录，设置目录后下载将自动开始。',{
        ok: async() => {
          await this.queryStart();
        },
        no: () => {},
        noText: '取消',
        type:'warning'
      })
     }
     else {
      if(this.myCurrentID !== null){
        this.doStartDownload(this.myCurrentID)
      }
     }
    },
    doStartDownload(item){
      console.log('执行....',item);
      message.info('开始下载壁纸')
      const name = item.path.split('/')
      console.log('执行....',name);
    //  tsbApi.download.start({
    //   url: item,
    //   savePath: this.settings.savePath + '/static/' + name,
    //   done: (args) => {
    //     // message.success('壁纸下载完成')
    //     console.log('排查::>>',args)
    //     message.success('壁纸下载完成')
    //   },
    //   // willDownload: (args) => {},
    //  })
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
    }

    
    
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