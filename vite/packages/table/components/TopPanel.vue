<template>
  <!-- xt-main-top-bar 元素定位类 不可删 -->
  <div  id="topBar" class="flex items-center justify-between w-full pt-1 xt-main-top-bar top-shadow drag">
      <!-- @contextmenu.stop="toggleAppStats" -->
      <div
        v-if="isMain || (appSettings.showTopPanel)"
        id="topLeftPart"
        class="flex min-h flex-1 pl-2.5 drag  items-center">
        <div
          class="no-drag"
          v-if="isMain && navFormat">
          <MessageBox :isTop="true" />
        </div>
      </div>

      <div
        v-if="(isMain || (appSettings.showTopPanel)) && navFormat"
        id="topCenterPart"
        class="flex max-search drag min-h" hidden="">
        <div
          hidden=""
          @click="openGlobalSearch"
          class="inline-block input-box no-drag pointer"
          style=" background: var( --primary-bg); color: var(--secondary-text);width: 320px">
          <Icon icon="sousuo"></Icon>
        </div>
      </div>

      <div
        v-if="(isMain || (appSettings.showTopPanel)) && navFormat"
        id="topRightPart"
        class="relative flex items-center justify-end min-h drag ">
        <PaperLock></PaperLock>
        <TopPanelButton/>

        <div
          v-if="isMain && navFormat"
          style="width:auto !important;"
          @click="toggleRightDrawer"
          :style="showWindowController ? {margin:'0 170px 0 0 !important'} : {margin:'0 16px 0 0 !important'} "
          class="p-1 rounded-md no-drag btn-hover category-button pointer">
          <div class="flex items-center">
            <template v-if="hasChat">
              <span class="pl-1 primary-title pointer xt-text font-14 xt-font">新消息</span>
              <span class="px-1 xt-text font-14 xt-font">·</span>
            </template>
            <template v-if="appSettings.showTopbarTime">
              <span class="xt-text font-14 xt-font">{{ dateTime.month }}月{{ dateTime.day }}日</span>
              <span class="mx-1 xt-text font-14 xt-font">{{ dateTime.week }}</span>
              <span class="pr-1 xt-text font-14 xt-font">{{ dateTime.hours }}:{{ dateTime.minutes }}</span>
            </template>
            <span
              v-if="hasWeather && city.now && appSettings.showTopbarWeather"
              class=" xt-text font-14 xt-font">{{ city.now.text }} {{ city.now.temp }}℃</span>
          </div>
        </div>
      </div>

    <div
      class="absolute top-0 right-0 xt-bg rounded-bl-xl h-9 no-drag"
      style="z-index: 100;"
      v-if="showWindowController && $usePlat('client')"
      id="windowController" >
      <WindowController></WindowController>
    </div>
  </div>

  <TopPanelRightDrawer ref="rightDrawerRef" />
</template>

<script>
import { mapWritableState, mapState, mapActions } from 'pinia'

import { isMain } from '../js/common/screenUtils'
import { getClientIcon, getCover, getIcon } from '../js/common/game'
import { getDateTime } from '../../../src/util/dateTime'

import { appStore } from '../store'
import { cardStore } from '../store/card'
import { paperStore } from '../store/paper'
import { weatherStore } from '../store/weather'
import { useNavigationStore } from './desk/navigationBar/navigationStore'

import WindowController from './WindowController.vue'
import QueueWidget from '../apps/queue/topWidget/index.vue'
import TopPanelLeftDrawer from './drawer/TopPanelLeftDrawer.vue'
import TopPanelRightDrawer from './drawer/TopPanelRightDrawer.vue'
import TopPanelButton from './drawer/TopPanelButton.vue'
import PaperLock from './topPanel/PaperLock.vue'
import MessageBox from './windowPanel/MessageBox.vue'
import { usePlat } from '../ui/hooks/usePlat'

