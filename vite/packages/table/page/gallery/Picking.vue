<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center justify-center">
        <xt-new-icon icon="fluent:image-multiple-16-regular" size="20" class="mr-2 xt-text" ></xt-new-icon>
        <span class="xt-font xt-text font-400" :class="isModal ? 'font-14':'font-16'">拾光壁纸</span>
      </div>
      <div class="flex items-center justify-center">
        <template v-if="isModal">
          <MinSelect :list="pickParams.paperSelect" @update="pickFilterChange($event)"/>
        </template>

        <xt-select :list="pickParams.paperSelect" class="xt-bg-t-2" v-else :zIndex="1250" 
         v-model="pickParams.setting.paperValue"  :borderClass="'rounded-md '" :border="false" 
         @change="pickFilterChange($event)" style="width: 140px;margin-right: 12px;text-align: center;" 
        />
        
        <xt-dropdown :w="isModal ? 32 : 40" :h="isModal ? 32 : 40"  :iconSize="isModal ? 20 : 24" :placement="'bottomRight'" :buttonClass="'xt-active-bg'" 
        :newIcon="'fluent:filter-16-regular'" :iconBg="'var(--active-text)'" :class="isModal ? 'mr-3':''" >
          <PickDropDetail :isModal="isModal" @emitPick="updateList"/>
        </xt-dropdown>

        <ClosePaperButton v-if="isModal"/>
      </div>
    </div>

    <div class="flex-1" style="height: calc(100% - 100px);">
      <template v-if="isLoading">
        <div style="display: flex; align-items: center; justify-content: center;">
          <a-spin  />
        </div>
      </template>
      
      <XtScrollbar  :y="true" style="height: 100%;" id="pick-wrapper" ref="pickWrapperRef" v-show="isLoading === false">
        <div style="height:8px;"></div>
        <viewer :images="pickImageData" :options="options" >
          <a-row :gutter="[16, 16]" id="pick-images" ref="pickRef">
            <a-col class="image-wrapper " v-for=" (img,index)  in  pickImageData " :span="6" >
              <div class="pointer w-full h-full pick-paper" >
                <xt-mix-menu :menus="pickPaperMenu" fn="callBack"  @mounted="this.currentPaper = img" :stopPropagation="false" >
                  <img  class="image-item pointer" :src="img.src" :data-source="img.path" :alt="img.resolution" style="position: relative">
                  <div class="absolute top-1 flex right-3">
                    <xt-button :w="isModal ? 32 : 40" :h="isModal ? 32 : 40" class="xt-bg-t-3 mr-2 img-button" style="border-radius: 8px; opacity: 0;" @click="download(img)">
                      <div class="flex items-center justify-center">
                        <xt-new-icon icon="fluent:arrow-download-16-regular" :size="isModal ? 16 : 20" style="color: var(--active-text) !important;"></xt-new-icon>
                      </div>
                    </xt-button>
                    <xt-button :w="isModal ? 32 : 40" :h="isModal ? 32 : 40" class="xt-bg-t-3 mr-2 img-button" style="border-radius: 8px; opacity: 0; " @click="addToMy(img)"
                    :style="isInMyPapers(img) ? { opacity: '1' } :{ opacity: '0' }"
                    >
                      <div class="flex items-center justify-center">
                        <xt-new-icon icon="fluent:star-16-filled" v-if="isInMyPapers(img)" :size="isModal ? 16 : 20" :color="'var(--warning)'"></xt-new-icon>
                        <xt-new-icon icon="fluent:star-16-regular" v-else :size="isModal ? 16 : 20" style="color: var(--active-text) !important;"></xt-new-icon>
                      </div>
                    </xt-button>
                  </div> 
                  <div class="absolute" style="top:50%;left:50%;transform: translate(-50%,-50%);">
                    <xt-button w="100" :h="isModal ? 32 : 40" class="xt-bg-t-3 mr-2 img-button" style="border-radius: 8px; opacity: 0;" @click="setAppPaper(img)">
                      <div class="flex items-center justify-center">
                        <xt-new-icon icon="fluent:checkmark-circle-16-filled" :size="isModal ? 16 : 20" class="mr-1 " style="color: var(--active-text) !important;"></xt-new-icon>
                        <span :class="isModal ? 'font-14 font-400': 'font-16 font-400'" class="xt-active-text xt-font">设为壁纸</span>
                      </div>
                    </xt-button>
                  </div>
                </xt-mix-menu>
              </div>
            </a-col>
          </a-row>
        </viewer>
        <div style="height:16px;"></div> 
      </XtScrollbar>

      <!-- <template v-else>
        <vue-custom-scrollbar  :settings="settingsScroller" style="height: 100%" id="pick-wrapper" >
          <div style="height:8px;"></div> 
          <viewer :images="pickImageData" :options="options" >
            <a-row :gutter="[16, 16]" id="pick-images" ref="pickRef">
              <a-col class="image-wrapper " v-for=" (img,index)  in  pickImageData " :span="6" >
                <div class="pointer w-full h-full my-paper" >
                  <xt-mix-menu :menus="pickPaperMenu" fn="callBack"  @mounted="this.currentPaper = img" :stopPropagation="false" >
                    <img  class="image-item pointer" :src="img.src" :data-source="img.path" :alt="img.resolution" style="position: relative">
                    <div class="absolute top-1 right-3">
                      123
                    </div> 
                  </xt-mix-menu>
                </div>
              </a-col>
            </a-row>
          </viewer>
          <div style="height:16px;"></div> 
        </vue-custom-scrollbar>
      </template> -->
    </div>
  </div>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia';
