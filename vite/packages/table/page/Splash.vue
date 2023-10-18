<template>
  <div
    style="display:flex;height: 100vh;text-align: center;align-content: center;align-items: center;background:#333;justify-content: center"
    class="drag">
    <div v-if="launching" style="margin: auto;">
      <div class="mb-5 animate-bounce ">
        <a-avatar :size="60"
                  src="https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/8befa3834d2eb29e75685563ef513215.png?imageMogr2/crop/260x260/gravity/center"></a-avatar>
      </div>
      <div style="font-size: 1.2em;">
        <svg style="vertical-align: text-bottom" class="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
        欢迎回来，又是元气满满的一天！
      </div>
    </div>
    <div v-else style="background: #333;width: 100vw;height:auto" class="">
      <div class="p-10 rounded-lg no-drag s-bg" style="width: 600px;margin: auto">

        <h3 style="text-align: center;font-size: 1.5em">
          <a-avatar style="vertical-align: top" src="/icons/logo128.png"></a-avatar>
          想天工作台
        </h3>
        <div class="mb-10 ml-40 text-center text-md">—— 划时代的副屏效率神器</div>
        <p v-if="!userInfo">
          <div class="mb-5 xt-text" style="font-size: 16px">
            由于本产品功能需要借助网络，目前暂未提供离线模式。<br>
            <strong>请登录后使用。</strong><br>

          </div>
          <div class="mb-10 xt-text-2">如遇网络问题，请检查系统代理或耐心等待。</div>
          <a-row :gutter="10" class="w-full">
            <a-col flex="1">
              <xt-button size="mini" style="width: 100%" type="theme" @click="login">登录/注册账号</xt-button>
            </a-col>
            <a-col flex="150px" v-if="netError">
              <xt-button style="width: 100%" @click="getUserInfo">重试</xt-button>
            </a-col>
          </a-row>


        </p>
        <div class="text-center" v-else>
          <div class="inline-block mt-3 mb-3">
            <div>
              <a-avatar :size="68" :src="userInfo.avatar"></a-avatar>
            </div>
            <div class="mt-4 text-lg">
              你好，{{ userInfo.nickname }}
            </div>
          </div>
        </div>
        <div class="flex">
          <a-button block v-if="userInfo" type="primary" size="large" class="m-3" @click="goDirect">开始使用</a-button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { message, Modal } from 'ant-design-vue'
import { appStore } from '../store'
import { mapWritableState, mapActions } from 'pinia'
import { codeStore } from '../store/code'
import { cardStore } from '../store/card'
import { deckStore } from '../apps/deck/store'
import { paperStore } from '../store/paper'
import { weatherStore } from '../store/weather'
import { screenStore } from '../store/screen'
import { isMain } from '../js/common/screenUtils'
import { inspectorStore } from '../store/inspector'
import { teamStore } from '../store/team'
import { steamUserStore } from '../store/steamUser'
import { captureStore } from '../store/capture'
import { navStore } from '../store/nav'
import { clipboardStore } from '../apps/clipboard/store'
import { browserStore } from '../store/browser'
import RayMedal from '../components/small/RayMedal.vue'
import { chatStore } from '../store/chat'
import navigationData from '../js/data/tableData'

