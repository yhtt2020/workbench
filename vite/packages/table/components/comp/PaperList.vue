<template>
  <viewer :images="list" :options="options">
    <a-row :gutter="[16,16]" id="bingImages">
      <a-col class="image-wrapper " v-for="(img,index) in list" :span="6" style="">
        <div class="pointer w-full h-full bing-paper" >
          <xt-mix-menu :menus="bingMenu" fn="callBack" @mounted="paperCurrent = img" :stopPropagation="false">
            <img class="image-item pointer" :src="img.src" :data-source="img.path" style="position: relative">
            <div class="absolute " style="top:50%;left:50%;transform: translate(-50% ,-50%);">
              <xt-button w="100" :h="isModal ? 32 : 40"  style="opacity: 0; border-radius: 8px;" class="set-paper xt-bg-t-3" @click="setAppPaper(img)">
                <div class="flex items-center justify-center">
                  <xt-new-icon icon="fluent:checkmark-circle-16-filled" :size="isModal ? 16 : 20" class="mr-1" :color="'var(--active-text)'"></xt-new-icon>
                  <span :class="isModal ? 'font-14 font-400': 'font-16 font-400'" class="xt-active-text xt-font">设为壁纸</span>
                </div>
              </xt-button>
            </div>
            <div class="absolute right-2 top-1  flex">
              <xt-button :w="isModal ? 32 : 40" :h="isModal ? 32 : 40" class="xt-bg-t-3 img-button mr-1" style="border-radius: 8px; opacity: 0;" @click="download(img)" >
                <div class="flex items-center justify-center">
                 <xt-new-icon icon="fluent:arrow-download-16-regular" :size="isModal ? 16 : 20" :color="'var(--active-text)'"></xt-new-icon>
                </div>
              </xt-button>
              <xt-button :w="isModal ? 32 : 40" :h="isModal ? 32 : 40" class="xt-bg-t-3 img-button mr-1" style="border-radius: 8px;" @click="addToMy(img)" :style="isInMyPapers(img) ? { opacity: '1' } :{ opacity: '0' }">
                <div class="flex items-center justify-center">
                 <xt-new-icon icon="fluent:star-16-filled" v-if="isInMyPapers(img)" :size="isModal ? 16 : 20" :color="'var(--warning)'"></xt-new-icon>
                 <xt-new-icon icon="fluent:star-16-regular" v-else :size="isModal ? 16 : 20" :color="'var(--active-text)'"></xt-new-icon>
                </div>
              </xt-button>
            </div>
          </xt-mix-menu>
        </div>
        <!-- <img   class="image-item pointer" :src="img.src" :data-source="img.path" style="position: relative">
        <div class="flex"></div> -->
        <!-- <div style="position: absolute;right: 0;top: -10px ;padding: 10px">
          <div @click.stop="addToMy(img)" class="bottom-actions pointer" :style="{background:isInMyPapers(img)?'#009d00a8':''}">
            <Icon v-if="!isInMyPapers(img)" icon="tianjia1"></Icon>
            <Icon v-else style="" icon="yiwancheng"></Icon>
          </div>
        </div> -->
      </a-col>
    </a-row>
  </viewer>

<!-- 
<a-drawer :height="200" v-model:visible="visibleMenu" placement="bottom">
  <a-row :gutter="20" style="text-align: center">
    <a-col :span="4">
      <div @click="setDesktopPaper" class="btn">
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
    <a-col :span="4">
      <div @click="setAppPaper" class="btn relative">
        <Icon style="font-size: 3em" icon="tianjia1"></Icon>
        <div>设为工作台背景</div>
      </div>
    </a-col>
  </a-row>
</a-drawer> -->
</template>

<script>
import { mapActions,mapState, mapWritableState  } from 'pinia'
import { appStore} from '../../store'
import { paperStore } from '../../store/paper'
import {message,Modal} from 'ant-design-vue'
import { isInMyPapers,getFileName } from '../../page/gallery/libs/utils';

import GradeSmallTip from "../GradeSmallTip.vue";

