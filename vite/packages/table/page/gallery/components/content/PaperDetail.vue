<template>
 <div class="flex items-center justify-start w-full" style="height: calc(100% - 60px);">
  <vue-custom-scrollbar  :settings="settingsScroller" class="h-full w-full">
   <viewer :images="paperList" :options="options" class="px-2.5">
    <a-row :gutter="[20, 20]" id="bingImages">
     <a-col class="image-wrapper" v-for="img in paperList" :span="6"  style="padding-left: 0 !important;padding-right: 12px !important;">
      <img :src="img.thumbPath" :data-source="img.fullPath"  class="image-item pointer relative" />
      <!-- <xt-mix-menu :menus="paperMenus" fn="callBack" @mounted="currentPaperImg = img" >
       <img :src="img.thumbPath" :data-source="img.fullPath"  class="image-item pointer relative" />
       <div class="absolute right-3 top-1 flex">
        <xt-button :w="modalWidth" :h="modalWidth" class="xt-bg-t-2 mr-1" style="border-radius: 8px;" @click="download(img)" >
         <div class="flex items-center justify-center">
          <xt-new-icon icon="fluent:arrow-download-16-regular" :size="isModal ? 16 : 20"></xt-new-icon>
         </div>
        </xt-button>
        <xt-button :w="modalWidth" :h="modalWidth" class="xt-bg-t-2 mr-1" style="border-radius: 8px;" @click="addToMy(img)">
         <div class="flex items-center justify-center">
          <xt-new-icon icon="fluent:star-16-filled" v-if="isInMyPapers(img)" :size="isModal ? 16 : 20" style="color: var(--warning) !important;"></xt-new-icon>
          <xt-new-icon icon="fluent:star-16-regular" v-else :size="isModal ? 16 : 20"></xt-new-icon>
         </div>
        </xt-button>
       </div>
      </xt-mix-menu> -->
     </a-col>
    </a-row>
   </viewer>
  </vue-custom-scrollbar>
 </div>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia';
import { paperStore } from '../../../../store/paper';
import { isInMyPapers } from '../../libs/utils';
import { download } from 'spotlight.js';

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
     newIcon:'mingcute:windows-line',name:'设置桌面壁纸',
     callBack:()=>{  },
    },
    {
     newIcon:'fluent:arrow-download-16-regular',name:'下载壁纸', 
     callBack:()=>{  },
    },
    { 
     newIcon:'fluent:desktop-16-regular',name:'设为工作台背景', 
     callBack:()=>{  },
    }
   ],
  }
 },

 computed:{
  ...mapWritableState(paperStore,['myPapers']),
  modalWidth(){
   if(this.isModal){ return 32;}
   else { return 40; }
  },

 },

 methods:{
  isInMyPapers,
  ...mapActions(paperStore,['removeToMyPaper','addToMyPaper']),
  // 添加收藏
  addToMy(img){
   let image = { path:img.fullPath,src:img.thumbPath }
   this.removeToMyPaper(image)
  },

  download(img){

  },
  

 },
};
</script>

<style lang="scss" scoped>
</style>