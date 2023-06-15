<template>
  <div class="flex items-center clip-container justify-between mx-4">
    <div class="flex">
      <!-- tab切换开始 -->
        <HorzontanlPanelIcon :navList="clipType" v-model:selectType="defaultClipType" class="mr-3"></HorzontanlPanelIcon>
      <!-- tab切换结束 -->

      <!-- 导航栏筛选开始 -->
      <TabSwitching :navList="cutType" v-model:activeType="defaultCutType"></TabSwitching>
      <div class="all-button" style="display: none;">
        <div class="flex items-center s-bg button-active p-3 pointer rounded-md mr-3" @click="openClipType">
          <Icon :icon="defaultCutType.icon" style="font-size:1.5em;"></Icon>
          <span class="ml-1">{{ defaultCutType.title }}</span>
        </div>
      </div>
      <!-- 导航栏筛选结束 -->
    </div>

    <!-- 搜索按钮和设置按钮开始 -->
    <div class="flex">
      <div @click="clipSearch" class="pointer button-active s-bg h-12 w-12 flex items-center rounded-lg justify-center mr-3">
        <Icon icon="sousuo" style="font-size: 1.5em;"></Icon>
      </div>
      <div class="pointer button-active s-bg h-12 w-12 flex items-center rounded-lg justify-center" @click="openSet">
        <Icon icon="shezhi" style="font-size: 1.5em;"></Icon>
      </div>
    </div>
    <!-- 搜索按钮和设置按钮结束 -->
  </div>

  <!-- 剪贴板列表展示区域开始 -->
  <vue-custom-scrollbar @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" class="mx-4 my-2 py-4">
    <div v-if="defaultClipType.name === 'collect'">
      <div class="flex items-center justify-center">
        <a-empty :image="simpleImage"/>
      </div>
    </div>
    <AllClipFile :clipList="clipContent" v-else></AllClipFile>
  </vue-custom-scrollbar>
  <!-- 剪贴板列表展示区域结束 -->

  <!-- 导航切换在宽度不够的情况下显示 -->
  <HorizontalDrawer ref="clipRef" :rightSelect="cutType" @getArea="getClipItem"></HorizontalDrawer>

  <!-- 搜索右侧抽屉开始 -->
   <a-drawer :width="500" v-model:visible="drawerVisible" title="搜索" placement="right">
    <div class="flex mb-3">
      <a-input placeholder="输入关键词" class="no-drag h-10 w-full" v-model:value="searchData"></a-input>
      <div class="h-10 w-24 ml-3 s-item pointer flex items-center justify-center rounded-lg" @click="clickSearch" style="background: var(--secondary-bg);">
        搜索
      </div>
    </div>
    <span class="search-text">支持输入文本关键词、文件名称搜索</span>
   </a-drawer>
  <!-- 搜索右侧抽屉结束 -->

  <!-- 设置弹窗 -->
  <ClipSetDrawer ref="clipDrawer"></ClipSetDrawer>
</template>

<script>

import HorzontanlPanelIcon from '../../components/HorzontanlPanelIcon.vue'
import HorizontalDrawer from '../../components/HorizontalDrawer.vue';
import TabSwitching from '../../components/TabSwitching.vue';
import AllClipFile from './allClipFile.vue';
import ClipSetDrawer from '../../components/clipPreview/ClipSetDrawer.vue';
import {Empty} from 'ant-design-vue';
import {mapWritableState,mapActions} from "pinia";
import {clipboardStore} from "../../store/clipboard";
import _ from 'lodash-es'

// 引入模拟数据 后期对接数据需要删除 以免影响测试
import { fileList, videoList, audioList } from '../../js/data/clipboardData';

export default{
  name: 'Clipboard',

  components: {
    HorzontanlPanelIcon,
    TabSwitching,
    HorizontalDrawer,
    AllClipFile,
    ClipSetDrawer
  },

  data(){
    return{
      // 历史和收藏切换数组
      clipType: [
        {title: '剪贴板历史', icon: 'time-circle', name: 'history'},
        {title: '收藏', icon: 'star', name: 'collect'}
      ],
      // 历史和收藏切换数组默认值
      defaultClipType: {title: '剪贴板历史', icon: 'time-circle', name: 'history'},
    
      // 导航栏筛选分类
      cutType: [
        {title: '全部', icon: 'appstore', typename: 'all',name:'全部'},
        {title: '文本', icon: 'text-align-left', typename: 'text',name:'文本'},
        {title: '图片', icon: 'image', typename: 'image',name:'图片'},
        {title: '文件', icon: 'file', typename: 'file',name:'文件'},
        {title: '视频', icon: 'video', typename: 'video',name:'视频'},
        {title: '音频', icon: 'erji1', typename: 'audio',name:'音频'}
      ],
      // 导航栏筛选分类默认值
      defaultCutType: {title: '全部', icon: 'appstore', name: '全部',typename:'all'},

      // 空状态
      simpleImage: '/public/img/test/not-data.png',

      //搜索
      searchData: '', 

      // 控制搜索弹窗
      drawerVisible: false,

      // 滚动配置
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true
      },
    }
  },

  computed:{
    ...mapWritableState(clipboardStore, ['clipboardObserver','items']),
    // 根据剪贴板列表不同状态进行数据显示
    clipContent(){
      switch(this.defaultCutType.typename){
        case 'all': // 默认全部
          if(this.items.length !== 0){
            return this.items;    
          }
          break;
        case 'text':   // 筛选文本
          if(this.items.length !== 0){
            const list = _.filter(this.items, function(o) { return  o.type === 'text' });
            return list
          }
          break;
        case 'image':  // 筛选图片
          if(this.items.length !== 0){
            const list = _.filter(this.items,function(o) { return  o.type === 'image' })
            console.log(list);
            return list
          }
          break;
        case 'file':  // 筛选文件  
          if(this.items.length !== 0){
            return fileList   // 方便页面搭建暂时使用fileList这个列表,后期视情况而定
          }
          break;
        case 'video': // 筛选视频
          if(this.items.length !== 0) {
            return videoList  // 方便页面搭建暂时使用videoList这个列表,后期视情况而定
          }
          break
        case 'audio': // 筛选音频
          if(this.items.length !== 0){
           return audioList
          }
          break;
      }
    }
  },

  methods:{
    // 打开导航栏切换
    openClipType() {
      this.$refs.clipRef.openDrawer()
    },
    // 切换导航栏
    getClipItem(v) {
      console.log(v);
      this.defaultCutType = v
    },
    // 打开搜索入口
    clipSearch() {
      this.drawerVisible = true
    },
    // 打开设置入口
    openSet(){
      this.$refs.clipDrawer.clipOpenShow()
    }
  },

  watch:{
    // 监听导航栏筛选切换
    'defaultCutType': {
      handler() {
        this.defaultCutType = this.defaultCutType
      },
      immediate: true,
    },
  }
}
</script>

<style lang="scss" scoped>
.button-active {
  &:active {
    filter: brightness(0.8);
    opacity: 0.8;
  }

  &:hover {
    opacity: 0.8;
  }
}

.search-text{
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: var(--primary-text);
  font-weight: 400;
}
.s-bg {
  box-shadow: none !important;
  background: var(--main-bg);
  color: var(--primary-text);
}

@media screen and (max-width: 1064px) {
  :deep(.tab-item) {
    display: none !important;
  }
  .clip-container {
    justify-content: start !important;
  }
  .all-button {
    display: block !important;
  }
}
</style>
