<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center justify-center">
        <xt-new-icon icon="fluent:image-multiple-16-regular" size="20" class="mr-2" style="color:var(--active-text) !important;"></xt-new-icon>
        <span class="xt-font xt-text font-400" :class="isModal ? 'font-14':'font-16'">拾光壁纸</span>
      </div>
      <div class="flex items-center justify-center">
        <xt-select :list="pickParams.paperSelect" v-model="pickParams.setting.paperValue" style="width: 140px;margin-right: 12px;text-align: center;" 
        :h="isModal ? 32 : 40" :borderClass="'rounded-md'" :border="false" @change="pickFilterChange($event)"/>
        <xt-dropdown :w="isModal ? 32 : 40" :h="isModal ? 32 : 40"  :iconSize="isModal ? 20 : 24" :placement="'bottomRight'" :buttonClass="'xt-active-bg'" 
        :newIcon="'fluent:filter-16-regular'" :class="isModal ? 'mr-3':''"  @visible-change="getPickPaperList">
          <PickDropDetail :isModal="isModal" @emitPick="updateList" @emitPaper="updateImgData"/>
        </xt-dropdown>
        <ClosePaperButton v-if="isModal"/>
      </div>
    </div>

    <div class="flex-1" style="height: calc(100% - 100px);">
      <template v-if="isLoading">
        <div style="display: flex; align-items: center; justify-content: center;" >
          <a-spin  />
        </div>
      </template>
      <template v-else>
        <vue-custom-scrollbar  :settings="settingsScroller" style="height: 100%" id="pickWrapper" ref="pickWallpaperRef">
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
                <!-- -->
              </a-col>
            </a-row>
          </viewer>
          <div style="height:16px;"></div> 
        </vue-custom-scrollbar>
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia';
import { pickPaperStore } from './store/PickPaperStore';
import { paperStore } from "../../store/paper";
import axios from 'axios';
import { formatDateTime } from './libs/utils';

import ClosePaperButton from './components/close/ClosePaperButton.vue';
import PickDropDetail from './components/content/PickDropDetail.vue';


export default {
  name:'Picking',

  props:['isModal'],

  components:{
    ClosePaperButton,PickDropDetail,
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
        callBack:()=>{  } 
        // this.setAppPaper(this.paperCurrent)
       },
       { 
        newIcon:'mingcute:windows-line',name:'设置桌面壁纸',
        callBack:()=>{   } 
        // this.setDesktopPaper(this.paperCurrent)
       },
       {
        newIcon:'fluent:arrow-download-16-regular',name:'下载壁纸',
        callBack:()=>{  } 
        // this.download(this.paperCurrent)
       },
      ]
    }
  },

  computed:{
    ...mapWritableState(pickPaperStore,['pickParams']),
  },

  mounted(){

    if(this.isModal){
      document.querySelector('.ant-select-selection-item').style = 'line-height:32px !important;height:30px !important;'
    }
    this.getWallHeavenClass();
    this.getPickLightClass();
    this.getPickPaperList();
   

    // $("#pickWrapper").scroll(()=>{
    //   console.log('111');
    //   // console.log('执行....测试',$(".pick-wrapper").scrollTop(),$(".pick-wrapper").height(),$("#pick-images").prop("scrollHeight"));
    //   // if ($("#pick-wrapper").scrollTop() + $("#pick-wrapper").height() + 20 >= $("#pick-images").prop("scrollHeight") && this.isLoading === false) {
    //   //   const newTime = new Date()
    //   //   console.log('执行....测试',this.formatDateTime(newTime));
    //   //   // this.pickParams.setting.dateTime = this.formatDateTime(newTime);

    //   // }
    // })
  },

  methods:{
    ...mapActions(pickPaperStore,['getPickLightClass','getWallHeavenClass']),
    formatDateTime,
    // 下拉菜单切换数据
    pickFilterChange(evt){
      this.pickParams.setting.paperValue = evt;
      this.getPickPaperList();
    },

    // 获取壁纸源数据
    getPickPaperList(){
      console.log('执行....调试',this.pickParams.setting);
      const pickFilterValue = this.pickParams.setting.paperValue;
      const api = 'https://api.nguaduot.cn';
      const cate = this.pickParams.setting.cateValue;
      const tabValue = this.pickParams.setting.tabValue.value;
      const no = this.pickParams.setting.no;
      const dateTime = this.pickParams.setting.dateTime;
      const score = this.pickParams.setting.score;
      if(pickFilterValue === '/wallhaven/v2'){
        const wallhavenUrl = `${api}${pickFilterValue}?order=${tabValue}&no=${no}&date=${dateTime}&score=${score}&client=thisky`;
        this.getAccordingToUrlData(wallhavenUrl);
      }
      else {
        const url = `${api}${pickFilterValue}?cate=${cate}&order=${tabValue}&no=${no}&date=${dateTime}&score=${score}&client=thisky`;
        console.log('执行....调试1',url);
        this.getAccordingToUrlData(url);
      }
    },
    // 根据url获取数据
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
         console.log('执行....获取数据',this.pickImageData);
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
    updateImgData(){
      this.getPickPaperList();
    },
    

    
  },

};
</script>

<style lang="scss" scoped>
</style>