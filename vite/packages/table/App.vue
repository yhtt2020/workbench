<template>
  <!-- Your Drag-and-Drop Application -->
  <!-- <xt-task-reward/> -->
  <!-- 登录引导弹窗 -->
  <xt-confirm v-if="loginVisible" noText="暂不登录" okText="立即登录" okButtonWidth="95" noButtonWidth="95"
              title="登录提示" content="目前处于游客模式，请登录后体验完整功能。" :no="unLoginModal"
              :ok="loginModal"></xt-confirm>

  <!-- 领取任务奖励弹窗 -->
  <!-- <ClaimReward v-if="rewardVisible"/> -->

  <Global/>

  <div style="z-index:9999" v-if="settings.down.enable" v-for="item of settings.down.count" :key="item"
       :class="settings.down.type + 'flake'"></div>
  <a-config-provider :locale="locale">
    <div class="a-container " :class="{ dark: settings ? settings.darkMod : '', 'horse_run': this.settings.houserun }">
      <DndProvider :backend="HTML5Backend">
        <router-view></router-view>
      </DndProvider>
    </div>
    <Barrage></Barrage>
  </a-config-provider>
  <!-- <a-modal v-model:visible="visible" centered @ok="handleOk" @cancel="handleOk">
    <template #modalRender="{}">
      <div style="
          height: 14.7em;
          background: #2e2e2e;
          padding: 1em;
          text-align: center;
          border-radius: 2em;
          margin-top: 5em;
        " v-if="clockEvent[0]">
        <div style="font-size: 3em; margin-top: 0.5em">
          {{ clockEvent[0].dateValue.hours }}:{{
            clockEvent[0].dateValue.minutes
          }}
        </div>
        <div style="
            font-size: 1.5em;
            margin-top: 0.5em;
            overflow: hidden;
            text-overflow: ellipsis;
          ">
          {{ clockEvent[0].eventValue }}
        </div>
      </div>
    </template>
  </a-modal> -->
  <audio ref="clock" src="/sound/clock.mp3"></audio>
  <audio id="shakeAudio" ref="shake" :src="'/sound/'+settings.shake.audio"></audio>
  <template v-if="settings.transparent">
    <!--    <div class="fixed inset-0 video-container " style="background: #00000000">-->
    <!--    </div>-->
  </template>

  <DeskBg></DeskBg>

  <div v-if="taggingScreen" class="px-10 rounded-lg"
       style="pointer-events:none;background: rgba(51,51,51,0.9);font-size: 8em;position: fixed;right: 10px;bottom: 10px;z-index: 999;">
    {{ screenDetail.title || '主屏' }}
  </div>

  <Modal style="z-index:999" v-model:visible="userCardVisible" v-if="userCardVisible" animationName="b-t"
         :blurFlag="true">
    <slot>
      <UserCard :key="userCardUid" :uid="userCardUid" :userInfo="userCardUserInfo"></UserCard>
    </slot>
  </Modal>
  <Modal v-model:visible="frameStoreVisible" v-if="frameStoreVisible" animationName="b-t"
         :blurFlag="true">
    <slot>
      <div class="mr-3 card half"
           style="padding:0;width: 370px;background: var(--primary-bg);max-height: 550px;height: 550px;z-index: 9999999;position: relative;overflow: hidden">
        <FrameStoreWidget></FrameStoreWidget>
      </div>
    </slot>
  </Modal>
  <ModalNotice ref="noticeModal" :message="null" v-model:visible="showNoticeModal"></ModalNotice>


</template>

<script>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { mapActions, mapWritableState } from 'pinia'
import { cardStore } from './store/card'
import { appStore } from './store'
import Barrage from './components/comp/Barrage.vue'
import { codeStore } from './store/code'
import { appsStore } from './store/apps'
import { steamUserStore } from './store/steamUser'
import { screenStore } from './store/screen'

import browser from './js/common/browser'
import UserCard from './components/small/UserCard.vue'
import Modal from './components/Modal.vue'
import { timerStore } from './store/timer'
import {
  initStyle
} from './components/card/hooks/styleSwitch/'
import {
  initTheme
} from './components/card/hooks/themeSwitch/'
import FrameStoreWidget from './components/team/FrameStoreWidget.vue'