import { pickPaperStore } from './store/PickPaperStore';
import { paperStore } from "../../store/paper";
import axios from 'axios';
import { formatDateTime,isInMyPapers,paperDownload } from './libs/utils';
import { appStore } from "../../store";
import browser from '../../js/common/browser'
import { taskStore } from '../../apps/task/store';
import { message } from 'ant-design-vue';

import ClosePaperButton from './components/close/ClosePaperButton.vue';
import PickDropDetail from './components/content/PickDropDetail.vue';
import GradeSmallTip from "../../components/GradeSmallTip.vue";
import MinSelect from './components/select/MinSelect.vue';

let fs = require('fs')
let path = require('path')


export default {
  name:'Picking',

  props:['isModal'],

  components:{
    ClosePaperButton,PickDropDetail,
    GradeSmallTip,MinSelect
  },

  data(){
    return{
      isLoading: false,
      pickImageData: [],
      options: { url: 'data-source',},
      currentPaper: null,

      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      pickPaperMenu:[
       { 
        newIcon:'fluent:desktop-16-regular',name:'设为工作台背景',
        callBack:()=>{ this.setAppPaper(this.currentPaper) } 
       },
       { 
        newIcon:'mingcute:windows-line',name:'设置桌面壁纸',
        callBack:()=>{  this.setDesktopPaper(this.currentPaper)  } 
       },
       {
        newIcon:'fluent:arrow-download-16-regular',name:'下载壁纸',
        callBack:()=>{  this.download(this.currentPaper) } 
       },
      ]
    }
  },

  computed:{
    ...mapWritableState(pickPaperStore,['pickParams']),
    ...mapWritableState(paperStore,['settings']),
  },

  mounted(){
    $("#pick-wrapper").scroll(()=>{
      if ($("#pick-wrapper").scrollTop() + $("#pick-wrapper").height() + 20 >= $("#pick-images").prop("scrollHeight") && this.isLoading === false){
        // 获取最小值score
        const pickArrScore = this.pickImageData.sort((a,b)=>{ return a.score - b.score });
        // const minScore = this.pickImageData.reduce((min, image) => Math.min(min, image.score), this.pickImageData[0].score);
        // console.log('执行....测试',minScore);
        this.pickParams.setting.score = pickArrScore[14].score;
        this.getPickPaperList();
      }
    })
    this.getPickPaperList();
  },

  methods:{
    formatDateTime,isInMyPapers,paperDownload,
    ...mapActions(paperStore, ["removeToMyPaper"]),
    ...mapActions(appStore, ["setBackgroundImage"]),
    // 下拉菜单切换数据
    pickFilterChange(evt){
      this.pickParams.setting.paperValue = evt;
      this.getPickPaperList();
    },

    // 获取壁纸源数据
    getPickPaperList(){
      const pickFilterValue = this.pickParams.setting.paperValue;
      const api = 'https://api.nguaduot.cn';
      const cate = this.pickParams.setting.cateValue;
      const tabValue = this.pickParams.setting.tabValue.value;
      const no = this.pickParams.setting.no;
      const dateTime = this.pickParams.setting.dateTime;
      const score = this.pickParams.setting.score;
      // wallhaven
      if(pickFilterValue === '/wallhaven/v2'){
        const wallhavenUrl = `${api}${pickFilterValue}?cate=${cate}&order=${tabValue}&no=${no}&date=${dateTime}&score=${score}&client=thisky`;
        this.getAccordingToUrlData(wallhavenUrl);
      }
      // 拾光
      else if(pickFilterValue === '/timeline/v2'){
        const url = `${api}${pickFilterValue}?cate=${cate}&order=${tabValue}&no=${no}&date=${dateTime}&score=${score}&client=thisky`;
        this.getAccordingToUrlData(url);
      }
      // 其他
      else {
        const otherUrl = `${api}${pickFilterValue}?order=${tabValue}&no=${no}&date=${dateTime}&score=${score}&client=thisky`;
        this.getAccordingToUrlData(otherUrl);
      }
    },
    getAccordingToUrlData(url){
      if (!this.isLoading){
        this.isLoading = true;
        axios.get(url)
        .then((res)=>{
         if(res.status === 200){
          let pickImage = res.data.data
          this.count = res.data.count
          let animations = ["ani-gray", "bowen", "ani-rotate"];
          if (pickImage){
            const  mapPickImg = pickImage.map((img)=>{
              if (img.thumburl !== null){
                let randomIndex = Math.floor(Math.random() * animations.length);
                const image = {
                  title: false,src: img.thumburl,path: img.imgurl,
                  resolution: img.size,score: img.score, no: img.no,
                  animations: animations[randomIndex],
                }
                return image;
              }
            })
            this.pickImageData = mapPickImg;
          }
         }
        })
        .catch((error)=>{ console.error(error); })
        .finally(()=>{
          this.$nextTick(() => { this.isLoading = false; });
        })
      }  
    },

    // 菜单回传事件
    updateList(){
      this.getPickPaperList();
    },
    // updateImgData(){
    //   this.getPickPaperList();
    // },

    // 收藏
    addToMy(img) { 
      this.removeToMyPaper(img);
    },

    // 设置壁纸
    setAppPaper(img) {
      message.info('正在为您设置壁纸')
      this.setBackgroundImage(img)
    },

    // 设置系统桌面壁纸
    setDesktopPaper(img){
      this.$xtConfirm('确定将此壁纸设置为系统桌面壁纸？注意，此处设置不是工作台的壁纸。','',{
        index:1020,
        ok: () => {
          message.info('正在为您下载并设桌面壁纸');
          tsbApi.system.setPaper(img.path);
        },
        no: () => {},
        noText: '取消',
        type:'link'
      })
    },

    // 下载壁纸
    download(img){
      if(this.settings.savePath === ''){
        this.$xtConfirm('您尚未设置壁纸保存目录，请设置目录，设置目录后下载将自动开始。','',{
          index:1020,
        ok: async () => { await this.queryStart() },
        no: () => {},
        noText: '取消',
        type:'link'
        })
      }
      else{
        this.doStartDownload(img)
      }
    },
    doStartDownload(item){
      message.info('开始下载壁纸')
      const name = item.path.split('/')
      const fileName  = name[name.length - 1]
      tsbApi.download.start({
        url:item.path,
        savePath: this.settings.savePath + '/static/' + fileName,
        done:(args)=>{
          message.success('壁纸下载完成')
        }
      })
    },
    async queryStart (){
      let savePath = await tsbApi.dialog.showOpenDialog({
        title: '选择目录', message: '请选择下载壁纸的目录', properties: [
          'openDirectory', 'createDirectory',
        ]
      })
      if (savePath) {
        this.settings.savePath = savePath[0]
        this.doStartDownload(this.currentPaper.path)
      }
    },

  },

};
</script>

<style lang="scss" scoped>
.pick-paper{
  &:hover{
    .img-button{
      opacity: 1 !important;
    }
  }
}
.xt-bg-t-3{
  background: rgba(00,00,00, 0.4) !important;
}
:deep(.ant-select-arrow){
  color: var(--primary-text) !important;
}
</style>