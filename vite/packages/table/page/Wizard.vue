<template>
  <div style="height: 100vh;width: 100vw" class="flex items-center justify-center bg-image">
    <div class="p-4 relative body-shadow">
      <div class="font-16" style="text-align: center;-webkit-app-region:drag;color: var(--primary-text);height: 140px;">
        <div style="height:90px;">
          <div v-if="step!==0" @click="prevStep" class="left-icon top-icon no-drag float-left">
            <!-- <xt-button v-if="step!==0" @click="prevStep" style="" size="large" class="button-bottom">上一步</xt-button> -->
            <MyIcon icon="fluent:chevron-left-16-filled"  width="20" height="20"/>
          </div>
          <div @click="themeSwitch" class="right-icon top-icon no-drag float-right">
            <MyIcon icon="fluent:weather-moon-16-regular"  width="20" height="20"/>
          </div>
        </div>
        <div>{{ title }}</div>
      </div>
      <div
      class="mt-4 w-full"
        style="text-align: left;font-size: 1.2em;margin: auto;position: relative;">
        <!-- <div style="padding: 0.5em">
          <a-steps :current="step" size="large">
            <a-step v-for="item in steps" :title="item.title"/>
          </a-steps>
        </div> -->
        <div v-if="step===0">
          <div class="font-16" style="margin-bottom: 2em;text-align: center;color: var(--secondary-text);" v-if="true">
            如果正在使用扩展屏或者副屏幕，推荐使用「副屏模式」
            <div class="flex justify-center">
              没有副屏？点击了解 &nbsp;
              <a @click="openVideo" class="flex items-center" style="color: #00AEEC;">
              <MyIcon icon="tabler:brand-bilibili" width="20" height="20"  />&nbsp;
              Spacedesk | 把任意设备变成你的第二屏幕，手机、平板、电脑都可以！</a>
            </div>
          </div>
          <div style="margin-bottom: 1em" v-else>
            您当前仅有一块屏幕，无法启用副屏模式，您可在增添副屏后启用。<a>了解更多</a>
          </div>
          <a-row :gutter="20" class="flex justify-center">
            <a-col >
              <div :class="{'active':mod==='second-screen'}" @click="this.mod='second-screen'" class="panel pointer px-5 pt-6">
                <div class="title">
                  <MyIcon icon="fluent:tablet-16-regular" width="50px" height="50px" color="var(--primary-text)" />
                  <div class="mt-2">副屏全屏模式</div>
                </div>
                <div class="content mt-4">
                  专为副屏优化，自动缩放界面和字体，提供适合触控操作的交互。
                </div>
              </div>
            </a-col>
            <a-col >
              <div :class="{'active':mod==='bootstrap'}" @click="this.mod='bootstrap'" class="panel pointer px-5 pt-6">
                <div class="title">
                  <!-- <icon icon="kuaijie" style="font-size: 50px"></icon> -->
                  <MyIcon icon="fluent:window-multiple-16-filled" width="50px" height="50px" color="var(--primary-text)" />
                  <div class="mt-2">窗口模式</div>
                </div>
                <div class="content mt-4">
                  以普通应用窗口的模式运行，默认使用ALT+Z组合键控制显示和隐藏。
                </div>
              </div>
            </a-col>
          </a-row>


        </div>
        <div v-if="step===1 && mod==='second-screen'" class="flex justify-center">

          <div v-if="screenSettingTab==='none'" class="mt-6">

            <a-row class="screen-section" @click="screenSettingTab='touch'">
              <a-col :span="19">
                <div>
                  副屏是否已经可正确识别触摸？
                </div>
                <div class="font-title">异常情况：触摸副屏，反馈在主屏的情况。</div>
              </a-col>
              <a-col :span="5" class="font-button">
                设置触摸 <MyIcon icon="fluent:chevron-right-16-regular" color='var(--secondary-text)'/>
                <!-- <a-button v-if="screenSettingTab!=='touch'" type="primary"> 矫正屏幕
                </a-button> -->
              </a-col>
            </a-row>
            <a-row class="screen-section" @click="screenSettingTab='choose'">
              <a-col :span="19">
                <div>
                  工作台是否显示在了您期望的屏幕上？
                </div>
              </a-col>
              <a-col :span="5" class="font-button">
                选择屏幕 <MyIcon icon="fluent:chevron-right-16-regular" color='var(--secondary-text)'/>
              </a-col>
            </a-row>
            <a-row class="screen-section" @click="screenSettingTab='scale'">
              <a-col :span="19">
                <div>
                  工作台界面显示不自然？
                </div>
                <div class="font-title">字体过小、难以触摸、边缘留白过大、显示不全。</div>
              </a-col>
              <a-col :span="5" class="font-button">
                设置缩放 <MyIcon icon="fluent:chevron-right-16-regular" color='var(--secondary-text)'/>
                <!-- <a-button type="primary">设置缩放</a-button> -->
              </a-col>
            </a-row>
          </div>

          <div v-if="screenSettingTab==='touch'">
            <div class="screen-section xt-text" style="line-height: 2;margin-top: 3em;padding: 32px;" v-if="screenSettingTab==='touch'">
              <p>
                如果您点击副屏没有任何反馈（包括主屏和副屏），请先检查是否正确连接数据。不支持一线通的屏幕需要同时连接HDMI和USB，分别负责视频传输和数据传输。</p>
              <p class="xt-text-2">设置方法：</p>
              <p>在非触摸屏上按下Enter键，在触摸屏上进行触摸。</p>
              <p class="flex justify-center">
                <a class="mr-10 flex items-center"  @click="startAdjust">
                  <MyIcon icon="fluent:hand-draw-16-regular" width="20" height="20" />&nbsp;触摸矫正</a>
                <a class="flex items-center"  @click="adjustPen">
                  <MyIcon icon="fluent:pen-sparkle-16-regular" width="20" height="20" />&nbsp;笔矫正</a>
              </p>
            </div>

          </div>


          <div class="screen-section mt-6" style="height: 320px;padding: 16px 24px;" v-if="screenSettingTab==='choose'">
            <div class="flex justify-between">
              <div>
                选择您要显示工作台的屏幕，点击即可。
              </div>
              <div >
                <Icon icon="touping"/>
                  矫正屏幕
              </div>
            </div>
            <!-- <div v-if="canTouch">
            </div> -->
            <div class="h-full flex items-center" style="width: 100px;height: 100px;">
              <ChooseScreen></ChooseScreen>
            </div>
          </div>

          <div class="screen-section" v-if="screenSettingTab==='scale'" style="margin-top: 1em">
            <div style="color: #999">
              如果您不确定需要缩放多少尺寸，可在后期设置界面重新调整。
            </div>
            <div class="mt-3">
              <ZoomUI></ZoomUI>
            </div>
          </div>


        </div>
        <div v-if="(step===1 && mod==='bootstrap') || (step===2 && mod==='second-screen')" class="px-6">
          <div class="mt-3 mb-3 flex justify-center xt-bg-2" style="padding: 1em;border-radius: 8px 8px;color: white">
            <AutoRun/>
          </div>
          <div style="text-align: center">
            <KeySetting></KeySetting>
          </div>
          <div class="panel" style="line-height: 1" v-if="!canTouch">
            <p>如果无法触摸，进行可进行屏幕触摸矫正。</p>
            <p>矫正方法：</p>
            <p>在非触摸屏上按下Enter键，在触摸屏上进行触摸。</p>
            <p style="text-align: center">
              <a-button type="primary" size="large" @click="startAdjust">触摸矫正</a-button>
            </p>
          </div>
        </div>
        <div v-if="step==3">
          <div class="text-center xt-text-2 font-16">你可以不登录使用工作台大部分效率辅助功能，部分社区类功能可能受到限制</div>
          <div class="flex flex-wrap justify-center">
            <a-row class="bg-tab" v-for="(item,index) in loginList" :key="index" :style="{'background-image': item.background}">
              <a-col :span="6" class="h-full w-full justify-center items-center" style="display:flex;">
                <MyIcon :icon="item.icon"  height="40" width="40" />
              </a-col>
              <a-col :span="18" class="flex  ">
                <div class="font-16" style="color:rgba(255, 255, 255, 0.85)">{{item.title}}</div>
                <div class="font-14" style="color:rgba(255, 255, 255, 0.6)">{{ item.content }}</div>
              </a-col>
            </a-row>
          </div>
        </div>
        <div v-if="step==4">
          <div class="text-center xt-text-2 font-16">完成选择后，会内置对应模式的数据和设置，你仍然可以在后续自定义修改各个功能和布局。</div>
          <a-row :gutter="20" class="flex justify-center mt-6">
            <a-col >
              <div :class="{'active':desktopSetting==='default'}" @click="this.desktopSetting='default'" class="setting-panel pointer px-4 pt-5">
                <div class="title">
                  <MyIcon icon="fluent-emoji:desktop-computer" width="50px" height="50px" color="var(--primary-text)" />
                  <div class="mt-2">默认桌面</div>
                </div>
                <div class="content mt-4">
                  使用推荐的默认设置，快速开始。
                </div>
              </div>
            </a-col>
            <a-col >
              <!-- @click="this.desktopSetting='custom'"  -->
              <div :class="{'active':desktopSetting==='custom'}" class="setting-panel pointer px-4 pt-5">
                <div class="title">
                  <MyIcon icon="fluent-emoji:face-savoring-food" width="50px" height="50px" color="var(--primary-text)" />
                  <div class="mt-2">定制桌面（未开放）</div>
                </div>
                <div class="content mt-4">
                  通过一系列设置，帮你搭建最合适的桌面。
                </div>
              </div>
            </a-col>
          </a-row>
        </div>




      </div>
      <div class="flex" style="width:100%;justify-content: flex-end;position: absolute;right: 12px;bottom: 12px;">
        <div class="flex">
          <div v-if="step == 1 && (screenSettingTab == 'choose' || screenSettingTab == 'scale' || screenSettingTab == 'touch')" class="pl-20">
            <xt-button  @click="screenSettingTab='none'" type="theme" size="large" class="button-bottom">
              已解决
            </xt-button>
        </div>
        <div v-else-if="step == 3" class="flex">
          <!-- <xt-button @click="nextStep" size="large"  class="button-bottom ml-3">暂不登录
          </xt-button> -->
          <div class="flex items-center xt-text-2">暂未开放游客登录</div>
          <xt-button type="theme" v-if="!this.userInfo.uid" @click="login" size="large"  class="button-bottom ml-3">立即登录</xt-button>
          <xt-button type="theme" v-if="this.userInfo.uid" @click="nextStep" size="large"  class="button-bottom ml-3">已登录</xt-button>
        </div>
        <xt-button  v-else-if="(mod==='second-screen' && step!==3 && step!==4) || (mod==='bootstrap' && step!==4) " class="button-bottom ml-3" @click="nextStep"   size="large" type="theme">{{ step!==1?'下一步':'没有问题'}}
        </xt-button>
        <xt-button  v-else-if="step == 4" class="button-bottom ml-3" @click="finish"   size="large" type="theme">快速开始</xt-button>
        </div>

      </div>
    </div>

  </div>

