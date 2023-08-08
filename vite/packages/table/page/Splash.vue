<template>
  <div style="display:flex;height: 100vh;text-align: center;align-content: center;align-items: center;background:#333"
       class="no-drag" v-if="launching">
    <div style="margin: auto;">
      <div class="animate-bounce mb-5 ">
        <a-avatar :size="60"
                  src="https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/8befa3834d2eb29e75685563ef513215.png?imageMogr2/crop/260x260/gravity/center"></a-avatar>
      </div>
      <div style="font-size: 1.2em;">
        <svg style="vertical-align: text-bottom" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
       欢迎回来，又是元气满满的一天！
      </div>

    </div>

  </div>
  <div v-else style="background: #333;width: 100vw;height: 100vw;" class="p-10 drag">
    <div class="no-drag" style="width: 600px;margin: auto">
      <h3 style="text-align: center;font-size: 1.5em"> <a-avatar style="vertical-align: top" src="/icons/logo128.png"></a-avatar> 欢迎参与想天工作台公测</h3>
      <p>虽然我们已经过一段时间的内测，但目前仍未正式发行。<br>不过您可以<strong>“无码体验”</strong>。
        <a-button size="small" type="primary" @click="() => { this.showTip = !this.showTip }">什么是公测？</a-button>
      </p>
      <div v-if="showTip" class="p-5 mb-3" style="background: #3b3b3b;border-radius: 8px;border-width: 2px">
        <p style="font-weight: bold">
          公测阶段：
        </p>
        <p class="mb-1">
         公测意味着产品已经具备一定的实用性。 但仍未达到我们认为的成熟状态。<br>目前所有的功能都不代表最终效果。我们仍会随时对这些功能做较大调整。
        </p>
      </div>
      <p>
        您也可通过邀请码激活产品：
      </p>
      <p>
        1.通过邀请码激活可额外获得&nbsp;<RayMedal  :size="50" src="https://a.apps.vip/icons/test_sm.png" />&nbsp;受邀测试勋章。
      </p>
      <p>
        2.通过老用户邀请，老用户可通过在线使用时长兑换邀请码。
      </p>
      <p>
        3.您可在后期补填邀请码获得勋章。
      </p>
      <p v-if="!userInfo">
        请先登录。
        <a-button type="primary" @click="login">登录/注册账号</a-button>
      </p>
      <div v-else>当前登录账号：
        <div class="mb-3 mt-3 pl-5 pr-5">
          <a-row class="" :gutter="10">
            <a-col>
              <a-avatar :src="userInfo.avatar"></a-avatar>
            </a-col>
            <a-col class="pt-1 ">
              {{ userInfo.nickname }}
            </a-col>
            <a-col>
              <a-button type="primary" @click="login">更换账号</a-button>
            </a-col>
          </a-row>
          <!--        <a-input v-model:value="code" placeholder="请输入邀请码" size="large"></a-input>-->

          <div v-if="!myCode" class="mt-3 mb-3"></div>
          <p v-if="myCode" class="mt-2">检测到您已使用过激活码：<span style="user-select: text;font-weight: bold">{{
              myCode
            }}</span>，可直接填入发车。如遇已激活但无法验证的情况，请确认网络（如梯子），并退出重试，若多次重试仍不可验证，请更新版本，联系QQ<span
            style="user-select: text;font-weight: bold">276905621</span>，重新领码。
            <a-button type="primary" @click="code = myCode" size="small" class="ml-3">填入</a-button>
            当前版本：<span
              style="user-select: text;font-weight: bold">{{ version }}</span>
          </p>
          <p>
            <a-input v-model:value="code" placeholder="请输入邀请码以兑换勋章" size="large"></a-input>
          </p>
        </div>

      </div>

      <div class="flex">
        <a-button class="m-3" :loading="loading" @click="checkCode" :disabled="code === ''" block type="primary"
                  size="large">
         发车！
        </a-button>
        <a-button v-if="userInfo" type="primary" size="large" class="m-3"  @click="goDirect">直接进入</a-button>
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
import { deckStore } from '../store/deck'
import { paperStore } from '../store/paper'
import { weatherStore } from '../store/weather'
import { screenStore } from '../store/screen'
import { isMain } from '../js/common/screenUtils'
import { inspectorStore } from '../store/inspector'
import { teamStore } from '../store/team'
import { steamUserStore } from '../store/steamUser'
import { captureStore } from '../store/capture'
import { navStore } from '../store/nav'
import {clipboardStore} from "../store/clipboard";
import { browserStore } from '../store/browser'
import RayMedal from '../components/small/RayMedal.vue'
import { chatStore } from '../store/chat'