export default {
  name: 'TopPanel',

  components: {
    PaperLock,
    WindowController,
    QueueWidget,
    TopPanelLeftDrawer,
    TopPanelRightDrawer,
    TopPanelButton,
    MessageBox
  },

  data() {
    return {
      isWeb:false,
      loading: true,
      dateTime: {},
      timer: null,
      messageDrawer: false,
      appStats: false,
      topClockTimerVisible: false,
    }
  },
  props:['isHidden'],
  computed:{
    ...mapWritableState(cardStore, ["countdownDay", "appDate", "clockEvent","filterClockEvent","clockTag",'chooseType']),
    ...mapWritableState(appStore,['status','showWindowController', 'showGuide']),
    ...mapState(weatherStore, ['cities']),
    ...mapWritableState(paperStore, ['settings']),
    ...mapWritableState(appStore,{appSettings: 'settings'}),
    ...mapState(useNavigationStore, ['currentNavFormat']),
    // 判断当前的导航栏模式
    navFormat(){ return this.currentNavFormat === 'mac' },
    isMain,
    city(){
      if (this.cities[0]) { return this.cities[0]; }
      else{ return {}; }
    },
    hasWeather(){  return this.cities.length > 0; },
    hasEnable(){ return this.settings.enable; },
    hasChat(){ return this.status.show;  },

  },

  mounted(){
    this.loading = false;
    this.isWeb=!usePlat('client')
    if (!this.timer){  setInterval(this.getTime, 1000); };
    this.filterClock(this.clockTag);
  },

  created(){
    this.getTime();
  },

  methods:{
    getClientIcon, getIcon, getCover,
    ...mapActions(cardStore, ['setAppDate','filterClock']),
    ...mapActions(appStore,['hideNoticeEntry']),


    // 顶部左侧状态鼠标右键触发左侧抽屉菜单
    toggleAppStats(){
      this.$refs.leftDrawerRef.openLeftDrawer();
    },

    // 顶部栏搜索
    openGlobalSearch(){
      ipc.send('openGlobalSearch');
    },
    getTime(){
      this.dateTime = getDateTime();
      this.setAppDate(this.dateTime);
    },
    // 打开右侧抽屉菜单
    toggleRightDrawer(){
    // 定制桌面过程中需要屏蔽一下
    if(!this.showGuide){
      this.$refs.rightDrawerRef.openRightDrawer();
      this.hideNoticeEntry();
    }else{
      message.info("定制过程中无法操作");
    }
    },
  }
}
</script>

<style lang="scss" scoped>
.top-shadow{
  background: linear-gradient(to bottom, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.18) 51%, rgba(25,25,25,0.00) 100%) !important;
}
.top-panel {
  padding: 0.8em 0 0 0.8em;
  display: flex;
}

.input-box {
  height: 2em;
  border-radius: 100px;
  border: 1px solid #c4c4c4;
}

.new-message {
  position: fixed;
  top: 11px;
  left: 71.5%;
}

.primary-title {
  font-size: 14px;
  font-weight: 500;
}

.max-search {
  width: 320px;
}

@media screen and (max-width: 840px) {
  .max-search {
    width: 60px !important;
  }
}

@media screen and (min-width: 1050px) {
  .max-search {
    width: 320px !important;
  }
}

.app-stats {
  .app {
    background: var(--secondary-bg);
    padding: 20px;
    border-radius: 10px;
    font-size: 16px;
    margin-bottom: 10px;
    cursor: pointer;

    &:hover {
      opacity: 0.9;
    }
  }
}
.new-message-tag::after {
  content: "";
  display: block;
  width: 7px;
  height: 7px;
  background-color: var(--error);
  border-radius: 50%;
  position: absolute;
  top: 0px;
  right: 0px;
}
.top-state {
  display: flex;
  // position: relative;
}
.right-area{
  display: flex;
  align-items: center;
  height: 25px;
}
.btn-hover{
  &:hover{
   background: var(--secondary-transp-bg) !important;
  }
}
.min-h{
  min-height: 28px;
}
</style>
