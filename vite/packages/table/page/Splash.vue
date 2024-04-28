<template>
  <div
    style="
      display: flex;
      height: 100vh;
      text-align: center;
      align-content: center;
      align-items: center;
      background: #333;
      justify-content: center;
    "
    class="drag"
  >
    <!-- 加载动画 -->
    <div v-if="launching" style="margin: auto">
      <div class="mb-5 animate-bounce">
        <a-avatar
          :size="60"
          src="https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/8befa3834d2eb29e75685563ef513215.png?imageMogr2/crop/260x260/gravity/center"
        ></a-avatar>
      </div>
      <div style="font-size: 1.2em">
        <svg
          style="vertical-align: text-bottom"
          class="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        欢迎回来，又是元气满满的一天！
      </div>
    </div>
  </div>
</template>

<script>
import { message } from 'ant-design-vue'
import { appStore } from '../store'
import { mapWritableState, mapActions } from 'pinia'
import { codeStore } from '../store/code'
import { cardStore } from '../store/card'
import { deckStore } from '../apps/deck/store'
import { paperStore } from '../store/paper'
import { weatherStore } from '../store/weather'
import { screenStore } from '../store/screen'
import { isMain } from '../js/common/screenUtils'
import { teamStore } from '../store/team'
import { steamUserStore } from '../store/steamUser'
import { captureStore } from '../store/capture'
import { navStore } from '../store/nav'
import { clipboardStore } from '../apps/clipboard/store'
import { browserStore } from '../store/browser'
// import { chatStore } from "../store/chat";
import taskStore from '../page/app/todo/stores/task'
import cache from '../components/card/hooks/cache'
import { useWidgetStore } from '../components/card/store'
// import { clockStore } from '../components/widgets/clock/hooks/clockStore';
export default {
  name: 'Code',
  data () {
    return {
      // loginVisible: false,
      launching: true,
      storeReadyTimer: null,
      // launched: false,
      // version: window.$usePlat() ? "" : tsbApi.runtime.appVersion,
      // 超时定时器
      // timeout: null,
    }
  },
  created () {
    if (this.$usePlat('web')) {
      //如果是web端，则直接跳过splash界面，状态类的在后面进行判断
      this.$router.replace({ name: 'home' })
      //直接跳过wizarde引导
      localStorage.setItem('wizarded', '1')
    }
  },
  async mounted () {
    // 初始化Stores，读入相关的配置
    this.initStores()
    //设置计时器等待全部的store初始化完成
    this.storeReadyTimer = setInterval(async () => {
      let loadQueue = Object.keys(window.loadedStore).filter((key) => {
        let check = !window.loadedStore[key]
        if (window.loadedStore[key] === false) return check
      })
      //已经全部搞定
      if (loadQueue.length <= 0) {
        clearInterval(this.storeReadyTimer)
        await this.clientInit()
        if (!this.init && isMain()) {
          //进入客户端首次设置界面
          this.$router.replace({ name: 'wizard' })
        }else {
          this.$router.replace({ name: 'home' })
          //结束整个splash，直接进入home
        }
        //this.enter()
      }
    }, 500)
    //闹钟事件
    this.sortClock()
  },
  computed: {
    ...mapWritableState(codeStore, ['myCode', 'serialHash']),
    ...mapWritableState(appStore, [
      'aided',
      'settings',
      'routeUpdateTime',
      'userInfo',
      'init',
      'lvInfo',
      'backgroundImage',
      'style',
      'visibleWeb',
    ]),
    ...mapWritableState(navStore, [
      'sideNavigationList',
      'footNavigationList',
      'rightNavigationList',
    ]),
  },
  methods: {
    ...mapActions(cardStore, ['sortClock', 'sortCountdown']),
    ...mapActions(screenStore, ['bindMainIPC', 'bindSubIPC', 'onTableStarted']),
    ...mapActions(codeStore, ['active', 'getSerialHash', 'verify']),
    ...mapActions(appStore, [
      'getUserInfo',
      'setUser',
      'enterAided',
      'ensureShake',
      'finishWizard',
    ]),
    ...mapActions(steamUserStore, ['bindClientEvents']),
    ...mapActions(captureStore, ['bindCaptureIPC']),
    async bindIPC () {
      if (isMain()) {
        this.bindMainIPC()
      } else {
        this.bindSubIPC()
      }
    },
    async initStores () {
      this.initStore(appStore, 'appStore')
      this.initStore(codeStore, 'code')
      this.initStore(cardStore, 'cardStore')
      this.initStore(weatherStore, 'weather')
      this.initStore(paperStore, 'paper')
      this.initStore(deckStore, 'deck')
      this.initStore(screenStore, 'screen')
      this.initStore(teamStore, 'teamStore')
      this.initStore(navStore, 'nav')
      this.initStore(taskStore, 'task')
      this.initStore(useWidgetStore, 'useWidgetStore')
      this.initStore(clipboardStore, 'clipboardStore')
    },
    enter () {
      // chatStore().login();
      if (localStorage.getItem('wizarded')) {
        //已经进过引导了
        const currentRoute = appStore().currentRoute
        if (currentRoute) {
          if (['lock', 'power', 'splash'].includes(currentRoute.name) || true) {
            //阻止lock、power页面的自动跳转
            this.$router.replace({ name: 'home' })
          } else {
            // 处理分屏情况下默认跳转到wizard的问题
            if (currentRoute.name == 'wizard' && !isMain()) {
              this.$router.replace({ name: 'home' })
            } else {
              this.$router.replace(currentRoute)
            }
          }
        } else {
          this.$router.replace({ name: 'home' })
        }
      } else {
        // 处理分屏情况下默认读取不到存储的问题
        if (!isMain()) {
          console.log('分支2 - 1 :>> ',)
          const currentRoute = appStore().currentRoute
          if (currentRoute.name == 'wizard' || currentRoute.name == 'splash') {
            this.$router.replace({ name: 'home' })
          } else {
            this.$router.replace(currentRoute)
          }
        } else {
          console.log('分支2 - 2 :>> ',)
          this.$router.replace({ name: 'home' })
        }
      }
    },

    async initStore (store, name) {
      // loadedStore 不存在初始化对象
      if (!window.loadedStore) {
        window.loadedStore = {}
      }

      // console.log("name :>> ", name);
      // console.log('window.loadedStore[name] :>> ', window.loadedStore[name]);

      if (typeof window.loadedStore[name] === 'undefined') {
        window.loadedStore[name] = false
      }
      let res = await store()
      return res
    },
    /**
     * 客户端初始化，主要是对一些客户端上的辅助模式、剪切板、摇一摇、分屏之类的功能进行初始化事件绑定
     * @returns {Promise<void>}
     */
    async clientInit () {
      if (this.aided) {
        message.warn(
          '当前应用正运行在辅助模式下，无法被聚焦。如需退出，请到【设置】界面关闭。'
        )
        this.enterAided()
      }
      this.bindCaptureIPC()

      //浏览器的事件绑定
      browserStore().bindIPC()
      //绑定客户端的ipc
      this.bindIPC()
      //启动检测项的store，必须已经载入的项目，如果这边不写，就不确保必须载入完成
      //注意，此处的第二个参数，必须和此store同名，尤其注意有些命名里带了store的
      captureStore()
      clipboardStore().prepare()
      clipboardStore().start()

      //执行分屏的启动操作
      this.onTableStarted().then()
      if (!this.settings.zoomFactor) {
        this.settings.zoomFactor = 100
      }

      //初始化摇一摇功能状态
      this.ensureShake(false)
      //根据设置进行缩放比的强制调整
      await tsbApi.window.setZoomFactor(+this.settings.zoomFactor / 100)
      //根据配置，完成在任务栏隐藏图标的设置
      tsbApi.window.setSkipTaskbar(!this.settings.showInTaskBar)
    },



    // onGuest() {
    //   this.$router.replace({ name: "home" });
    //   if (!this.init && this.$usePlat()) {
    //     this.finishWizard();
    //     this.visibleWeb = true;
    //   }
    //   cache.set("isGuest", true);
    // },
  },
  beforeDestroy () {},
}
</script>

<style></style>