export default {
  name: 'Code',
  components: { RayMedal },
  data () {
    return {
      showTip: false,
      loading: false,
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
          this.afterLaunch().then()
        }
      }, 1000)
    }, 100)

    this.getUserInfo()
    this.sortClock()

  },
  computed: {
    ...mapWritableState(codeStore, ['myCode', 'serialHash']),
    ...mapWritableState(appStore, ['settings', 'routeUpdateTime', 'userInfo', 'init', 'lvInfo', 'backgroundImage', 'style']),
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
          content: '服务器连接超时。无法验证激活信息。请稍后再试。',
          key: 'error',
          okText: '重试',
          centered: true,
          onOk: () => {
            window.location.reload()
          }
        })
      }, 5000)
    },
    goDirect(){
      localStorage.setItem('noCode','1')
      this.$router.replace({ name: 'wizard' })
    },
    enter () {
      clearTimeout(this.timeoutHandler)//清理掉超时提示
      chatStore().login()
      //this.$router.replace({ name: 'wizard' })
       this.$router.replace({ name: 'home' })
    },
    bindUserInfoResponse () {
      ipc.removeAllListeners('userInfo')
      ipc.on('userInfo', async (event, args) => {
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
        if (this.$route.name === 'splash') {
          let rs = await this.verify(userInfo.uid)
          if (rs) {
            this.$router.replace({ name: 'home' })
          } else {
            if(localStorage.getItem('noCode')){
              //已经是免码进入了，不需要再提示了
              this.$router.replace({ name: 'home' })
            }else{
              Modal.confirm({
                content: '您的账号暂未通过邀请码激活，无法获得勋章。您可点击直接进入，免激活码使用。',
                centered: true,
                onOk: () => {
                  localStorage.setItem('noCode','1')
                  this.$router.replace({ name: 'wizard' })
                },
                okText:"直接进入",
                cancelText:'取消'
              })
            }

          }
        }
        this.setUser(userInfo)
      })
    },
    async verifyAgain () {
      if (!this.userInfo) {
        message.info('请登录后重试')
        return
      } else {
        let rs = await this.verify(this.userInfo.uid)
        if (rs) {
          message.success('欢迎回来')
          this.$router.replace({ name: 'home' })
        } else {
          Modal.error({
            content: '您当前的账号为直接体验用户，点击直接进入。',
            centered: true,
            onOk: () => {
              this.$router.replace({ name: 'home' })
            },
            okText:'直接进入'
          })
        }

      }
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

      if(clipboardStore().enable){
        clipboardStore().prepare()
        clipboardStore().start()
      }

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
      if(!this.userInfo){
        //如果个人信息不存在，则直接返回
        this.launching = false
        return
      }
      this.verify(this.userInfo.uid).then(rs => {
        //只要提供了uid，就能基于uid验证
        if (!rs) {
          // this.enter()
          this.launching = false
          return
        } else {

          this.enter()
        }
      }).catch((err) => {
        Modal.error({
          content: '服务器连接超时。无法验证激活信息。您可直接进入。',
          key: 'error',
          okText: '直接进入',
          centered: true,
          onOk: () => {
            this.enter()// this.$router.replace({ name: 'home' })
          },
        })
      }).finally(() => {
        this.launching = false
      })

    },
    checkCode () {
      this.loading = true
      let hash = this.getSerialHash()
      if (this.code === '') {
        message.error('请输入邀请码')
        return
      }

      if (this.code.length !== 16) {
        message.error('激活码长度错误')
        return
      }
      this.active(this.code, hash, this.userInfo.uid).then(rs => {
        this.loading = false
        if (rs.code !== 1000) {
          message.error('邀请码验证不通过或已被使用（请点击验证），请检查网络（代理）或退出后重试。')
          return
        } else {
          this.myCode = this.code
          let timer = setTimeout(() => {
            this.modal.destroy()
            this.$router.replace({ name: 'wizard' })
          }, 10000)
          this.modal = Modal.success({
            centered: true,
            content: '兑换成功，欢迎受邀参与测试，点击“发车”开始体验，10秒后自动进入。',
            onOk: () => {
              clearTimeout(timer)
              this.$router.replace({ name: 'wizard' })
            },
            okText: '发车'
          })
          return

        }


      }).catch(e => {
        this.loading = false
        message.error('服务器无响应，请稍后再试')
      })
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
