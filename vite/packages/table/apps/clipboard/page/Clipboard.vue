<template>
  <div class="flex items-center clip-container justify-between mx-4 my-4">
    <div class="flex">
      <!-- tab切换开始 -->
      <HorzontanlPanelIcon :navList="clipType" v-model:selectType="tab" class="mr-3"></HorzontanlPanelIcon>
      <!-- tab切换结束 -->

      <!-- 导航栏筛选开始 -->
      <TabSwitching :navList="filterList" v-model:activeType="currentFilter"></TabSwitching>
      <div class="all-button" style="display: none;">
        <div class="flex items-center s-bg button-active p-3 pointer rounded-md mr-3" @click="openClipType">
          <Icon :icon="currentFilter.icon" style="font-size:1.5em;"></Icon>
          <span class="ml-1">{{ currentFilter.title }}</span>
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

  <div v-if="this.searchWords" class="xt-bg pointer rounded-full p-2 text-center xt-text mx-10" @click="drawerVisible=true">
    关键词：{{this.searchWords}} <close-circle-filled class="ml-3" @click.stop="this.searchWords='';this.doSearch()" />
  </div>
  <!-- 剪切板列表展示区域开始 -->
  <div v-if="isWin()">
    <div class="xt-bg-2 rounded-lg p-4 px-5 w-auto m-auto" v-if="!settings.enable">
      <div class="float-left mr-2 pt-1" ><iconify style="font-size: 18px;vertical-align: text-bottom" icon="akar-icons:info-fill"></iconify> 当前剪切板功能未开启，请在设置中开启，或者直接点击</div> <xt-button @click="settings.enable=true" type="theme" size="mini" :w="70" :h="35">开启</xt-button>
    </div>
  </div>
  <template v-else>
    <div class="xt-bg-2 rounded-lg p-4 px-5 w-auto m-auto"  >
      <div class=" mr-2 pt-1 " ><iconify style="font-size: 18px;vertical-align: text-bottom" icon="akar-icons:info-fill"></iconify> 暂不支持在非Windows平台上使用剪切板功能。请耐心等待版本更新。</div>
    </div>
  </template>

  <vue-custom-scrollbar style="width: 100%" @ps-x-reach-end="doLoadNextPage" ref="wrapper" @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller"
                        class="mx-4 my-2 py-4 h-full ">
    <ClipList :clipList="clipContents" ></ClipList>
  </vue-custom-scrollbar>
<!--  <div class="text-center">-->
<!--    {{clipContents.length}} 条记录-->
<!--  </div>-->
  <!-- 剪切板列表展示区域结束 -->

  <!-- 导航切换在宽度不够的情况下显示 -->
  <HorizontalDrawer ref="clipRef" :rightSelect="filterList" @getArea="getClipItem"></HorizontalDrawer>

  <!-- 搜索右侧抽屉开始 -->
  <a-drawer :width="500" v-model:visible="drawerVisible" title="搜索" placement="right">
    <div class="flex mb-3">
      <a-input @keydown.enter="clickSearch" allow-clear placeholder="输入关键词" class="no-drag h-10 w-full" v-model:value="searchWords"
               style="background: var(--secondary-bg);"></a-input>
      <div class="h-10 w-24 ml-3 s-item pointer flex button-active items-center justify-center rounded-lg"
           @click="clickSearch" style="background: var(--secondary-bg);">
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

import HorzontanlPanelIcon from '../../../components/HorzontanlPanelIcon.vue'
import HorizontalDrawer from '../../../components/HorizontalDrawer.vue'
import TabSwitching from '../../../components/TabSwitching.vue'
import ClipList from './ClipList.vue'
import ClipSetDrawer from '../components/clipPreview/ClipSetDrawer.vue'
import { Empty, message } from 'ant-design-vue'
import { mapWritableState, mapActions } from 'pinia'
import { clipboardStore } from '../store'
import _ from 'lodash-es'
import {CloseCircleFilled} from '@ant-design/icons-vue'
 import {isWin} from '../../../js/common/screenUtils'
