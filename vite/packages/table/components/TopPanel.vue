<template>
  <div class=" top-shadow  flex  justify-between w-full drag">
    <div @contextmenu.prevent="toggleAppStats" class="flex pl-2.5 py-2.5 flex-1 items-center no-drag">
      <a-tooltip title="剪切板监听中，点击进入应用，右键查看全部" placement="top" v-if="enable">
        <xt-button w="28" h="28" class="xt-bg-t-2" style="border-radius:6px !important;"  @click="enterClipboard">
          <div class="flex items-center justify-center">
            <icon style="font-size:20px;vertical-align: text-top" class="xt-text-2" icon="xiangmu"></icon>
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

      <TopTomato />
      <TopClockTimer v-if="topClockTimerVisible"/>

      <a-tooltip title="音乐播放中，点击进入应用，右键查看全部" v-if="status.music.playing && status.music.title && status.music">
        <xt-button h="28"  class="xt-bg-t-2 mr-2.5" style="border-radius: 6px !important;width:auto !important;padding:4px 8px 4px 4px  !important;"
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


    </div>

    <div class="flex h-12 justify-end no-drag" style="width:550px;">
      <xt-button h="48" style="background:transparent !important;width:auto !important;margin:0 16px 0 0 !important"  @click="toggleRightDrawer">
        <div class="flex items-center">
          <div class="pl-1 primary-title pointer xt-text font-14  xt-font pr-0.5" v-if="hasChat">新消息 ·</div>
          <div class="xt-text font-14  xt-font">
           <span  v-if="appSettings.showTopbarTime"> {{ dateTime.month }}月 {{ dateTime.day }}日 {{ dateTime.week }} {{ dateTime.hours }}:{{ dateTime.minutes }} · </span>
           <span v-if="hasWeather && city.now && appSettings.showTopbarWeather">
            {{ city.now.text }}  {{ city.now.temp }}℃
            <!-- <i style="" :class="'qi-' + city.now.icon + '-fill'"></i>  -->
           </span>
          </div>
        </div>
      </xt-button>
      <div class="xt-bg rounded-bl-xl h-9" v-if="showWindowController" id="windowController">
        <WindowController></WindowController>
      </div>
    </div>
  </div>

  <TopPanelLeftDrawer ref="leftDrawerRef">
    <div class="flex items-center justify-center">
      <xt-button h="64" style="width:auto !important;background:transparent !important;" @click="enterMusic">
        <div class="flex items-center justify-center">
          <a-avatar style="margin-right: 0.5em" :size="48" :src="status.music.cover"></a-avatar>
          <div class="flex flex-col">
            <span class="xt-text font-14 truncate font-500 xt-font">网易云音乐</span>
            <span class="xt-text font-14 truncate font-500 xt-font" style="max-width:110px;"> {{ status.music.title }} {{ status.music.singer }}</span>
          </div>
        </div>
      </xt-button>
    </div>

  </TopPanelLeftDrawer>
  <TopPanelRightDrawer ref="rightDrawerRef"/>
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

import WindowController from './WindowController.vue'
import TopTomato from '../../table/apps/tomato/widget/TopTomato.vue'
import TopClockTimer from './widgets/TopClockTimer.vue'
import TopCourier from './widgets/courier/TopCourier.vue'
import TopPanelLeftDrawer from './drawer/TopPanelLeftDrawer.vue'
import TopPanelRightDrawer from './drawer/TopPanelRightDrawer.vue'