export default {
  name: 'Code',
  components: { RayMedal },
  data () {
    return {
      showTip: false,
      loading: false,
      netError: false,
      code: '',
      launching: true,
      storeReadyTimer: null,
      launched: false,
      modal: null,
      timeoutHandler: null,
      version: tsbApi.runtime.appVersion
    }
  },
  async mounted () {
    //启动检测项的store，必须已经载入的项目，如果这边不写，就不确保必须载入完成
    //注意，此处的第二个参数，必须和此store同名，尤其注意有些命名里带了store的
    this.initStore(appStore, 'appStore')
    this.initStore(codeStore, 'code')
    this.initStore(cardStore, 'cardStore')
    this.initStore(weatherStore, 'weather')
    this.initStore(paperStore, 'paper')
    this.initStore(deckStore, 'deck')
    this.initStore(screenStore, 'screen')
    this.initStore(teamStore, 'teamStore')
    this.initStore(inspectorStore, 'inspectorStore')
    this.initStore(navStore, 'nav')
    // this.initStore(browserStore,'browserStore')
    browserStore().bindIPC()
    captureStore()//仅触发一下载入
    clipboardStore()
    if (isMain()) {
      this.bindMainIPC()
    } else {
      this.bindSubIPC()
    }

    window.loadedStore['userInfo'] = false

    this.bindUserInfoResponse()

    setTimeout(() => {
      this.storeReadyTimer = setInterval(() => {
        if (!this.launching) {
          return
        }
        if (Object.keys(window.loadedStore).some(key => {
          let check = !window.loadedStore[key]
          if (window.loadedStore[key] === false)
            return check
        })) {
          //未全部搞定
          return
        } else {
          //已经全部搞定
          clearInterval(this.storeReadyTimer)
          this.afterLaunch()
        }
      }, 1000)
    }, 100)

    this.getUserInfo()
    this.sortClock()

  },
  computed: {
    ...mapWritableState(codeStore, ['myCode', 'serialHash']),
    ...mapWritableState(appStore, ['settings', 'routeUpdateTime', 'userInfo', 'init', 'lvInfo', 'backgroundImage', 'style']),
    ...mapWritableState(navStore, ['sideNavigationList', 'footNavigationList', 'rightNavigationList']),
  },
  methods: {
    ...mapActions(cardStore, ['sortClock', 'sortCountdown']),
    ...mapActions(screenStore, ['bindMainIPC', 'bindSubIPC', 'onTableStarted']),
    ...mapActions(codeStore, ['active', 'getSerialHash', 'verify']),
    ...mapActions(appStore, ['getUserInfo', 'setUser']),
    ...mapActions(steamUserStore, ['bindClientEvents']),
    ...mapActions(captureStore, ['bindCaptureIPC']),
    timeout () {
      this.timeoutHandler = setTimeout(() => {
        Modal.error({
          content: '服务器连接超时。可能服务器正在维护，请稍后再试。',
          key: 'error',
          okText: '重试',
          centered: true,
          onOk: () => {
            window.location.reload()
          }
        })
      }, 5000)
    },
    goDirect () {
      this.$router.replace({ name: 'wizard' })
      localStorage.setItem('wizarded', 1)
    },
    enter () {
      clearTimeout(this.timeoutHandler)//清理掉超时提示
      chatStore().login()
      if (localStorage.getItem('wizarded')) {
        const currentRoute = appStore().currentRoute
        if (currentRoute) {
          if (['lock', 'power'].includes(currentRoute.name)) {
            //阻止lock、power页面的自动跳转
            this.$router.replace({ name: 'home' })
          } else {
            this.$router.replace(currentRoute)
          }
        } else {
          this.$router.replace({ name: 'home' })
        }
      }

    },
    bindUserInfoResponse () {
      ipc.removeAllListeners('userInfo')
      ipc.on('userInfo', async (event, args) => {
        console.error(args, '参数')
        if (args.data.uid === -2) {
          this.netError = true
          message.error({
            content: '网络错误，请重试', key: 'net'
          })
        }
        this.tipped = false
        this.loading = false
        if (args.data.uid <= 0) {
          window.loadedStore['userInfo'] = true
          return
        }

        const userInfo = args.data

        let lvInfo = this.lvInfo
        lvInfo.lv = userInfo.onlineGradeExtra.lv
        let current = this.gradeTableGenerate(64)[lvInfo.lv]
        let section = this.gradeTableGenerate(64)[lvInfo.lv + 1]
        let remain = section[0] * 60 - (userInfo.onlineGradeExtra.minutes)
        lvInfo.remainHour = Math.floor(remain / 60)
        lvInfo.remainMinute = remain - (Math.floor(remain / 60) * 60)
        lvInfo.minute = userInfo.onlineGradeExtra.minutes
        lvInfo.percentage = ((lvInfo.minute - current[0] * 60) / ((current[1] - current[0]) * 60)) * 100
        //this.lvInfo = lvInfo
        window.loadedStore['userInfo'] = true
        this.setUser(userInfo)
        if (this.$route.name === 'splash') {
          this.enter()
        }
      })
    },
    initStore (store, name) {
      if (!window.loadedStore) {
        window.loadedStore = {}
      }
      if (typeof window.loadedStore[name] === 'undefined') {
        window.loadedStore[name] = false
      }
      store()
    },

    async afterLaunch () {
      this.bindCaptureIPC()

      this.bindClientEvents()

      clipboardStore().prepare()
      clipboardStore().start()

      //执行分屏的启动操作
      this.onTableStarted().then()
      if (!this.settings.zoomFactor) {
        this.settings.zoomFactor = 100
      }
      await tsbApi.window.setZoomFactor(+this.settings.zoomFactor / 100)//根据设置进行缩放比的强制调整
      if (this.settings.darkMod) {
        // if( this.backgroundImage.path===''&&!this.backgroundImage.runpath) {
        //   document.body.style.background = '#191919'
        //
        //
        // }else if(this.backgroundImage.runpath){
        //
        // }else{
        //   document.body.style.background=  ''
        //   document.body.style.backgroundImage = "url(" + this.backgroundImage.path + ")"
        // }
      }
      this.launching = false
      if (!this.userInfo) {
        //如果个人信息不存在，则直接返回
        return
      } else {
        this.enter()
      }

    },
    gradeTableGenerate (num) {
      let lvSys = {}
      for (let i = 0; i < num + 1; i++) {
        let arrLef = 0
        let arrRg = 0
        for (let j = 0; j < i; j++) {
          arrLef += 10 * (j + 2)
        }
        for (let k = 0; k < i + 1; k++) {
          arrRg += 10 * (k + 2)
        }
        arrRg -= 1
        lvSys[`${i}`] = [arrLef, arrRg]
      }
      delete lvSys['lv0']
      return lvSys
    },
    login () {
      tsbApi.user.login((data) => {
        this.getUserInfo()
      })
    },
  },
}
</script>

<style>
.ant-modal-body {
  -webkit-app-region: no-drag;
}
</style>