// 引入模拟数据 后期对接数据需要删除 以免影响测试
import ClipItem from '../components/ClipItem.vue'
import XtButton from '../../../ui/libs/Button/index.vue'
import { Icon as Iconify} from '@iconify/vue';
export default {
  name: 'Clipboard',

  components: {
    XtButton,
    ClipItem,
    HorzontanlPanelIcon,
    TabSwitching,
    HorizontalDrawer,
    ClipList,
    ClipSetDrawer,
    CloseCircleFilled,
    Iconify
  },

  data () {
    return {
      dbKey:'',//数据库的key
      page: 1,
      pageSize: 20,
      count: 20,
      // 历史和收藏切换数组
      clipType: [
        { title: '剪切板历史', icon: 'time-circle', name: 'history' },
        { title: '收藏', icon: 'star', name: 'collect' }
      ],


      // 导航栏筛选分类
      filterList: [
        { title: '全部', icon: 'appstore', typename: 'all', name: '全部' },
        { title: '文本', icon: 'text-align-left', typename: 'text', name: '文本' },
        { title: '图片', icon: 'image', typename: 'image', name: '图片' },
        { title: '文件', icon: 'file', typename: 'file', name: '文件' },
        { title: '视频', icon: 'video', typename: 'video', name: '视频' },
        { title: '音频', icon: 'erji1', typename: 'audio', name: '音频' }
      ],
      // 导航栏筛选分类默认值
      currentFilter: { title: '全部', icon: 'appstore', name: '全部', typename: 'all' },

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
      loadEvent:null,//底部加载更多

    }
  },

  computed: {
    ...mapWritableState(clipboardStore, ['loading','clipboardObserver', 'items', 'loadFromDb','totalRows','hasNextPage','filterType','tab','searchWords','settings']),
    // 根据剪切板列表不同状态进行数据显示
    clipContents () {
      let list = []
      if (this.items.length === 0) {
        return []
      }
      list = this.items
      return list

    }
  },
  async mounted () {
    this.setLoadEvent()
    this.dbKey='clipboard:item:'
   this.pageLoad()
  },
  async unmounted(){
    this.items.splice(5,this.items.length-5) //退出的时候清理items，提升载入时间
  },
  methods: {
    ...mapActions(clipboardStore,['nextPage','doSearch']),
    isWin,
    setLoadEvent(){
     this.loadEvent=_.debounce(async () => {
          console.error('触底事件')
          if (this.hasNextPage) {
            console.log('查询下一页')
            let rs = await this.nextPage(this.dbKey)
            if (!rs) {
              message.info({
                content: '已经到底了',
                key: 'loadInfo'
              })
              return
            }
          } else {
            console.log('由于没有下一页返工')
            return
          }
        },300,
        {
          leading:true
        })
    },
    async doLoadNextPage () {
      if(this.loadEvent){
        this.loadEvent()
      }
    },

    pageLoad () {
      this.doLoadNextPage()
    },
    // 打开导航栏切换
    openClipType () {
      this.$refs.clipRef.openDrawer()
    },
    // 切换导航栏
    getClipItem (v) {
      this.currentFilter = v
    },
    // 打开搜索入口
    clipSearch () {
      this.drawerVisible = true
    },
    // 打开设置入口
    openSet () {
      this.$refs.clipDrawer.clipOpenShow()
    },
    // 搜索按钮事件
    clickSearch () {
      this.doSearch()
    }
  },

  watch: {
    'tab': {
      handler (newTab) {
        this.hasNextPage=true
        this.items=[]
        if (newTab.name === 'history') {
          this.dbKey='clipboard:item:'
          this.doLoadNextPage()
        } else if (newTab.name === 'collect') {
          this.dbKey='clipboard:collection:'
          this.doLoadNextPage()
        }
      },
      deep:true
    },
    // 监听导航栏筛选切换
    'currentFilter': {
      handler () {
        this.hasNextPage=true
        this.filterType = this.currentFilter.typename
        this.items=[]
        this.doLoadNextPage()

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

.search-text {

  font-size: 14px;
  color: var(--primary-text);
  font-weight: 400;
}

.s-bg {
  box-shadow: none !important;
  background: var(--primary-bg);
  color: var(--primary-text);
}

:deep(.ant-input) {
  border-radius: 12px !important;
  border: 1px solid var(--divider);
}

@media screen and (max-width: 1160px) {
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
