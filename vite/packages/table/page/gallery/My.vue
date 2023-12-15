<template>
  <div class="w-full h-full flex flex-col">
    <div class="h-10 flex items-center justify-between mb-4 ">
      <div class="flex items-center justify-center">
        <MyIcon icon="fluent:star-16-regular" :style="isModal ? { 'font-size':'1rem' } : {'font-size':'1.25rem'}" class="mr-2 xt-text"/>
        <span  class="s-text xt-text xt-font" :class="isModal ? 'font-14 font-400' : 'font-16 font-600'">我的收藏 （{{ myPapers.length }}）</span>
      </div>

      <div class="flex items-center justify-center  pr-3">
        <template v-if="!isModal">
          <xt-button @click="playAll" class="mr-3 xt-bg-t-2"  h="40" w="113" style="border-radius: 8px;">
            <div class="flex items-center justify-center">
              <MyIcon icon="fluent:play-16-filled" style="font-size:1.25rem;" class="xt-text mr-2" />
              <span  class="s-text xt-text xt-font font-16 font-400" v-if="!isModal">轮播全部</span> 
            </div>
          </xt-button>
          <xt-button w="154" h="40" @click="playActive" class="mr-3 xt-bg-t-2">
            <div class="flex items-center justify-center">
              <MyIcon icon="fluent:play-16-filled" style="font-size:1.25rem;" class="xt-text mr-2"/>
              <span  class="s-text xt-text xt-font font-16 font-400">轮播选中（ {{ activePapers.length }} ）</span> 
            </div>
          </xt-button>
          <xt-button h="40" w="154" style="border-radius: 8px;" @click="openRight"  class="xt-bg-t-2">
            <div class="flex items-center justify-center">
              <MyIcon icon="fluent:arrow-download-16-regular" style="font-size:1.25rem;" class="xt-text mr-2" />
              <span  class="s-text xt-text xt-font font-16 font-400" v-if="!isModal">导入本地图片</span> 
            </div>
          </xt-button>
        </template>

        <template v-else>
          <xt-button w="32" h="32" class="xt-bg mr-3" style="border-radius: 8px;" >
            <div class="flex items-center justify-center">
              <MyIcon icon="fluent:play-16-filled" style="font-size:1rem"></MyIcon>
            </div>
          </xt-button>
          <xt-button w="32" h="32" class="xt-bg mr-3" style="border-radius: 8px;" @click="openRight"  >
            <div class="flex items-center justify-center">
              <MyIcon icon="fluent:arrow-download-16-regular" style="font-size:1rem" />
            </div>
          </xt-button>
          <ClosePaperButton />
        </template>
      </div>
    </div>

    <div class="flex-1 h-4/5">
      <template v-if="myPapers.length === 0">
        <MyEmptyStatus @importLocal="openRight"/>
      </template>
      <template v-else>
        <MyContent :myPaperList="myPapers" :isModal="isModal" @paperSetting="openBottom" @playPaperVideo="playPaperVideo"/>
      </template>
    </div>
  </div>

  <PaperRightDrawer ref="rightDrawerRef" :loadStaticPaper="loadStaticPaper" :getLoadLively="getLoadLively"/>

  <div v-show="previewVideoVisible" style="position: fixed;left: 0;right: 0;top: 0;bottom: 0;z-index:9999999" id="previwer">
    <div id="actions" class="no-drag" style="position: fixed;right: 2em;top: 2em;z-index: 9999999999;">
     <div @click="closePreview" class="btn pointer" style="background: rgba(0,0,0,0.76);min-width: 4em;">
       <Icon icon="guanbi1" style="font-size: 2em"></Icon>
     </div>
    </div>
    <div id="my-mse"></div>
  </div>  
</template>

<script>
import { mapWritableState, mapActions } from 'pinia';
import { paperStore } from '../../store/paper';
import { Icon as MyIcon } from '@iconify/vue';
import { fileImageExtension,changeTime } from './libs/utils';
import Spotlight from 'spotlight.js';
import Player from 'xgplayer/dist/simple_player';
import {} from '../../components/card/store';

import MyEmptyStatus from './components/empty/MyEmptyStatus.vue';
import MyContent from './components/content/MyContent.vue';
import PaperRightDrawer from './components/drawer/PaperRightDrawer.vue';
import ClosePaperButton from './components/close/ClosePaperButton.vue';

const fs = window.$models.fs;
const path = require('path');

