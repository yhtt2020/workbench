<template>
  <div v-if="isMain" class="top-panel drag w-full flex items-center justify-between" style="width: calc(100%);">
    <div class="flex items-center  flex-row" >
      <div class="pointer no-drag text-more" style="display: inline-block" @click="enterGameDesk(runningGame.appid)"  v-if="runningGame.appid">
        <a-avatar :size="22" :src=" getClientIcon(this.runningGame.appid,this.runningGame.clientIcon)"></a-avatar> {{runningGame.chineseName}}
      </div>
      <div class="pointer no-drag text-more" style="display: inline-block;color: var(--primary-text);" @click="enterMusic"  v-else-if="status.music.playing && status.music.title && status.music">
        <a-avatar style="margin-right: 0.5em" :size="22" :src="status.music.cover"></a-avatar>
        {{ status.music.title }} {{ status.music.singer }}
      </div>
    </div>
    <div class="flex max-search"  hidden="">
      <div hidden="" @click="openGlobalSearch" class="input-box no-drag pointer inline-block" style=" background: var( --primary-bg); color: var(--secondary-text);width: 320px">
        <Icon icon="sousuo"></Icon>
      </div>
    </div>
    <div class="flex flex-1 items-end justify-end align-items-end xt-text " >
      <div hidden=""  class="no-drag flex items-center pointer" @click="messageAlert">
        <div class=" flex items-center justify-center" style="width: 20px;height: 20px;">
          <img src="/icons/logo128.png" class="w-full h-full object-cover">
        </div>
        <div class="primary-title pointer pl-1" style="color: var(--primary-text);">新消息</div>
        <a-divider type="vertical" style="height: 18px;width: 1px; background: var(--primary-text);opacity: 0.2 "  />
      </div>
      <div class="mr-2" style="text-align: right;display: flex;flex-direction: row;align-items: flex-end;justify-content: flex-end;color: var(--primary-text);">
        <div class="no-drag truncate" v-if="!loading" >
          <span hidden style=" font-size: 0.8em; margin-right: 1em" v-if="settings.tipLock && this.showLockTip">
            <!-- {{ lockTimeoutDisplay }}后锁屏 -->
          </span>
          {{ dateTime.month }}/{{ dateTime.day }} {{ dateTime.hours }}:{{dateTime.minutes}}
          {{ dateTime.week }}
          <span v-if="hasWeather && city.now">
            <i style="" :class="'qi-' + city.now.icon + '-fill'"></i> {{ city.now.temp }}℃
          </span>
        </div>
      </div>
    </div>
    <div id="windowController" v-if="showWindowController" class="flex s-item s-bg btn-container rounded-bl-lg " style=" background: var(--primary-bg) !important;margin-top: -11px;overflow: hidden">
      <WindowController ></WindowController>
    </div>
  </div>


  <a-drawer :width="500" :closable="false" style="z-index:1000;" :placement="right" v-model:visible="messageDrawer" :bodyStyle="{padding:'12px'}">
    <MessagePopup></MessagePopup>
  </a-drawer>

</template>

<script>
import { getDateTime } from '../../../src/util/dateTime'
import { appStore } from '../store'
import { cardStore } from '../store/card'
import { mapWritableState, mapState, mapActions } from 'pinia'
import { paperStore } from '../store/paper'
import { weatherStore } from '../store/weather'
import { getSign, isMain } from '../js/common/screenUtils'
import { timerStore } from '../store/timer'
import WindowController from './WindowController.vue'
import MessagePopup from '../page/notice/noticeIndex.vue';
import {steamUserStore} from "../store/steamUser";
import {getClientIcon, getCover, getIcon} from "../js/common/game";

export default {
  name: 'TopPanel',
  components:{
    WindowController,
    MessagePopup
  },
  data () {
    return {
      loading: true,
      dateTime: {},
      timer: null,
      lockTimer: null,
      showLockTip: false,
      messageDrawer:false,
    }
  },
  computed: {
    ...mapWritableState(appStore, ['status','showWindowController']),
    ...mapState(weatherStore, ['cities']),
    ...mapWritableState(paperStore, ['settings']),
    ...mapWritableState(timerStore,['lockTimeout']),
    ...mapWritableState(steamUserStore,['runningGame']),
    isMain,
    lockTimeoutDisplay () {
      // if(this.lockTimeout>=60){
      //   return ((this.lockTimeout/60).toFixed(0)-1)+'分'+this.lockTimeout % 60+'秒'
      // }else{
      //   return this.lockTimeout+'秒'
      // }
      function secTotime (s) {
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
    city () {
      if (this.cities[0]) {
        return this.cities[0]
      } else {
        return {}
      }

    },
    hasWeather () {
      return this.cities.length > 0
    },
  },
  async mounted () {
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
  },
  created () {
    this.getTime()
  },
  methods: {
    getClientIcon,
    getIcon,
    getCover,
    ...mapActions(cardStore, ['setAppDate']),
    clearLockTimer () {
      if (this.lockTimer) {
        clearInterval(this.lockTimer)
        this.lockTimer = null
        this.lockTimeout = this.settings.lockTimeout
        this.showLockTip = false
      }
    },
    setLockTimer () {
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
    openGlobalSearch () {
      ipc.send('openGlobalSearch')
    },
    getTime () {
      this.dateTime = getDateTime()
      this.setAppDate(this.dateTime)
    },
    enterMusic () {
      this.$router.push({
        name: 'music',
      })
    },
    enterGameDesk(appid){
      this.$router.push({
        name: 'gameIndex',
        params:{
          appid:appid
        }
      })
    },
    messageAlert(){
      this.messageDrawer = true
    }

  },
}
</script>

<style lang="scss" scoped>
.top-panel {
  padding: 0.8em 0 0.8em 0.8em;
  padding-bottom: 0;
}

.input-box {
  height: 2em;
  border-radius: 100px;
  border: 1px solid #c4c4c4;
}
.btn-container{
}

.new-message{
  position:fixed;
  top:11px;
  left:71.5%;
}

.primary-title{
  font-family: PingFangSC-Medium;
  font-size: 14px;
  font-weight: 500;
}

.max-search{
  width: 320px;
}

@media screen and(max-width:840px) {
  .max-search{
    width: 60px !important;
  }
}
@media screen and(min-width:1050px) {
  .max-search{
    width: 320px !important;
  }
}
</style>
