<template>
  <div id="topBar" class="flex items-center justify-between w-full h-12 top-shadow pt-2.5 mb-2.5 drag">
    <div id="topLeftPart" @contextmenu.stop="toggleAppStats" class="flex flex-1 pl-2.5 drag  items-center">
     <div class="no-drag">
      <a-tooltip>
       <QueueWidget></QueueWidget>
     </a-tooltip>
      <a-tooltip title="剪切板监听中，点击进入应用，右键查看全部" v-if="hasEnable">
        <xt-button w="28" h="28" class="xt-bg-t-2 mr-2.5" style="border-radius:6px !important;"  @click="enterClipboard">
          <div class="flex items-center justify-center">
            <TopIcon style="font-size:20px;" class="xt-text" icon="fluent:clipboard-bullet-list-16-regular"/>
          </div>
        </xt-button>
      </a-tooltip>

      <a-tooltip title="音乐播放中，点击进入应用，右键查看全部">
        <xt-button h="28"  class="xt-bg-t-2 mr-2.5"  v-if="status.music.playing && status.music.title && status.music" style="border-radius: 6px !important;width:auto !important;padding:4px 8px 4px 4px  !important;"
        @click="enterMusic"
       >
         <div class="flex items-center justify-center">
           <a-avatar style="margin-right: 0.5em" :size="20" :src="status.music.cover"></a-avatar>
           <span class="xt-text font-14 truncate xt-font" style="max-width:165px;">
             {{ status.music.title }} {{ status.music.singer }}
           </span>
         </div>
       </xt-button>
      </a-tooltip>

      <xt-button h="28" class="xt-bg-t-2 mr-2.5"  v-if="runningGame.appid" @click="enterGameDesk(runningGame.appid)"
       style="border-radius: 6px !important;width:auto !important;padding:4px 8px 4px 4px  !important;"
      >
       <div class="flex items-center justify-center">
         <a-avatar :size="20" style="margin-right: 0.25rem" :src="getClientIcon(this.runningGame.appid, this.runningGame.clientIcon)"></a-avatar>
         <span class="xt-text font-14 truncate xt-font" style="max-width:165px;">{{ runningGame.chineseName }}</span>
       </div>
      </xt-button>

      <TopCourier />

      <TopClockTimer/>

      <TopTomato />
    </div>
    </div>

    <div id="topCenterPart" class="flex max-search drag" hidden="">
      <div hidden="" @click="openGlobalSearch" class="inline-block input-box no-drag pointer"
        style=" background: var( --primary-bg); color: var(--secondary-text);width: 320px">
        <Icon icon="sousuo"></Icon>
      </div>
    </div>

    <div id="topRightPart" class="flex items-center drag justify-end relative ">
      <TopPanelButton/>
      <div  style="width:auto !important;"   @click="toggleRightDrawer" :style="showWindowController ? {margin:'0 236px 0 0 !important'} : {margin:'0 16px 0 0 !important'} "
       class="no-drag btn-hover category-button p-1 rounded-md pointer"
      >
        <div class="flex items-center" style="max-width:270px;">
          <div class="pl-1 primary-title pointer xt-text font-14  xt-font pr-0.5" v-if="hasChat">新消息·</div>
          <div class="xt-text font-14  xt-font">
           <span  v-if="appSettings.showTopbarTime">{{ dateTime.month }}月{{ dateTime.day }}日 {{ dateTime.week }} {{ dateTime.hours }}:{{ dateTime.minutes }}</span>
           <span v-if="hasWeather && city.now && appSettings.showTopbarWeather"> · {{ city.now.text }} {{ city.now.temp }}℃
            <!-- <i style="" :class="'qi-' + city.now.icon + '-fill'"></i>  -->
           </span>
          </div>
        </div>
      </div>
      <div class="xt-bg rounded-bl-xl  h-9 absolute top-0 right-0 no-drag" v-if="showWindowController" id="windowController" >
        <WindowController></WindowController>
      </div>
    </div>
  </div>

  <TopPanelLeftDrawer ref="leftDrawerRef">
    <div class="app-stats">
      <div @click="enterClipboard" class="cursor-pointer app" v-if="hasEnable">
        <a-row>
          <a-col :span="5">
            <icon style="font-size: 48px;vertical-align: text-top" icon="xiangmu"></icon>
          </a-col>
          <a-col>
            <div class="font-bold app-title">
              剪切板
            </div>
            <div class="app-des xt-text-2">
              剪切板监听中…
            </div>
          </a-col>
        </a-row>

      </div>
      <div @click="enterMusic" class="app" v-if="status.music.playing && status.music.title && status.music">
        <a-row>
          <a-col :span="5">
            <a-avatar style="margin-right: 0.5em" :size="48" :src="status.music.cover"></a-avatar>
          </a-col>
          <a-col>
            <div class="font-bold app-title">
              网易云音乐
            </div>
            <div class="app-des xt-text-2">
              {{ status.music.title }} {{ status.music.singer }}
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="app flex">
        <div>应用状态</div>
        <QueueWidget :show="true"></QueueWidget>
      </div>
    </div>
  </TopPanelLeftDrawer>

  <TopPanelRightDrawer ref="rightDrawerRef" />
