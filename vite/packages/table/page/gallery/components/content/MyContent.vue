<template>
  <vue-custom-scrollbar id="containerWrapper" :settings="settingsScroller" class="grow shrink" style="height: 100%;">
   <viewer :images="myPaperList" :options="options" class="px-2.5">
    <a-row :gutter="[20, 20]" id="bingImages">
     <a-col class="image-wrapper" v-for="img in myPaperList" :span="6">
       <template v-if="rightModel !== 'default'">
         <xt-menu :menus="myMenus" name="name" @contextmenu.prevent="myCurrentID = img">
           <img :src="fileImageExtension(img) ? img.path : img.src" :data-source="img.path" :alt="img.resolution"   class="image-item pointer relative"/>
           <div v-if="fileImageExtension(img)" @click="previewVideo(img)"  class="play-icon flex items-center justify-center pointer" style="">
            <MyContentIcon icon="fluent:play-16-filled" style="font-size: 1.8rem;"/>
           </div>
           <div class="absolute" style="top: 4px; left:16px;">
            <xt-button w="32" h="32" class="xt-bg-t-2" style="border-radius: 8px;" @click="addToActive(img)" >
              <a-checkbox :checked="isInActive(img)"></a-checkbox>
            </xt-button>
            <!-- <div class="bottom-actions rounded-xl pointer" @click.stop="addToActive(img)"  :style="{ background: isInActive(img) ? 'rgba(255,0,0,0.66)' : '' }">
             <Icon v-if="!isInActive(img)" icon="tianjia1"></Icon>
             <Icon v-else icon="yiwancheng"></Icon>
            </div> -->
           </div>
         </xt-menu>
       </template>
 
       <template v-else>
         <img @contextmenu.stop="openSetting(img)" :src="fileImageExtension(img) ? img.path : img.src" :data-source="img.path" :alt="img.resolution"   class="image-item pointer relative"/>
         <div v-if="fileImageExtension(img)" @click="previewVideo(img)"  class="play-icon flex items-center justify-center pointer" style="">
           <MyContentIcon icon="fluent:play-16-filled" style="font-size: 1.8rem;"/>
         </div>
         
         <div class="absolute right-0 p-2.5" style="top: -10px;">
          <xt-button w="32" h="32" class="xt-bg-t-2" style="border-radius: 8px;" @click="addToActive(img)" >
            <a-checkbox :checked="isInActive(img)"></a-checkbox>
          </xt-button>
          
          <!-- <div class="bottom-actions pointer" @click.stop="addToActive(img)"  :style="{ background: isInActive(img) ? 'rgba(255,0,0,0.66)' : '' }">
           <Icon v-if="!isInActive(img)" icon="tianjia1"></Icon>
           <Icon v-else icon="yiwancheng"></Icon>
          </div> -->
         </div>
       </template>
     
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
         newIcon:'',name:'设置桌面壁纸',
         callBack:()=>{} 
       },
       {
         newIcon:'fluent:arrow-download-16-regular',name:'下载壁纸',
         callBack:()=>{} 
       },
       { 
         newIcon:'fluent:delete-16-regular',name:'删除该壁纸',
         callBack:()=>{
          this.delCurrentPaper();
         } 
       },
       { 
         newIcon:'',name:'设为工作台背景',
         callBack:()=>{} 
       },
      ]
     }
   },
 
   computed:{
     ...mapWritableState(useWidgetStore,['rightModel']),
   },
 
   methods:{
    fileImageExtension,isInActive,
    ...mapActions(paperStore,['addToActive']),
    // 开启壁纸设置
    openSetting(item){ 
     if(this.rightModel === 'default'){
       this.$emit('paperSetting',item);
     }
    },
    // 播放动态壁纸
    previewVideo(img){
     this.$emit('playPaperVideo',img);
    },
 
    // 删除壁纸
    delCurrentPaper(){
      console.log('执行....',this.myCurrentID);
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