</template>

<script>
import ChooseScreen from './ChooseScreen.vue'
import { appStore } from '../store'
import { mapWritableState, mapActions } from 'pinia'
import cp from 'child_process'
import KeyInput from '../components/comp/KeyInput.vue'
import { message } from 'ant-design-vue'
import { BulbFilled, PlayCircleFilled } from '@ant-design/icons-vue'
import ZoomUI from '../components/comp/ZoomUI.vue'
import AutoRun from '../components/comp/AutoRun.vue'
import browser from '../js/common/browser'
import navigationData from '../js/data/tableData'
import { navStore } from '../store/nav'
import KeySetting from '../components/comp/KeySetting.vue'
import { useWidgetStore } from '../components/card/store'
import { Icon as MyIcon } from '@iconify/vue';
// 修改浅色模式
import { setThemeSwitch } from "../components/card/hooks/themeSwitch";
import { chatStore } from '../store/chat'

const { settings } = window.$models
export default {
  name: 'Wizard',
  components: {
    KeySetting,
    AutoRun,
    ZoomUI,
    KeyInput,
    ChooseScreen, BulbFilled, PlayCircleFilled,
    MyIcon,
  },
  computed: {
    ...mapWritableState(navStore, ['sideNavigationList', 'footNavigationList', 'rightNavigationList']),
    ...mapWritableState(appStore, ['settings', 'init', 'styles','userInfo','deskInit']),
    ...mapWritableState(useWidgetStore, ['rightModel']),

    // 标题名称
    title(){
      if(this.step == 0){
        return '想天工作台使用向导'
      }else if((this.step===1 && this.mod==='bootstrap') || (this.step===2 && this.mod==='second-screen')){
        return '更多设置'
      }else if(this.step == 1 && this.screenSettingTab == 'none'){
        return '是否遇到以下问题？'
      }else if(this.step == 1 && this.screenSettingTab == 'touch'){
        return '矫正屏幕'
      }else if(this.step == 1 && this.screenSettingTab == 'choose'){
        return '选择屏幕'
      }else if(this.step == 1 && this.screenSettingTab == 'scale'){
        return '设置缩放'
      }else if(this.step == 3){
        return '登录工作台'
      }else if(this.step == 4){
        return '选择配置'
      }else{
        return
      }

    },

    fitWidth () {
      const width = Number(this.currentWidth)
      if (width < 800) {
        return {
          status: -1,//适合
          text: '过小',
          suggest: 800
        }

      } else if (width > 2000) {
        return {
          status: 1,//适合
          text: '过大',
          suggest: 2000
        }
      } else {
        return {
          status: 0,//适合
          text: '适合'
        }
      }
    },
    fitHeight () {
      const height = Number(this.currentHeight)
      if (height < 480) {
        return {
          status: -1,//适合
          text: '过小',
          suggest: 480
        }

      } else if (height > 1500) {
        return {
          status: 1,//适合
          text: '过大',
          suggest: 1500
        }
      } else {
        return {
          status: 0,//适合
          text: '适合'
        }
      }
    }
  },
  data () {
    return {
      // 默认、定制桌面
      desktopSetting:'default',
      screenSettingTab: 'none',
      currentWidth: '-',
      currentHeight: '-',

      ctrl: false,
      shift: false,
      alt: false,
      listening: false,
      currentListen: 'table',
      step: 0,
      canTouch: true,
      shortKeysTable: 'alt+z',
      shortKeysSearch: 'alt+f',
      mod: 'second-screen',//bootstrap
      steps: [
        {
          title: '设置模式'

        }, {
          title: '基础配置'
        },
        {
          title: '完成'
        }
      ], stepsBoot: [
        {
          title: '设置模式'

        },
        {
          title: '基础配置'
        }
      ],
      stepsSecond: [
        {
          title: '设置模式'

        }, {
          title: '屏幕设置'
        }, {
          title: '基础配置'
        },
        {
          title: '完成'
        }
      ],
      loginList:[
        {
          title:'元社区',
          content:'开放式社区，与全网小伙伴一同交流你的热爱，欢饮你的加入！',
          icon:'fluent-emoji:bubbles',
          background:'linear-gradient(107deg, #3E619E 0%, #5D367A 100%)',
        },
        {
          title:'小队',
          content:'与全网工作台小伙伴自由组成小队，为你带来一种不一样的陪伴感。',
          icon:'fluent-emoji:grinning-face-with-smiling-eyes',
          background:' linear-gradient(107deg, #3E9E51 0%, #36407A 100%)',
        },
        {
          title:'社群',
          content:'以兴趣、协作、游戏等等各种主题，免费创建属于你的社群。',
          icon:'fluent-emoji:doughnut',
          background:'linear-gradient(107deg, #9E903E 0%, #7A3E36 100%)',
        },
        {
          title:'等级权益',
          content:'提升你的账号在线等级，解锁体验更多高级功能。',
          icon:'fluent-emoji:star',
          background:' linear-gradient(107deg, #9E3E3E 0%, #6C367A 100%)',
        },
      ]
    }
  },
  async mounted () {
    let keyMap = await tsbApi.settings.get('keyMap')
    if (keyMap?.table) {
      this.shortKeysTable = keyMap.table
    }
    if (keyMap?.globalSearch) {
      this.shortKeysSearch = keyMap.globalSearch
    }

    this.settings.zoomFactor = await tsbApi.window.getZoomFactor() * 100
    this.getSize()

  },
  unmounted () {
  },

  methods: {
    ...mapActions(appStore, ['finishWizard', 'settings', 'getUserInfo']),
    // 登录模块迁移
    login () {
      tsbApi.user.login((data) => {
        this.getUserInfo()
        this.step = 4
      })
    },

    async restore () {
      await tsbApi.window.setZoomFactor(1)
      setTimeout(() => {
        this.settings.zoomFactor = 100
        this.getSize()
      }, 300)
    },
    getSize () {
      this.currentWidth = document.body.offsetWidth
      this.currentHeight = document.body.offsetHeight
    },
    async setZoomFactor () {
      await tsbApi.window.setZoomFactor(+this.settings.zoomFactor / 100)
      setTimeout(() => {
        this.getSize()
      }, 300)
    },
    openVideo () {
      browser.openInSystem('https://www.bilibili.com/video/BV17t4y127no/?spm_id_from=333.337.search-card.all.click')
    },
    setTableKeys (args) {
      let rs = ipc.sendSync('setTableShortcut', { shortcut: args.keys })
      if (!rs) {
        message.error('设置快捷键失败，请更换快捷键')
        return
      } else {
        message.success('快捷键设置成功')
        this.shortKeysTable = args.keys
      }
    },
    setSearchKeys (args) {
      this.shortKeysSearch = args.keys
    },
    async startAdjust () {
      await tsbApi.window.setAlwaysOnTop(false)
      let cp = require('child_process')
      cp.exec('MultiDigiMon.exe -touch', async (err) => {
        await tsbApi.window.setAlwaysOnTop(true)
      })
    },
    async adjustPen () {
      await tsbApi.window.setAlwaysOnTop(false)
      let cp = require('child_process')
      cp.exec('MultiDigiMon.exe -pen', async (err) => {
        await tsbApi.window.setAlwaysOnTop(true)
      })
    },
    prevStep () {
      if (this.mod === 'second-screen') {
        this.steps = this.stepsSecond
      } else {
        this.steps = this.stepsBoot
      }
      if (this.step===3 && this.mod==='bootstrap') {
        this.step--
      }
      this.step--
    },
    nextStep () {
      if (this.mod === 'second-screen') {
        this.rightModel = 'default'
        this.steps = this.stepsSecond
      } else {
        this.rightModel =  'follow'
        this.steps = this.stepsBoot
      }
      if (this.step===1 && this.mod==='bootstrap') {
        this.step++
      }
      this.step++
    },
    finish () {
      this.deskInit = true
      this.finishWizard()
      this.$router.replace({ name: 'home' })
    },
    getKeys (e) {
      let key = ''
      if (e.ctrlKey) {
        key += 'ctrl+'
      }
      if (e.altKey) {
        key += 'alt+'
      }
      if (e.shiftKey) {
        key += 'shift+'
      }
      key += e.code
      return key
    },
    themeSwitch(){
      this.styles = !this.styles
      setThemeSwitch(this.styles);
    },
  }
}
</script>