export default {
  
  components:{ MyIcon,MyContent,MyEmptyStatus,PaperRightDrawer,ClosePaperButton},

  props:['isModal'],

  data(){
    return{
      currentPaper: null,//当前壁纸，显示菜单用
      paperTime:'',
      previewVideoVisible: false,
    }
  },

  computed:{
    ...mapWritableState(paperStore,['settings','myPapers','activePapers']),
  },

  mounted(){
    $('#previwer').mousemove(() => {
      $('#actions').show();
      if (this.timer) {  clearTimeout(this.timer); }
      this.timer = setTimeout(() => {
        $('#actions').fadeOut();
      }, 5000)
    });
    if(this.settings.savePath !== ''){
      this.getLoadLively();
      this.loadStaticPaper();
    }
    
  },

  methods:{
    ...mapActions(paperStore,['addToStaticPaper']),
    fileImageExtension,
    // 播放全部和播放选中
    playAll(){
      const imageArr = [];
      for(const el of this.myPapers){
        if(fileImageExtension(el)){
          const elOption = { 'src-mp4': `file://${el.src}`, media: 'video', poster: el.path};
          imageArr.push(elOption);
        }
        else { imageArr.push({src: el.path,}); }
      }
      window.Spotlight.show(imageArr,{
        control: 'autofit,page,fullscreen,close,zoom,prev,next',
        play: true, autoslide: true,  infinite: true, 
        progress: false,  title: false, autoplay: true,
      })
    },
    playActive(){
      const playArr = [];
      for(const el of this.activePapers){
        if(fileImageExtension(el)){ 
          const playOption = {   'src-mp4': el.srcProtocol, media: 'video',  poster: el.path };
          playArr.push(playOption);
        }
        else { playArr.push({ src: el.path, }); } 
      }
      window.Spotlight.show(playArr,{
        control: 'autofit,page,fullscreen,close,zoom,prev,next',
        play: true, autoslide: true,  infinite: true, 
        progress: false,  title: false, autoplay: true,
      });
    },

    // 开启抽屉菜单
    openRight(){   this.$refs.rightDrawerRef.openRightDrawer() },
    openBottom(item){ 
      this.$refs.bottomDrawerRef.openBottomDrawer(); 
      this.currentPaper = item;
    },

    //获取本地文件图片和视频数据
    getLoadLively(){
      fs.pathExists(path.join(this.settings.savePath, 'lively')).then((exists)=>{
        if(exists){
          const videos = fs.readdirSync(path.join(this.settings.savePath, 'lively'));
          for(const item of videos){
            let videoPath = path.join(this.settings.savePath, 'lively', item);
            const filename = path.basename(videoPath, '.mp4');
            const livelyItem = { 
              src:videoPath, 
              path: `https://up.apps.vip/lively/${filename}.jpg`, 
              srcProtocol: 'file://' + path.join(this.settings.savePath, 'lively', item),
            };
            this.addToStaticPaper(livelyItem);
          }
        }
      })
    },
    loadStaticPaper(){
      const staticDir = path.join(path.join(this.settings.savePath), 'static');
      // 判断文件目录是否存在
      fs.pathExists(staticDir).then((exists)=>{
        // 存在就读取指定壁纸目录
        if (exists){
          let promptPaper = fs.readdirSync(staticDir);
          for(const item of promptPaper){
            this.getFileCreatedTime(path.join(`${staticDir}/${item}`)).then((createTime)=>{
              this.paperTime = changeTime(createTime)
            })
            let image = {
              title: false,  src: `file://${staticDir}/${item}`,
              path: `file://${staticDir}/${item}`,time: this.paperTime
            };
            this.addToStaticPaper(image);
          }
        }
      })
    },
    
    // 获取文件时间
    async getFileCreatedTime(filePath) {
      try {
        const stats = await fs.stat(filePath)
        return stats.birthtime
      } catch (err) {
        console.error(err)
      }
    },

    // 播放动态壁纸
    playPaperVideo(img){
      $('#actions').show();
      this.timer = setTimeout(() => {
        $('#actions').fadeOut()
      }, 5000)
      this.previewVideoVisible = true;
      if (window.$xgplayer) { window.$xgplayer.destroy(); };
      const url = `${img.srcProtocol}`;
      window.$xgplayer = new Player({
        id: 'my-mse',
        url: url,
        // fitVideoSize: 'fixWidth',
        fitVideoSize: 'fixWidth',
        // width:300,
        // height:300,
        videoFillMode:'auto',
        loop: true,
        fluid: true,
        videoInit: true,
        autoplay: true,
      })
    },
    // 关闭动态壁纸播放
    closePreview(){
      if (window.$xgplayer) {
        window.$xgplayer.destroy()
        window.$xgplayer = null
      }
      this.previewVideoVisible = false;
    },


  },
};
</script>

<style lang="scss" scoped>

</style>