</template>

<script>
import { countDownStore } from '../store/countDown'
import { getDateTime } from '../../../src/util/dateTime'
import { appStore } from '../store'
import { cardStore } from '../store/card'
import { topClockSettingStore } from '../store/topClockSetting'
import { mapWritableState, mapState, mapActions } from 'pinia'
import { paperStore } from '../store/paper'
import { weatherStore } from '../store/weather'
import { getSign, isMain } from '../js/common/screenUtils'
import { timerStore } from '../store/timer'
import { steamUserStore } from '../store/steamUser'
import { getClientIcon, getCover, getIcon } from '../js/common/game'
import { clipboardStore } from '../apps/clipboard/store'
import { Icon as TopIcon } from '@iconify/vue'

import WindowController from './WindowController.vue'
import MessagePopup from '../page/notice/noticeIndex.vue'
import TopTomato from '../../table/apps/tomato/widget/TopTomato.vue'
import TopClockTimer from './widgets/TopClockTimer.vue'
import TopCourier from './widgets/courier/TopCourier.vue'
import QueueWidget from '../apps/queue/topWidget/index.vue'
import TopPanelLeftDrawer from './drawer/TopPanelLeftDrawer.vue'
import TopPanelRightDrawer from './drawer/TopPanelRightDrawer.vue'
import TopPanelButton from './drawer/TopPanelButton.vue'

