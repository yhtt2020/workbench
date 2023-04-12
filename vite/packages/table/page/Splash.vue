<template>
  <div style="display:flex;height: 100vh;text-align: center;align-content: center;align-items: center;" class="no-drag"
       v-if="launching">
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        欢迎回来，又是元气满满的一天！
      </div>

    </div>

  </div>
  <div v-else style="background: #333;width: 100vw;height: 100vw;" class="p-10 drag">
    <div class="no-drag" style="width: 600px;margin: auto">
      <h3 style="text-align: center;font-size: 1.5em">欢迎参与想天工作台抢鲜体验</h3>
      <p>目前我们尚未完全面向大众开放，必须使用邀请码方可体验产品。
        <a-button @click="()=>{this.showTip=!this.showTip}">什么是抢鲜体验？</a-button>
      </p>
      <div v-if="showTip" class="p-5 mb-3" style="background: #3b3b3b;border-radius: 8px;border-width: 2px">
        <p style="font-weight: bold">
          EA阶段说明：
        </p>
        <p class="mb-1">
          EA（抢鲜体验）意味着产品尚未达到我们认为的成熟状态。目前所有的功能都不代表完成状态。我们极有可能在任何时刻对功能做修改。
        </p>
      </div>
      <p>
        您可通过以下多种途径获得邀请码：
      </p>
      <p>
        1.参与各类产品活动，例如在产品群内等待发码，我们将不定期在产品群发码。
      </p>
      <p>
        2.通过老用户邀请，每一位老用户均可通过在线使用时长兑换邀请码。
      </p>

      <p v-if="!userInfo">
        请登录账号后，确认是否具备体验资格。
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

          <div class="mt-3 mb-3 text-red-500">抱歉，您暂时还不具备抢鲜体验资格。您可输入激活码激活账号。</div>
          <p v-if="myCode">检测到您已使用过激活码：{{ myCode }}，可直接填入发车
            <a-button @click="code=myCode" class="ml-3">填入</a-button>
          </p>
          <p>
            <a-input v-model:value="code" placeholder="请输入邀请码" size="large"></a-input>
          </p>
        </div>

      </div>

      <a-button :loading="loading" @click="checkCode" :disabled="code===''" block type="primary" size="large">
        Go ! 发车
      </a-button>
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

export default {
  name: 'Code',
  data () {
    return {
      showTip: false,
      loading: false,
      code: '',
      launching: true,
      storeReadyTimer: null,
      launched: false
    }
  },
  async mounted () {
    /**
     *   store:false,
     *   code:false,
     *   cardStore:false,
     *   weather:false,
     *   deck:false,
     *   paper:false,
     */
    //window.loadedStore={}//启动检测项的store，必须已经载入的项目，如果这边不写，就不确保必须载入完成
    this.initStore(appStore, 'appStore')
    this.initStore(codeStore, 'code')
    this.initStore(cardStore, 'cardStore')
    this.initStore(weatherStore, 'weather')
    this.initStore(paperStore, 'paper')
    this.initStore(deckStore, 'deck')
    window.loadedStore['userInfo'] = false
    ipc.removeAllListeners('userInfo')
    ipc.on('userInfo', (event, args) => {
      console.log('获取到userInfo，并进行数据填充和提示')
      this.tipped = false
      this.loading = false
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
        this.verify(userInfo.uid).then(rs => {
          if (rs) {
            if(userInfo.uid!==this.userInfo.uid){
              Modal.success({
                content: '您的账号具备EA资格，点击确定即可发车。',
                centered:true,
                onOk: () => {
                  this.$router.replace({
                    name: 'home'
                  })
                }
              })
            }
          } else {
            Modal.error({
              content: '抱歉，您的账号不具备EA资格，请验证邀请码。',
              centered:true,
              onOk: () => {}
            })
          }
        })
      }
      this.setUser(userInfo)
    })


    console.log(window.loadedStore, '已经初始化检测数组')
    this.storeReadyTimer = setInterval(() => {
      if (!this.launching) {
        console.log('已经没在运行了')
        return
      }
      if (Object.keys(window.loadedStore).some(key => {
        let check = !window.loadedStore[key]
        console.log(check, key)
        return check
      })) {
        //未全部搞定
        return
      } else {
        console.log('检测到已经全部载入完成')
        //已经全部搞定
        clearInterval(this.storeReadyTimer)
        this.afterLaunch()
      }
    }, 1000)

    this.getUserInfo()

    if (location.href.startsWith('tsbapp://./')) {
      //新版本直接设置为已合并
      await tsbApi.settings.set('migratedTable', true)
      location.href = 'tsbapp://table.com/table.html'
    }
  },
  computed: {
    ...mapWritableState(codeStore, ['myCode', 'serialHash']),
    ...mapWritableState(appStore, ['settings', 'routeUpdateTime', 'userInfo', 'init', 'lvInfo']),
  },
  methods: {
    initStore (store, name) {
      if (!window.loadedStore) {
        window.loadedStore = {}
      }
      if (typeof window.loadedStore[name] === 'undefined') {
        window.loadedStore[name] = false
      }
      store()
    },
    ...mapActions(codeStore, ['active', 'getSerialHash', 'verify']),
    ...mapActions(appStore, ['getUserInfo', 'setUser']),
    afterLaunch () {
      if (this.settings.darkMod) {
        document.body.style.background = '#191919'
      }
      this.verify(this.userInfo.uid).then(rs => {
        //只要提供了uid，就能基于uid验证
        if (!rs) {
          console.log('验证码无效')
          this.launching = false
          return
        } else {
          this.$router.replace({ path: '/index/' })
        }
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
          message.error('激活码无效，请重试')
          return
        } else {
          this.myCode = this.code
          let timer = setTimeout(() => {
            this.$router.replace({ path: '/wizard' })

          }, 10000)
          Modal.success({
            centered: true,
            content: '激活成功，欢迎来到EA阶段，点击“发车”开始体验，10秒后自动进入。',
            onOk: () => {
              clearTimeout(timer)
              this.$router.replace({ path: '/wizard' })
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
  }
}
</script>

<style >
.ant-modal-body{
  -webkit-app-region:no-drag;
}
</style>
