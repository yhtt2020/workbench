<template>
  <vue-custom-scrollbar :settings="settingsScroller" class="grow shrink" style="height: 100%;">
   <div style="height: 8px;"></div>

   <template v-if="isModal">
    <div class="w-full flex flex-col items-center justify-center">
      <!-- 应用模式 -->
      <div class="card  p-4 flex flex-col xt-bg-2 mb-4" hidden="">
        <span class="xt-text xt-font font-16 font-400">应用模式</span>
        <span class="xt-text-2 xt-font font-14 font-400">  选择应用打开方式，进入主应用或以窗口模式打开；部分应用在窗口模式下功能较为精简。 </span>
      </div>


      <!-- 壁纸存储位置 -->
      <div class="card p-4 flex flex-col xt-bg-2 mb-4">
       <span class="xt-text xt-font font-16 font-400">壁纸存储位置</span>
       <span class="xt-text-2 xt-font font-14 font-400 my-3">选择我的收藏壁纸存储的文件路径。</span>
       <div class="flex">
        <a-input placeholder="请选择壁纸保存地址" class="h-10" @click="showSaveDialog" 
         style="background: var(--secondary-transp-bg);border-radius: 8px;cursor: pointer;width: 92%;"  
         spellcheck="false" v-model:value="settings.savePath"  :bordered="false"
        />
        <xt-button w="40" h="40" class="xt-bg-t-2 ml-2" @click="openSavePath">
         <div class="flex items-center justify-center">
           <xt-new-icon icon="fluent:open-16-regular" size="20"></xt-new-icon>
         </div>
        </xt-button>
       </div>

      </div>


      <!-- 设置基础配置项 -->
      <div class="card p-4 flex flex-col xt-bg-2 mb-4">
        <div class="flex flex-col">
          <div class="flex w-full justify-between mb-2.5">
           <span class="xt-font xt-text text-start font-16 font-400">使用锁屏壁纸</span>
           <a-switch v-model:checked="settings.enable"></a-switch>
          </div>
          <span class="xt-font xt-text-2 font-14 text-start font-400">工作台无操作一定时间后进入锁屏状态。</span>
        </div>
        <a-divider  style="height: 1px; border-top: 1px solid var(--divider);margin: 16px 0 16px 0 ;" />

        <div class="flex flex-col ">
          <span class="xt-font xt-text font-16 text-start font-400">锁屏壁纸源</span>
          <span class="xt-font xt-text-2 font-14 font-400 text-start my-2.5">选择锁屏时展示的壁纸。</span>
          <xt-select v-model="settings.wallSource" :list="selectList" class="text-center"></xt-select>
        </div>
        <a-divider  style="height: 1px; border-top: 1px solid var(--divider);margin: 16px 0 16px 0 ;" />

        <div class="flex w-full flex-col">
          <span class="xt-font xt-text text-start font-16 font-400">进入锁屏时间</span>
          <span class="xt-font xt-text-2 font-14 text-start font-400 my-2.5">设置进入锁屏的时间。</span>
          <div class="flex items-center">
            <a-input-number   spellcheck="false" default-value="3" v-model:value="settings.lockTimeout" 
            style="width: 210px;background: var(--secondary-transp-bg);border-radius: 8px;" :bordered="false"   />
            <span class="ml-2 xt-font xt-text font-14 font-400">秒</span>
          </div>
        </div>
        <a-divider  style="height: 1px; border-top: 1px solid var(--divider);margin: 16px 0 16px 0 ;" />

        <div class="flex w-full flex-col ">
          <span class="xt-font xt-text font-16 font-400">锁屏壁纸轮播时间</span>
          <span class="xt-font xt-text-2 font-14 font-400 my-2.5">设置每张壁纸图片的之间的轮播间隔。</span>
          <div class="flex items-center">
            <a-input-number default-value="3" v-model:value="settings.interval" 
            style="width: 210px;background: var(--secondary-transp-bg);border-radius: 8px;" :bordered="false"   spellcheck="false"/>
            <span class="ml-2 xt-font xt-text font-14 font-400">秒</span>
          </div>
        </div>
        <a-divider  style="height: 1px; border-top: 1px solid var(--divider);margin: 16px 0 16px 0 ;" />

        <div class="flex flex-col">
          <div class="flex w-full justify-between mb-2.5">
           <span class="xt-font xt-text font-16 font-400">在状态栏显示锁屏时间提示</span>
           <a-switch v-model:checked="settings.tipLock"></a-switch>
          </div>
          <span class="xt-font xt-text-2 font-14 font-400">在状态栏右侧显示还有多久进入锁屏。</span>
        </div>
      </div>


      <!-- 锁屏设置开关 -->
      <div class="card p-4 flex flex-col xt-bg-2">
        <div class="flex w-full justify-between mb-2.5">
          <span class="xt-font xt-text font-16 font-400">锁屏界面显示时间</span>
          <a-switch v-model:checked="settings.showTime"></a-switch>
        </div>
        <a-divider  style="height: 1px; border-top: 1px solid var(--divider);margin: 16px 0 16px 0 ;" />

        <div class="flex w-full justify-between mb-2.5">
          <span class="xt-font xt-text font-16 font-400">锁屏界面显示未读消息</span>
          <a-switch v-model:checked="settings.showUnreadMessage"></a-switch>
        </div>
        <a-divider  style="height: 1px; border-top: 1px solid var(--divider);margin: 16px 0 16px 0 ;" />

        <div class="flex w-full justify-between mb-2.5">
          <span class="xt-font xt-text font-16 font-400">锁屏界面显示天气</span>
          <a-switch v-model:checked="settings.showWeather"></a-switch>
        </div>
        <a-divider  style="height: 1px; border-top: 1px solid var(--divider);margin: 16px 0 16px 0 ;" />
         
        <div class="flex w-full justify-between">
          <span class="xt-font xt-text font-16 font-400">锁屏界面显示媒体播放状态</span>
          <a-switch v-model:checked="settings.showProgress"></a-switch>
        </div>
      </div>
    </div>
   </template>

   <template v-else>
    <div class="flex items-center justify-center w-full">
      <div class="flex flex-wrap items-start justify-center min-width:800px;">
        <div style="flex: 1 0 50%; min-width: 468px;" class="flex items-center flex-col justify-center">
          <!-- 应用模式 -->
          <div class="card  p-4 flex flex-col xt-bg-2 mb-4" hidden="">
           <span class="xt-text text-start xt-font font-16 font-400">应用模式</span>
           <span class="xt-text-2 xt-font text-start font-14 font-400">  选择应用打开方式，进入主应用或以窗口模式打开；部分应用在窗口模式下功能较为精简。 </span>
          </div>

          <!-- 设置基础配置项 -->
          <div class="card p-4 flex flex-col   xt-bg mb-4">
            <span class="w-full xt-text xt-font text-start font-16 font-400">壁纸存储位置</span>
            <span class="w-full xt-text-2 text-start xt-font font-14 font-400 my-3">选择我的收藏壁纸存储的文件路径。</span>
            <div class="flex">
              <a-input placeholder="请选择壁纸保存地址" class="h-10" @click="showSaveDialog" 
               style="background: var(--secondary-transp-bg);border-radius: 8px;cursor: pointer;width: 92%;"  
               spellcheck="false" v-model:value="settings.savePath"  :bordered="false"
              />
              <xt-button w="40" h="40" class=" ml-2" @click="openSavePath">
               <div class="flex items-center justify-center">
                 <xt-new-icon icon="fluent:open-16-regular" size="20"></xt-new-icon>
               </div>
              </xt-button>
            </div>
            
          </div>

          <!-- 锁屏设置开关 -->
          <div class="card p-4 flex flex-col justify-start xt-bg max-card" >
            <div class="flex w-full justify-between mb-2.5">
              <span class="xt-font xt-text font-16 font-400">锁屏界面显示时间</span>
              <a-switch v-model:checked="settings.showTime"></a-switch>
            </div>
            <a-divider  style="height: 1px; border-top: 1px solid var(--divider);margin: 16px 0 16px 0 ;" />

            <div class="flex w-full justify-between mb-2.5">
              <span class="xt-font xt-text font-16 font-400">锁屏界面显示未读消息</span>
              <a-switch v-model:checked="settings.showUnreadMessage"></a-switch>
            </div>
            <a-divider  style="height: 1px; border-top: 1px solid var(--divider);margin: 16px 0 16px 0 ;" />

            <div class="flex w-full justify-between mb-2.5">
              <span class="xt-font xt-text font-16 font-400">锁屏界面显示天气</span>
              <a-switch v-model:checked="settings.showWeather"></a-switch>
            </div>
            <a-divider  style="height: 1px; border-top: 1px solid var(--divider);margin: 16px 0 16px 0 ;" />
   
            <div class="flex w-full justify-between">
              <span class="xt-font xt-text font-16 font-400">锁屏界面显示媒体播放状态</span>
              <a-switch v-model:checked="settings.showProgress"></a-switch>
            </div>
          </div>
        </div>

        <div style="flex: 1 0 50%; min-width: 468px;" class="flex items-center flex-col justify-center">
          <!-- 设置基础配置项 -->
          <div class="card p-4 flex flex-col   xt-bg mb-4 ">
            <div class="flex flex-col justify-start">
              <div class="flex w-full justify-between mb-2.5">
               <span class="xt-font xt-text font-16 font-400">使用锁屏壁纸</span>
               <a-switch v-model:checked="settings.enable"></a-switch>
              </div>
              <span class="xt-font xt-text-2 font-14 text-start font-400">工作台无操作一定时间后进入锁屏状态。</span>
            </div>
            <a-divider  style="height: 1px; border-top: 1px solid var(--divider);margin: 16px 0 16px 0 ;" />

            <div class="flex flex-col ">
              <span class="xt-font text-start xt-text font-16 font-400">锁屏壁纸源</span>
              <span class="xt-font text-start xt-text-2 font-14 font-400 my-2.5">选择锁屏时展示的壁纸。</span>
              <xt-select v-model="settings.wallSource" :list="selectList" @change="getPaper($event)"></xt-select>
            </div>
            <a-divider  style="height: 1px; border-top: 1px solid var(--divider);margin: 16px 0 16px 0 ;" />

            <div class="flex flex-col">
              <span class="xt-font text-start xt-text font-16 font-400">进入锁屏时间</span>
              <span class="xt-font xt-text-2 text-start font-14 font-400 my-2.5">设置进入锁屏的时间。</span>
              <div class="flex items-center">
              <a-input-number default-value="3"  v-model:value="settings.lockTimeout" 
               style="width: 210px;background: var(--secondary-transp-bg);border-radius: 8px;" :bordered="false"    spellcheck="false"
              />
              <span class="ml-2 xt-font xt-text  font-14 font-400">秒</span>
              </div>
            </div>
            <a-divider  style="height: 1px; border-top: 1px solid var(--divider);margin: 16px 0 16px 0 ;" />

            <div class="flex flex-col">
              <span class="xt-font text-start xt-text font-16 font-400">锁屏壁纸轮播时间</span>
              <span class="xt-font xt-text-2 text-start font-14 font-400 my-2.5">设置每张壁纸图片的之间的轮播间隔。</span>
              <div class="flex items-center">
              <a-input-number default-value="3" v-model:value="settings.interval" 
               style="width: 210px;background: var(--secondary-transp-bg);border-radius: 8px;" :bordered="false"  spellcheck="false" 
              />
              <span class="ml-2 xt-font xt-text font-14 font-400">秒</span>
              </div>
            </div>
            <a-divider  style="height: 1px; border-top: 1px solid var(--divider);margin: 16px 0 16px 0 ;" />

            <div class="flex flex-col">
              <div class="flex w-full justify-between mb-2.5">
               <span class="xt-font text-start xt-text font-16 font-400">在状态栏显示锁屏时间提示</span>
               <a-switch v-model:checked="settings.tipLock"></a-switch>
              </div>
              <span class="xt-font xt-text-2 text-start font-14 font-400">在状态栏右侧显示还有多久进入锁屏。</span>
            </div>

          </div>

          <!-- 锁屏设置开关 -->
          <div class="card p-4 flex flex-col justify-start xt-bg min-card" >
            <div class="flex w-full justify-between mb-2.5">
              <span class="xt-font xt-text font-16 font-400">锁屏界面显示时间</span>
              <a-switch v-model:checked="settings.showTime"></a-switch>
            </div>
            <a-divider  style="height: 1px; border-top: 1px solid var(--divider);margin: 16px 0 16px 0 ;" />

            <div class="flex w-full justify-between mb-2.5">
              <span class="xt-font xt-text font-16 font-400">锁屏界面显示未读消息</span>
              <a-switch v-model:checked="settings.showUnreadMessage"></a-switch>
            </div>
            <a-divider  style="height: 1px; border-top: 1px solid var(--divider);margin: 16px 0 16px 0 ;" />
   
            <div class="flex w-full justify-between mb-2.5">
              <span class="xt-font xt-text font-16 font-400">锁屏界面显示天气</span>
              <a-switch v-model:checked="settings.showWeather"></a-switch>
            </div>
            <a-divider  style="height: 1px; border-top: 1px solid var(--divider);margin: 16px 0 16px 0 ;" />
   
            <div class="flex w-full justify-between">
              <span class="xt-font xt-text font-16 font-400">锁屏界面显示媒体播放状态</span>
              <a-switch v-model:checked="settings.showProgress"></a-switch>
            </div>
          </div>

        </div>
      </div>
    </div>
   </template>
   
   <div style="height: 16px;"></div>
  </vue-custom-scrollbar>
 
 </template>
 
 <script>
 import { mapActions,mapWritableState } from 'pinia';
 import { paperStore } from '../../../../store/paper';
 import { startApp } from '../../../../ui/hooks/useStartApp';
 
 import RadioTab from '../../../../components/RadioTab.vue';
 
 export default {
  props:['isModal'],
 
  components:{
   RadioTab
  },
 
  data(){
   return{
    settingsScroller: {
     useBothWheelAxes: true,
     swipeEasing: true,
     suppressScrollY: false,
     suppressScrollX: true,
     wheelPropagation: true
    },
 
    selectList:[
     { value:'my',name:'我的收藏(全部)' },
     { value:'myActive',name:'我的收藏(仅选中)' },
     { value:'recommend',name:'精选壁纸' },
     { value:'bing',name:'必应壁纸' },
     { value:'picking',name:'拾光壁纸' },
    ],
   }
  },
 
  computed:{
   ...mapWritableState(paperStore,['settings']),
   pageSize(){
     console.log('执行....测试',window.innerWidth);
   }
  },
 
  methods:{
   startApp,
   async showSaveDialog() {
    let savePath = await tsbApi.dialog.showOpenDialog({
     title: '选择目录', message: '请选择下载壁纸的目录', 
     properties: [ 'openDirectory', 'createDirectory',]
    })
    if (savePath) return this.settings.savePath = savePath[0];
   },
 
   getPaper(evt){
    if(evt === 'my'){
      this.settings.playType = 'my'
    }
    else if(evt === 'myActive'){
      this.settings.playType = 'active'
    }
    this.$emit('updatePaper',evt)
   },


   // 打开指定文件夹
   openSavePath(){
      if(this.settings.savePath !== ''){
        this.startApp('tableApp',this.settings.savePath);
      }
   },
  },
 
 };
 </script>
 
 <style lang="scss" scoped>
 .card{
  width: 452px;
 }
 
 :deep(.ant-input){
  color: var(--secondary-text) !important;
  font-size: 16px !important;
  &::placeholder{
    color: var(--secondary-text) !important;
    font-size: 16px !important;
  }
 }
 :deep(.ant-select .ant-select-selector){
  height:40px !important;
  border-top-left-radius: 8px !important;
  border-bottom-left-radius: 8px !important;
  background: var(--primary-bg) !important;
 }
 :deep(.ant-select-selection-item){
  line-height: 40px !important;
 }
 
 :deep(.nav-box){
  border-radius: 8px !important;
 }
 
 :deep(.ant-input-number-input){
   height: 40px !important;
 }
 
 
 @media screen and(max-width: 1170px) {
   .min-card{
     display: block !important;
   }
   .max-card{
     display: none !important;
   }
 }
 
 @media screen and(min-width: 1171px) {
   .min-card{
     display: none !important;
   }
   .max-card{
     display: block !important;
   }
 }
 </style>