import { DndProvider } from 'vue3-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { message, notification } from 'ant-design-vue'
import ModalNotice from './page/notice/ModalNotice.vue'
// import ClaimReward from './apps/task/components/ClaimReward.vue'
import Global from './apps/global/Global.vue'
// import { taskStore } from './apps/task/store'
import { usePlat } from './ui/hooks/usePlat'
import { useLogin } from '../table/permission/user/useLogin'
import DeskBg from './components/DeskBg.vue'
notification.config({
  top: '70px',//设置notification默认距离顶部位置
  rtl: false,
})
window.browser = browser
let appModel
if (usePlat('client')) {
  appModel = window.$models.appModel
}
let startX,
  startY,
  moveEndX,
  moveEndY,
  X,
  Y = 0
const distX = 80 //滑动感知最小距离
const distY = 80 //滑动感知最小距离
export default {
  components: { DeskBg, Global, ModalNotice, FrameStoreWidget, Modal, UserCard, Barrage, DndProvider, },
  data () {
    return {
      HTML5Backend,
      touchDownRoutes: ['home', 'lock'], //支持下滑的页面的白名单
      touchUpRoutes: ['home', 'lock'], //支持下滑的页面的白名单
      locale: zhCN,
      visible: false,
      dialogVisible: false,

      frameStoreVisible: false,
      showNoticeModal: false,

    }
  },

  async mounted () {

    if(!usePlat('client')){
      document.body.classList.add('web')
    }else{
      this.$router.push({
        name:'splash'
      })
    }

    window.addEventListener('resize', () => {
      document.body.classList.add('window')
    })
    setTimeout(() => {
      this.ensureFullScreen()
    }, 3000) //从1s延长至3s，以确保前期的位置调整已经完成
    initTheme()
    initStyle()
    window.toggleFrameStore = () => {
      this.frameStoreVisible = !this.frameStoreVisible
      this.userCardVisible = false
    }

    window.addEventListener('keydown', this.KeyDown, true)// 监听按键事件

    window.restore = () => {
      this.settings.zoomFactor = 100
      tsbApi.window.setZoomFactor(+this.settings.zoomFactor / 100).then()
    }
    if (usePlat('client')) {
      ipc.on('updateRunningApps', async (event, args) => {
        this.runningApps = args.runningApps
        this.runningAppsInfo = {}
        for (const app of args.runningApps) {
          this.runningAppsInfo[app] = await appModel.get({ nanoid: app })
          this.runningAppsInfo[app].windowId = args.windows[args.runningApps.indexOf(app)]
          ipc.send('getAppRunningInfo', { nanoid: app })
        }
      })

      ipc.on('updateRunningTableApps', async (event, args) => {
        this.runningTableApps = args.apps
        console.log(args.apps)
      })

      ipc.on('updateRunningInfo', (event, args) => {
        let app = this.runningAppsInfo[args.nanoid]
        app.capture = args.info.capture + '?t=' + Date.now()
        app.memoryUsage = args.info.memoryUsage
      })
    }

    document.body.classList.add('lg')
    this.reset()//重置部分状态
    this.sortClock()
    window.updateMusicStatusHandler = this.updateMusic

    this.bindTouchEvents()

    const keyCombinationPressed = async (event) => {
      //重置窗口缩放 ctrl+shift+r  ctrl+shift+t
      if (event.ctrlKey && event.altKey && event.shiftKey && (event.key === 'r' || event.key === 'R')) {

        this.$bus.emit('resetWindow')
        await tsbApi.window.setZoomFactor(1)
        message.success('已为您重置工作台整体缩放')
      }
      if (event.ctrlKey && event.altKey && event.shiftKey && (event.key === 'e' || event.key === 'E')) {
        await tsbApi.window.setBounds({ width: 1200, height: 800 })
        message.success('已为您重置工作台尺寸')
      }
    }

    window.addEventListener('keydown', keyCombinationPressed)
    //this.$router.push({name:'sensor'})
    window.$notice.noticeModal = this.$refs.noticeModal
  },

  computed: {
    ...mapWritableState(cardStore, ['customComponents', 'clockEvent', 'clockFlag']),
    ...mapWritableState(timerStore, ['appDate']),
    ...mapWritableState(appStore, ['styles','userCardVisible', 'fullScreen', 'userCardUid', 'userCardUserInfo', 'settings', 'routeUpdateTime', 'userInfo', 'init',  'loginVisible']),
    ...mapWritableState(codeStore, ['myCode']),
    ...mapWritableState(appsStore, ['runningApps', 'runningAppsInfo', 'runningTableApps']),
    ...mapWritableState(screenStore, ['taggingScreen', 'screenDetail']),
    ...mapWritableState(steamUserStore, ['steamLoginData']),
  },
  methods: {
    ...mapActions(appStore, ['setMusic', 'reset', 'toggleFullScreen', 'exitFullScreen', 'ensureFullScreen']),
    ...mapActions(cardStore, ['sortClock']),
    ...mapActions(codeStore, ['verify']),
    ...mapActions(steamUserStore, ['setUserData', 'setSteamLoginData', 'setGameList', 'addGameDetail', 'onRefreshToken']),
    KeyDown (event) {
      if (event.keyCode === 122) {
        this.toggleFullScreen()
        event.preventDefault()
        event.stopPropagation()
      }
      if (this.fullScreen) {
        if (event.keyCode === 27) {
          this.exitFullScreen()
          event.preventDefault()
          event.stopPropagation()
        }
      }
    },
    loginModal () {
      useLogin()
      this.loginVisible = false
    },

    unLoginModal () {
      this.loginVisible = false
    },

    bindTouchEvents () {
      $('.a-container').on('touchstart', (e) => {
        startX = e.originalEvent.changedTouches[0].pageX,
          startY = e.originalEvent.changedTouches[0].pageY
      })
      $('.a-container').on('touchend', (e) => {
        moveEndX = e.originalEvent.changedTouches[0].pageX,
          moveEndY = e.originalEvent.changedTouches[0].pageY,
          X = moveEndX - startX,
          Y = moveEndY - startY

        if (X > distX) {
          console.log('向右滑', distX)
          //e.preventDefault();
        } else if (X < -distX) {
          console.log('向左滑', distX)
          //e.preventDefault();
        } else if (Y > distY && startY <= 50) {
          if (this.touchDownRoutes.indexOf(this.$route.name) > -1) {
            ipc.send('openGlobalSearch')
            e.preventDefault()
          }
        } else if (Y < -distY) {
          //取消上滑手势
          // if (this.touchUpRoutes.indexOf(this.$route.name) > -1) {
          //   this.$router.push({name: 'status'})
          //   e.preventDefault();
          // }
          //e.preventDefault();
        } else {
          console.log('just touch')
        }
      })
    },
    updateMusic (music) {
      this.setMusic(music)
    },
    ...mapActions(cardStore, ['removeClock', 'sortClock']),
    handleOk () {
      this.visible = false
      this.removeClock(0)
      this.$refs.clock.pause()
    },

  },
  watch: {

    // "appDate.minutes": {
    //   handler(newVal, oldVal) {
    //     this.sortClock()
    //     try {
    //       if (
    //         this.appDate.minutes === this.clockEvent[0].dateValue.minutes &&
    //         this.appDate.hours === this.clockEvent[0].dateValue.hours && this.clockEvent[0].flag === undefined
    //       ) {
    //         this.visible = true;
    //         setTimeout(() => {
    //           this.$refs.clock.play();
    //         }, 1000)
    //       }
    //     } catch (err) {

    //     }
    //   },
    //   immediate: true,
    // },
    // "clockFlag": {
    //   handler(newVal, oldVal) {
    //     try {
    //       if (
    //         this.appDate.minutes === this.clockEvent[0].dateValue.minutes &&
    //         this.appDate.hours === this.clockEvent[0].dateValue.hours && this.clockEvent[0].flag === undefined
    //       ) {
    //         this.visible = true;
    //         setTimeout(() => {
    //           this.$refs.clock.play();
    //         }, 1000)
    //       } else {
    //         this.visible = false;
    //         this.$refs.clock.pause()
    //       }
    //     } catch (err) {

    //     }
    //   },
    //   immediate: true,
    // },
    'userInfo.onlineGradeExtra': {
      handler (newVal, oldVal) {
        window.lv = 1
        if (this.userInfo.onlineGradeExtra) {
          window.lv = this.userInfo.onlineGradeExtra.lv
        }

      },
      immediate: true,
    },

    'styles': {
      handler () {
        if (usePlat('client')) {
          tsbApi.system.setDarkMode(!this.styles)
        }
      },
      immediate: true,
      deep:true
    },
    'steamLoginData.refreshToken': {
      handler () {
        this.onRefreshToken()
      },
      immediate: false,
    },
  },
}
</script>

<style>
@import "./assets/common.css";

.a-container {
  width: 100%;
}


.hevue-imgpreview-wrap{
  z-index: 1000000 !important;
}
</style>