export default {
  name: 'PaperList',
  props:['list','isModal'],
  components:{
    GradeSmallTip
  },
  data(){
    return{
      options:{
        url: 'data-source',
      },
      visibleMenu:false,
      paperCurrent:null,
      bingMenu:[
       { 
        newIcon:'fluent:desktop-16-regular',name:'设为工作台背景',
        callBack:()=>{ this.setAppPaper(this.paperCurrent) } 
       },
       { 
        newIcon:'mingcute:windows-line',name:'设置桌面壁纸',
        callBack:()=>{ this.setDesktopPaper(this.paperCurrent)  } 
       },
       {
        newIcon:'fluent:arrow-download-16-regular',name:'下载壁纸',
        callBack:()=>{ this.download(this.paperCurrent) } 
       },
      ]
    }
  },

  mounted () {
  },

  computed:{
    ...mapWritableState(paperStore,['settings']),
  },

  methods:{
    isInMyPapers,getFileName,
    ...mapActions(paperStore,['removeToMyPaper']),
    ...mapActions(appStore,['setBackgroundImage']),

    // 添加收藏
    addToMy(img){
      let image = { src:img.src, path:img.src };
      this.removeToMyPaper(image);
    },

    // 设置桌面壁纸
    setDesktopPaper(img){
      this.$xtConfirm('确定将此壁纸设置为系统桌面壁纸？注意，此处设置不是工作台的壁纸。','',{
        index:1020,
        ok: () => {
          message.info('正在为您下载并设桌面壁纸');
          tsbApi.system.setPaper(img.src);
        },
        no: () => {},
        noText: '取消',
        type:'link'
      })
      // Modal.confirm({
      //   content:'确定将此壁纸设置为系统桌面壁纸？注意，此处设置不是工作台的壁纸。',
      //   okText:'设置桌面壁纸',
      //   onOk:()=>{
      //     message.info('正在为您下载并设桌面壁纸')
      //     tsbApi.system.setPaper(this.paperCurrent.src)
      //     this.visibleMenu = false
      //   }
      // })
    },

    // 设置工作台背景和桌面壁纸
    setAppPaper(img){
      if(img !== null){  message.info('正在为您设置背景'); }
      if (img.srcProtocol){ this.setBackgroundImage({path: '',  runpath: `file://${img.src}`}); }
      else {
       if (!img.path) { img.path = img.src }
       else { this.setBackgroundImage(img) }
      }

      // message.info('正在为您设置壁纸')
      // this.setBackgroundImage(this.paperCurrent.path)
      // this.visibleMenu = false
    },

    // 开始下载
    download(img){
      if(this.settings.savePath === ''){
        this.$xtConfirm('您尚未设置壁纸保存目录，请设置目录，设置目录后下载将自动开始。','',{
         index:1020,
         ok: async() => {
          await this.queryStart()
         },
         no: () => {},
         noText: '取消',
         type:'warning'
        })
      }
      else {
        this.doStartDownload(img)
      }
      // if(this.settings.savePath === ''){
      //   Modal.confirm({
      //     centered:true,
      //     style:{'z-index':999999},
      //     content: '您尚未设置壁纸保存目录，请设置目录，设置目录后下载将自动开始。',
      //     onOk: async () => {
      //       await this.queryStart()
      //     }
      //   })
      // }else{
      //   // console.log('测试::>>',this.paperCurrent)
      //   this.doStartDownload(img)
      // }
    },
    doStartDownload(item){
      message.info('开始下载壁纸')
      const name = getFileName(item.src)
      console.log('下载',getFileName(item.src));
      tsbApi.download.start({
        url: item.src,
        savePath: this.settings.savePath + '/static/' + name,
        done: (args) => {
          message.success('壁纸下载完成')
        }
      })
      // this.visibleMenu = false
    },
    // 选择目录
    async queryStart () {
      let savePath = await tsbApi.dialog.showOpenDialog({
        title: '选择目录', message: '请选择下载壁纸的目录', properties: [
          'openDirectory', 'createDirectory',
        ]
      })
      if (savePath) {
        this.settings.savePath = savePath[0]
        this.doStartDownload(this.paperCurrent)
      }
    },


  },
  computed:{
    ...mapState(paperStore,['myPapers','settings']),
  }
}
</script>

<style  lang="scss">
.bottom-actions {
  color: rgb(234, 234, 234);
  font-size: 1.2em;
  width: 2em;

  height: 2em;
  line-height: 2em;
  background: rgba(0, 0, 0, 0.42);
  border-radius: 0px 6px 0px 6px;
}
.image-item {
  object-fit: cover;
  width: 100%;
  border-radius: 6px;
  aspect-ratio: 16/9;
}
.viewer-toolbar > ul{
li{
  margin-right: 10px;
  margin-left: 10px;
}
zoom: 1.6;
}

.bing-paper{
  &:hover{
    .img-button,.set-paper{
      opacity: 1 !important;
    }
  }
}
.xt-bg-t-3{
  background: rgba(0,0,0,0.4) !important;
}
</style>