export default {
  name: 'TopPanel',

  components: {
    WindowController,
    MessagePopup,
    TopTomato,
    TopClockTimer,
    TopCourier,
    QueueWidget,TopPanelLeftDrawer,TopPanelRightDrawer,TopIcon,TopPanelButton
  },

  data() {
    return {
      loading: true,
      dateTime: {},
      timer: null,
      lockTimer: null,
      showLockTip: false,
      messageDrawer: false,
      appStats: false,
      topClockTimerVisible: false,
    }
  },

  computed:{
    ...mapWritableState(countDownStore, ['countDowndate', 'countDowntime']),
    ...mapWritableState(cardStore, ["countdownDay", "appDate", "clockEvent","filterClockEvent","clockTag",'chooseType']),
    ...mapWritableState(appStore,['status','showWindowController']),
    ...mapState(weatherStore, ['cities']),
    ...mapWritableState(paperStore, ['settings']),
    ...mapWritableState(timerStore, ['lockTimeout']),
    ...mapWritableState(steamUserStore, ['runningGame']),
    ...mapState(clipboardStore, ['settings']),
    ...mapWritableState(topClockSettingStore, ['checkTopClock']),
    ...mapWritableState(appStore,{appSettings: 'settings'}),
    isMain,

    lockTimeoutDisplay(){
      // if(this.lockTimeout>=60){
      //   return ((this.lockTimeout/60).toFixed(0)-1)+'分'+this.lockTimeout % 60+'秒';
      // }else{
      //   return this.lockTimeout+'秒';
      // }
      function secToTime(s){
        var t = '';
        if (s > -1){
          var hour = Math.floor(s / 3600);
          var min = Math.floor(s / 60) % 60;
          var sec = s % 60;
          if (hour === 0){ t = ''; }
          else if (hour < 10){  t = '0' + hour + '小时'; }
          else{   t = hour + '小时'; }

          if (min < 10) {  t += '0'; }
          t += min + '分';
          if (sec < 10){    t += '0'; }
          t += sec.toFixed(0) + '秒';
        }
        return t;
      }
      return secToTime(this.lockTimeout);
    },
    city(){
      if (this.cities[0]) { return this.cities[0]; }
      else{ return {}; }
    },
    hasWeather(){  return this.cities.length > 0; },
    hasEnable(){ return this.settings.enable; },
    hasChat(){ return this.status.show;  },

  },

  mounted(){
    window.onblur = () => { this.setLockTimer(); };
    window.onfocus = () => { this.clearLockTimer(); };
    this.loading = false;
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

    clearLockTimer(){
      if (this.lockTimer){
        clearInterval(this.lockTimer);
        this.lockTimer = null;
        this.lockTimeout = this.settings.lockTimeout;
        this.showLockTip = false;
      }
    },
    // 顶部左侧状态鼠标右键触发左侧抽屉菜单
    toggleAppStats(){
      this.$refs.leftDrawerRef.openLeftDrawer();
    },
    // 进入剪贴板应用
    enterClipboard(){
      this.$router.push({  name: 'clipboard'});
    },
    setLockTimer(){
      if (this.settings.enable){
        //只有启用了锁屏才会触发这个效果
        this.lockTimeout = (this.settings.lockTimeout || 300) - 1;
      }
      else{
        this.lockTimeout = (this.settings.lockTimeout || 300) - 1;
        this.showLockTip = true;
        this.lockTimer = setInterval(() => {
          this.lockTimeout--;
          if (this.lockTimeout === 0) {
            this.clearLockTimer();
            this.$router.push('/lock');
          }
        }, 1000);
      }
    },
    // 顶部栏搜索
    openGlobalSearch(){
      ipc.send('openGlobalSearch');
    },
    getTime(){
      this.dateTime = getDateTime();
      this.setAppDate(this.dateTime);
    },
    // 进入网易云音乐应用
    enterMusic(){
      this.$router.push({ name: 'music', });
    },
    // 进入Steam游戏应用
    enterGameDesk(appid){
      this.$router.push({
        name: 'gameIndex',
        params: {
          appid: appid
        }
      });
    },
    // 打开右侧抽屉菜单
    toggleRightDrawer(){
      this.$refs.rightDrawerRef.openRightDrawer();
      this.hideNoticeEntry();
    },

    // topClockTimerVisibleSetting(){
    //   this.filterClock(this.clockTag,this.chooseType);
    //   if(this.checkTopClock===true){
    //     if (this.filterClockEvent.length > 0){
    //       // console.log(this.filterClockEvent.length);
    //       this.topClockTimerVisible = true;
    //     }
    //     else if (this.countDowntime.seconds !== undefined){
    //       // console.log(this.countDowndate);
    //       this.topClockTimerVisible = true;
    //     }
    //     else {
    //       // console.log(this.countDowndate,this.clockEvent);
    //       this.topClockTimerVisible = false;
    //     }
    //   }
    //   else{
    //     this.topClockTimerVisible=false;
    //   }
    //   // console.log(this.clockTag);
    // }
  },

  beforeUpdate() {
    // this.topClockTimerVisibleSetting();
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

@media screen and(max-width: 840px) {
  .max-search {
    width: 60px !important;
  }
}

@media screen and(min-width: 1050px) {
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


.notification {
  //禁用闪烁特效，减少gpu占用
  //animation: blink 1s infinite;
  //
  //@keyframes blink {
  //  0% {
  //    opacity: 0;
  //  }
  //
  //  50% {
  //    opacity: 1;
  //  }
  //
  //  100% {
  //    opacity: 0;
  //  }
  //}
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
</style>