export default {
  name: 'TopPanel',
  components: {
    WindowController,TopTomato,TopClockTimer, 
    TopCourier, 
    TopPanelLeftDrawer,TopPanelRightDrawer,
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

  computed: {
    ...mapWritableState(countDownStore, ['countDowndate', 'countDowntime']),
    ...mapWritableState(cardStore, ["countdownDay", "appDate", "clockEvent","filterClockEvent","clockTag",'chooseType']),
    ...mapWritableState(appStore,['status','showWindowController']),
    ...mapWritableState(appStore,{ appSettings: 'settings' }),
    ...mapState(weatherStore, ['cities']),
    ...mapWritableState(paperStore, ['settings']),
    ...mapWritableState(timerStore, ['lockTimeout']),
    ...mapWritableState(steamUserStore, ['runningGame']),
    ...mapState(clipboardStore, ['enable']),
    ...mapWritableState(topClockSettingStore, ['checkTopClock']),
    isMain,
    lockTimeoutDisplay() {
      // if(this.lockTimeout>=60){
      //   return ((this.lockTimeout/60).toFixed(0)-1)+'分'+this.lockTimeout % 60+'秒'
      // }else{
      //   return this.lockTimeout+'秒'
      // }
      function secToTime(s) {
        var t = ''
        if (s > -1) {
          var hour = Math.floor(s / 3600)
          var min = Math.floor(s / 60) % 60
          var sec = s % 60
          if (hour === 0)
            t = ''
          else if (hour < 10) {
            t = '0' + hour + '小时'
          } else {
            t = hour + '小时'
          }
          if (min < 10) {
            t += '0'
          }
          t += min + '分'
          if (sec < 10) {
            t += '0'
          }
          t += sec.toFixed(0) + '秒'
        }
        return t
      }
      return secToTime(this.lockTimeout);
    },
    city() {
      if (this.cities[0]) { return this.cities[0]; } 
      else { return {}; }
    },
    hasWeather() { return this.cities.length > 0; },
    hasChat() { return this.status.show; },
  },
  mounted() {
    window.onblur = () => { this.setLockTimer(); }
    window.onfocus = () => { this.clearLockTimer(); }
    this.loading = false;
    if (!this.timer) { setInterval(this.getTime, 1000); }
    this.filterClock(this.clockTag)
  },
  created() {
    this.getTime();
  },
  methods: {
    getClientIcon,getIcon,getCover,
    ...mapActions(cardStore, ['setAppDate','filterClock']),
    ...mapActions(appStore,['hideNoticeEntry']),
    clearLockTimer() {
      if (this.lockTimer) {
        clearInterval(this.lockTimer);
        this.lockTimer = null;
        this.lockTimeout = this.settings.lockTimeout;
        this.showLockTip = false;
      }
    },
    enterClipboard() {
      this.$router.push({
        name: 'clipboard'
      });
    },
    setLockTimer() {
      if (this.settings.enable) {
        //只有启用了锁屏才会触发这个效果
        if (this.lockTimer) {
          this.lockTimeout = (this.settings.lockTimeout || 300) - 1;
        } else {
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
      }
    },
    // 全局搜索
    openGlobalSearch() {
      ipc.send('openGlobalSearch');
    },
    getTime() {
      this.dateTime = getDateTime();
      this.setAppDate(this.dateTime);
    },
    // 进入网易云音乐界面
    enterMusic() {
      this.$router.push({
        name: 'music',
      });
    },
    // 进入游戏桌面
    enterGameDesk(appid) {
      this.$router.push({
        name: 'gameIndex',
        params: {
          appid: appid
        }
      });
    },
    topClockTimerVisibleSetting() {
      this.filterClock(this.clockTag,this.chooseType)
      if(this.checkTopClock===true){
        if (this.filterClockEvent.length > 0) {
          // console.log(this.filterClockEvent.length);
          this.topClockTimerVisible = true;
        }
        else if (this.countDowntime.seconds !== undefined) {
          // console.log(this.countDowndate);
          this.topClockTimerVisible = true;
        }
        else {
          // console.log(this.countDowndate,this.clockEvent);
          this.topClockTimerVisible = false;
        }
      }else{
        this.topClockTimerVisible=false;
      }
      // console.log(this.clockTag);
    },
    // 点击顶部状态栏左侧抽屉菜单
    toggleAppStats() {
      this.$refs.leftDrawerRef.openLeftDrawer()
    },
    // 点击顶部状态栏右侧抽屉菜单
    toggleRightDrawer() {
      this.$refs.rightDrawerRef.openRightDrawer();
      this.hideNoticeEntry();
    },
  },
  beforeUpdate() {
    this.topClockTimerVisibleSetting();
  },
}
</script>

<style lang="scss" scoped>
.top-shadow{
  background: linear-gradient(to,bottom, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.18) 51%, rgba(25,25,25,0.00) 100%);
}
</style>