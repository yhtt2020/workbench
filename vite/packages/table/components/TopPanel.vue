<template>
  <div class="flex items-center justify-between w-full top-panel drag" style="width: calc(100%);">

    <div @contextmenu.stop="toggleAppStats" class="flex flex-row items-center no-drag">
      <a-tooltip title="剪切板监听中，点击进入应用，右键查看全部" v-if="enable">
        <div class="mr-2 cursor-pointer no-drag" @click="enterClipboard">
          <icon style="font-size: 24px;vertical-align: text-top" icon="xiangmu"></icon>
        </div>
      </a-tooltip>

      <div class="pointer no-drag text-more" style="display: inline-block" @click="enterGameDesk(runningGame.appid)"
        v-if="runningGame.appid">
        <a-avatar :size="22" :src="getClientIcon(this.runningGame.appid, this.runningGame.clientIcon)"></a-avatar>
        {{ runningGame.chineseName }}
      </div>
      <a-tooltip title="音乐播放中，点击进入应用，右键查看全部" v-else-if="status.music.playing && status.music.title && status.music">
        <div class="pointer no-drag text-more" style="display: inline-block;color: var(--primary-text);"
          @click="enterMusic">
          <a-avatar style="margin-right: 0.5em" :size="22" :src="status.music.cover"></a-avatar>
          {{ status.music.title }} {{ status.music.singer }}
        </div>
      </a-tooltip>
    </div>
    <div class="flex max-search" hidden="">
      <div hidden="" @click="openGlobalSearch" class="inline-block input-box no-drag pointer"
        style=" background: var( --primary-bg); color: var(--secondary-text);width: 320px">
        <Icon icon="sousuo"></Icon>
      </div>
    </div>
    <div class="flex items-end justify-end flex-1 right-area align-items-end xt-text" style="position: relative;">
      <div class="top-state">
        <!-- 番茄钟 -->
        <TopTomato />
        <TopClockTimer v-if="topClockTimerVisible"/>
      </div>

      <div v-if="status.show && hasChat" class="flex items-center no-drag pointer" @click="messageAlert"
        style="color: var(--primary-text);">
        <div class="flex items-center justify-center notification" style="width: 20px;height: 20px;position: relative;">
          <img src="/icons/logo128.png" class="object-cover w-full h-full">
          <div class="new-message-tag"></div>
        </div>
        <div class="pl-1 primary-title pointer" style="color: var(--primary-text);">新消息</div>
        <a-divider type="vertical" style="height: 18px;width: 1px; background: var(--primary-text);opacity: 0.2 " />
      </div>

      <div v-else class="flex items-center justify-center pr-3 no-drag pointer" @click="messageAlert"
        style="color: var(--primary-text);">
        <Icon icon="notification" style="font-size:1.5em;"></Icon>
      </div>

      <div class="mr-2"
        style="text-align: right;display: flex;flex-direction: row;align-items: flex-end;justify-content: flex-end;color: var(--primary-text);">
        <div class="truncate no-drag" v-if="!loading">
          <span hidden style=" font-size: 0.8em; margin-right: 1em" v-if="settings.tipLock && this.showLockTip">
            <!-- {{ lockTimeoutDisplay }}后锁屏 -->
          </span>
          {{ dateTime.month }}/{{ dateTime.day }} {{ dateTime.hours }}:{{ dateTime.minutes }}
          {{ dateTime.week }}
          <span v-if="hasWeather && city.now">
            <i style="" :class="'qi-' + city.now.icon + '-fill'"></i> {{ city.now.temp }}℃
          </span>
        </div>
      </div>

    </div>
    <div id="windowController" v-if="showWindowController" class="flex rounded-bl-lg s-item s-bg btn-container "
      style=" background: var(--primary-bg) !important;margin-top: -11px;overflow: hidden">
      <WindowController></WindowController>
    </div>
  </div>


  <a-drawer :width="500" :closable="false" style="z-index:1000;" placement="right" v-model:visible="messageDrawer"
    :bodyStyle="{ padding: '12px 12px 12px 0 ', overflow: 'hidden !important', }" @closeMessage="messageDrawer = false">
    <MessagePopup @closeMessage="messageDrawer = false"></MessagePopup>
  </a-drawer>
  <a-drawer v-model:visible="appStats" placement="left">
    <div class="app-stats">
      <div @click="enterClipboard" class="cursor-pointer app" v-if="enable">
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
    </div>
  </a-drawer>
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
import WindowController from './WindowController.vue'
import MessagePopup from '../page/notice/noticeIndex.vue'
import { steamUserStore } from '../store/steamUser'
import { getClientIcon, getCover, getIcon } from '../js/common/game'
import { clipboardStore } from '../apps/clipboard/store'
import { noticeStore } from '../store/notice'
import TopTomato from '../../table/apps/tomato/widget/TopTomato.vue'
import TopClockTimer from './widgets/TopClockTimer.vue'