<style scoped lang="scss">
.panel {
  border: 2px solid transparent;
  border-radius: 0.5em;
  background: var(--secondary-bg);
  height:240px;
  width:240px;
}
.setting-panel {
  border: 2px solid transparent;
  border-radius: 0.5em;
  background: var(--secondary-bg);
  height:200px;
  width:200px;
}

.title {
  font-weight: bold;
  font-size: 18px;
  text-align: center;
  color: var(--primary-text);

}

.content{
  font-size: 16px;
  color: var(--secondary-text);
  text-align: center;
}

.active {
  border: 2px solid #0a84ff;
  background: rgba(80,139,254,0.20);
}

.screen-section {
  width: 452px;
  background: var(--secondary-bg);
  border-radius: 12px;
  color: var(--primary-text);
  margin-bottom: 12px;
  padding: 13px 16px 16px;
  cursor: pointer;
  font-size: 16px;

}
.font-title{
  font-size: 14px;
  color: var(--secondary-text);
}

.unfit {
  color: orangered
}

.button-bottom{
  width: 95px !important;
  height: 40px !important;
  border-radius: 10px !important;
}
.font-button{
  font-size: 14px;
  color: var(--secondary-text);
  line-height: 16px;
  display: flex;
  justify-content: center;
  align-items: start;
}

.body-shadow{
  background: var(--modal-bg);
  height: 600px;
  width: 800px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.03);
  box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.1);
  box-shadow: 0px 0px 40px 0px rgba(0,0,0,0.2);
}

.bg-image{
  background-image: url('https://a.apps.vip/icons/defaultBackground.jpg') !important;
  background-size: cover !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
}

.top-icon{
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--secondary-bg);
  border-radius: 8px;
  color: var(--secondary-text);
  cursor: pointer;

}

.bg-tab{
  width: 340px;
  height: 104px;
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
  margin-left: 16px;
  cursor: pointer;
}
</style>
