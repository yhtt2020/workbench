<template>
  <div class="flex items-center clip-container justify-between pr-5 mx-4">
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
      <div @click="clipSearch"
           class="pointer button-active s-bg h-12 w-12 flex items-center rounded-lg justify-center mr-3">
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

  <!-- 设置右侧弹窗开始 -->
  <a-drawer v-model:visible="setShow" title="设置" width="500" placement="right">
    <div class="flex items-center justify-between mb-6">
      <div class="flex flex-col">
        <span class="mb-2 plain-font">剪贴板</span>
        <span class="light-grey-font">关闭后将停止读取剪贴板内容</span>
      </div>
      <a-switch v-model:checked="enable"/>
    </div>
    <span class="plain-font">打开剪贴板应用快捷键</span>
    <div class="flex items-center my-6">
      <span class="mr-3 shortcut-area px-3 py-2.5 rounded-lg">{{ instruct }}</span>
      <span class="px-4 py-3 set-button pointer rounded-lg mr-3">更换按键</span>
      <span class="px-4 py-3 set-button pointer rounded-lg">重置</span>
    </div>
    <span class="plain-font pb-6">历史记录容量</span>
    <HorizontalPanel class="mt-6 mb-6" :navList="historyCapacity" bg-color="drawer-item-select-bg"
                     v-model:selectType="defaultCapacity"></HorizontalPanel>
    <div class="w-full flex items-center plain-font set-button pointer justify-center rounded-lg py-3">清除剪贴板记录
    </div>
  </a-drawer>
  <!-- 设置右侧弹窗结束 -->


  <HorizontalDrawer ref="clipRef" :rightSelect="cutType" @getArea="getClipItem"></HorizontalDrawer>

  <!-- 搜索右侧抽屉开始 -->
  <a-drawer :width="500" v-model:visible="drawerVisible" title="搜索" placement="right">
    <a-input placeholder="搜索" class="no-drag h-10 w-full" v-model:value="searchData">
      <template #prefix>
        <Icon icon="sousuo"></Icon>
      </template>
    </a-input>
  </a-drawer>
 <!-- 搜索右侧抽屉结束 -->

</template>

<script>
import HorizontalPanel from '../../components/HorizontalPanel.vue';
import HorzontanlPanelIcon from '../../components/HorzontanlPanelIcon.vue'
import HorizontalDrawer from '../../components/HorizontalDrawer.vue';
import TabSwitching from '../../components/TabSwitching.vue';
import AllClipFile from './allClipFile.vue';
import {Empty} from 'ant-design-vue';
import {mapWritableState,mapActions} from "pinia";
import {clipboardStore} from "../../store/clipboard";
import _ from 'lodash-es'

// 引入模拟数据 后期对接数据需要删除 以免影响测试
import { fileList } from '../../js/data/clipboardData';

export default {
  name: 'Clipboard',
  components: {
    HorzontanlPanelIcon,
    TabSwitching,
    HorizontalPanel,
    HorizontalDrawer,
    AllClipFile
  },
  data() {
    return {
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
      // 控制设置抽屉打开
      setShow: false,

      instruct: 'CTRL + ALT + V',

      historyCapacity: [
        {title: '1天', name: 'day'},
        {title: '1周', name: 'week'},
        {title: '1月', name: 'month'},
        {title: '不限制', name: 'unlimited'}
      ],

      defaultCapacity: {title: '1天', name: 'day'},

      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true
      },

      simpleImage: '/public/img/test/not-data.png',

      drawerVisible: false,

      searchData: '' //搜索
    }
  },
  computed: {
    ...mapWritableState(clipboardStore, ['enable', 'clipboardObserver','items']),
    clipContent(){
      switch(this.defaultCutType.typename){
        case 'all': // 默认全部
          return this.items;
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
           return fileList   // 方便页面搭建暂时使用fileList这个列表,后期视情况而定
        case 'video': // 筛选视频
          break;
        case 'audio': // 筛选音频
          break;
      }
    }
  },
  methods: {
    ...mapActions(clipboardStore,['start','stop','isRunning','prepare']),
    //打开设置操作
    openSet() {
      this.setShow = true
    },
    openClipType() {
      this.$refs.clipRef.openDrawer()
    },
    getClipItem(v) {
      this.defaultCutType = v
    },
    clipSearch() {
      this.drawerVisible = true
    },

  },
  watch: {
    'enable': {
      handler(newVal, oldVal) {
        console.log('剪切板开关',newVal)
        if (newVal) {
          this.prepare()
          this.start()
        } else {
          if (this.clipboardObserver) {
            if (this.isRunning()) {
              this.stop()
            }
          }
        }
      }
    },
    // 监听导航栏筛选切换
    'defaultCutType': {
      handler() {
        this.defaultCutType = this.defaultCutType
      },
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.light-grey-font {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.60);
  font-weight: 500;
}

.plain-font {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
}

.set-button {
  background: #2A2A2A;
}

.shortcut-area {
  background: #2A2A2A;
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 227px;
}

.button-active {
  &:active {
    filter: brightness(0.8);
    background: rgba(42, 42, 42, 0.25);
  }

  &:hover {
    background: rgba(42, 42, 42, 0.25);
  }
}

.s-bg {
  box-shadow: none !important;
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