export default {
  name: 'TopPanel',
  components: {
    WindowController,
    MessagePopup,
    TopTomato,
    TopClockTimer,
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
    ...mapWritableState(appStore, ['status', 'showWindowController']),
    ...mapState(weatherStore, ['cities']),
    ...mapWritableState(paperStore, ['settings']),
    ...mapWritableState(timerStore, ['lockTimeout']),
    ...mapWritableState(steamUserStore, ['runningGame']),
    ...mapState(clipboardStore, ['enable']),
    ...mapState(noticeStore, ['noticeSettings']),
    ...mapWritableState(topClockSettingStore, ['checkTopClock']),
    isMain,
    lockTimeoutDisplay() {
      // if(this.lockTimeout>=60){
      //   return ((this.lockTimeout/60).toFixed(0)-1)+'分'+this.lockTimeout % 60+'秒'
      // }else{
      //   return this.lockTimeout+'秒'
      // }
      function secTotime(s) {
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

      return secTotime(this.lockTimeout)
    },
    city() {
      if (this.cities[0]) {
        return this.cities[0]
      } else {
        return {}
      }

    },
    hasWeather() {
      return this.cities.length > 0
    },

    hasChat() {
      return this.$route.path !== '/chat'
    },

  },
  async mounted() {
    window.onblur = () => {
      this.setLockTimer()
    }
    window.onfocus = () => {
      this.clearLockTimer()
    }
    this.loading = false
    if (!this.timer) {
      setInterval(this.getTime, 1000)
    }
    this.filterClock(this.clockTag)
  },
  created() {
    this.getTime()
  },
  methods: {
    getClientIcon,
    getIcon,
    getCover,
    ...mapActions(cardStore, ['setAppDate','filterClock']),
    ...mapActions(noticeStore, ['loadNoticeDB']),
    ...mapActions(appStore,['hideNoticeEntry']),
    clearLockTimer() {
      if (this.lockTimer) {
        clearInterval(this.lockTimer)
        this.lockTimer = null
        this.lockTimeout = this.settings.lockTimeout
        this.showLockTip = false
      }
    },
    toggleAppStats() {
      this.appStats = !this.appStats
    },
    enterClipboard() {
      this.$router.push({
        name: 'clipboard'
      })
    },
    setLockTimer() {
      if (this.settings.enable) {
        //只有启用了锁屏才会触发这个效果
        if (this.lockTimer) {
          this.lockTimeout = (this.settings.lockTimeout || 300) - 1
        } else {
          this.lockTimeout = (this.settings.lockTimeout || 300) - 1
          this.showLockTip = true
          this.lockTimer = setInterval(() => {
            this.lockTimeout--
            if (this.lockTimeout === 0) {
              this.clearLockTimer()
              this.$router.push('/lock')
            }
          }, 1000)
        }
      }
    },
    openGlobalSearch() {
      ipc.send('openGlobalSearch')
    },
    getTime() {
      this.dateTime = getDateTime()
      this.setAppDate(this.dateTime)
    },
    enterMusic() {
      this.$router.push({
        name: 'music',
      })
    },
    enterGameDesk(appid) {
      this.$router.push({
        name: 'gameIndex',
        params: {
          appid: appid
        }
      })
    },
    messageAlert() {
      this.messageDrawer = true
      this.$nextTick(async () => {
        await this.loadNoticeDB()
      })
      this.hideNoticeEntry()
    },
    topClockTimerVisibleSetting() {
      this.filterClock(this.clockTag,this.chooseType)
      if(this.checkTopClock===true){
        if (this.filterClockEvent.length > 0) {
          // console.log(this.filterClockEvent.length);
          this.topClockTimerVisible = true
        }
        else if (this.countDowntime.seconds !== undefined) {
          // console.log(this.countDowndate);
          this.topClockTimerVisible = true
        }
        else {
          // console.log(this.countDowndate,this.clockEvent);
          this.topClockTimerVisible = false
        }
      }else{
        this.topClockTimerVisible=false

      }
      // console.log(this.clockTag);



    },


  },
  beforeUpdate() {
    this.topClockTimerVisibleSetting()
  },
}
</script>

<style lang="scss" scoped>
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
  font-family: PingFangSC-Medium;
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

  animation: blink 1s infinite;

  @keyframes blink {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }
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
</style>
