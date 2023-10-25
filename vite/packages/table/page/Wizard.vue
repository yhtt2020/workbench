<template>
  <div style="background: #333333;height: 100vh;width: 100vw">
    <h2 style="text-align: center;padding: 1em;-webkit-app-region:drag">
      <Icon icon="jurassic_nav" style="font-size: 1.2em"></Icon>
      工作台使用向导
    </h2>
    <div
      style="text-align: left;font-size: 1.2em;line-height: 2;width: 600px;margin: auto;position: relative;height: 80vh">
      <div style="padding: 0.5em">
        <a-steps :current="step" size="large">
          <a-step v-for="item in steps" :title="item.title"/>
        </a-steps>
      </div>
      <div v-if="step===0">
        <div style="margin-bottom: 2em;margin-top:1em" v-if="true">
          如果您正在使用副屏，则推荐您使用副屏模式获得最佳体验。
          <div style="color:#999;font-size: 0.9em">
            <bulb-filled/>
            还没有扩展屏？
            <br/><a @click="openVideo">
            <play-circle-filled/>
            点击了解</a> Spacedesk | 把任意设备变成你的第二屏幕，手机、平板、电脑都可以！
          </div>
        </div>
        <div style="margin-bottom: 1em" v-else>
          您当前仅有一块屏幕，无法启用副屏模式，您可在增添副屏后启用。<a>了解更多</a>
        </div>
        <a-row :gutter="20">
          <a-col :span="12">
            <div :class="{'active':mod==='second-screen'}" @click="this.mod='second-screen'" class="panel pointer">
              <div class="title">
                <icon icon="touping" style="font-size: 1.2em"></icon>
                副屏全屏模式
              </div>
              <p>
                此模式专为副屏优化，将自动放大字体。并提供更适合触摸的交互。
              </p>
            </div>
          </a-col>
          <a-col :span="12">
            <div :class="{'active':mod==='bootstrap'}" @click="this.mod='bootstrap'" class="panel pointer">
              <div class="title">
                <icon icon="kuaijie" style="font-size: 1.2em"></icon>
                窗口模式
              </div>
              <p>
                在主屏上以窗口模式运行，通过默认快捷键 【Alt】+【Z】 显示/隐藏。
              </p></div>
          </a-col>
        </a-row>


      </div>
      <div v-if="step===1 && mod==='second-screen'">

        <div v-if="screenSettingTab==='none'">

          <a-row class="screen-section">
            <a-col :span="20">
              <div style="font-size: 1.3em">
                <Icon icon="Touch"/>
                副屏是否已经可正确识别触摸？
              </div>
              <div style="color: #999">异常情况：触摸副屏，反馈在主屏的情况。</div>
            </a-col>
            <a-col :span="4">
              <a-button v-if="screenSettingTab!=='touch'" @click="screenSettingTab='touch'" type="primary"> 矫正屏幕
              </a-button>
            </a-col>
          </a-row>
          <a-row class="screen-section">
            <a-col :span="20">
              <div style="font-size: 1.3em">
                <Icon icon="touping"/>
                工作台是否显示在了您期望的屏幕上？
              </div>
            </a-col>
            <a-col :span="4">
              <a-button @click="screenSettingTab='choose'" type="primary">选择屏幕</a-button>
            </a-col>
          </a-row>
          <a-row class="screen-section">
            <a-col :span="20">
              <div style="font-size: 1.3em">
                <Icon icon="wenzidaxiao2"></Icon>
                工作台界面显示不自然？
              </div>
              <div style="color: #999">异常情况：字体过小、难以触摸、边缘留白过大、显示不全。</div>
            </a-col>
            <a-col :span="4">
              <a-button @click="screenSettingTab='scale'" type="primary">设置缩放</a-button>
            </a-col>
          </a-row>
          <div></div>
        </div>

        <div v-if="screenSettingTab==='touch'">
          <div class="screen-section" style="line-height: 2;margin-top: 3em" v-if="screenSettingTab==='touch'">
            <p>
              如果您点击副屏没有任何反馈（包括主屏和副屏），请先检查是否正确连接数据。不支持一线通的屏幕需要同时连接HDMI和USB，分别负责视频传输和数据传输。</p>
            <p>矫正方法：</p>
            <p>在非触摸屏上按下Enter键，在触摸屏上进行触摸。</p>
            <p style="text-align: center">
              <a-button class="mr-10" type="primary" size="large" @click="startAdjust">触摸矫正</a-button>
              <a-button type="primary" size="large" @click="adjustPen">笔矫正</a-button>
            </p>
          </div>

        </div>


        <div class="screen-section" style="height: 17em;margin-top: 2em" v-if="screenSettingTab==='choose'">
          选择您要显示工作台的屏幕，直接点击屏幕即可。
          <a-button style="margin-bottom: 2em" v-if="canTouch" type="primary">
            <Icon icon="touping"/>
            矫正屏幕
          </a-button>
          <ChooseScreen></ChooseScreen>
        </div>

        <div class="screen-section" v-if="screenSettingTab==='scale'" style="margin-top: 1em">
          <div style="color: #999">
            如果您不确定需要缩放多少尺寸，可在后期设置界面重新调整。
          </div>
          <ZoomUI></ZoomUI>
        </div>


      </div>
      <div v-if="(step===1 && mod==='bootstrap') || (step===2 && mod==='second-screen')">
        <div class="mt-3 mb-3" style="background: #f15460;padding: 1em;border-radius: 8px 8px;color: white">
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


      <div style="position: fixed;bottom: 1em;width:100%;left: 0;right: 0">
        <div class="flex item-content" v-if="screenSettingTab==='none'">
          <xt-button v-if="step!==0" @click="prevStep" style="" size="large">上一步</xt-button>
          <xt-button v-if="(mod==='second-screen' && step!==2 ) || (mod==='bootstrap' && step!==1) " @click="nextStep"   size="large"
                    type="theme">下一步
          </xt-button>
          <xt-button type="theme" v-else @click="finish" style="margin-left: 6em" size="large" >完成
          </xt-button>
        </div>
        <div v-else class="pl-20">
          <a-button @click="screenSettingTab='none'" type="primary" size="large">
            <Icon class="mr-3" icon="yixuan"></Icon>
            问题解决
          </a-button>
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

const { settings } = window.$models
export default {
  name: 'Wizard',
  components: {
    KeySetting,
    AutoRun,
    ZoomUI,
    KeyInput,
    ChooseScreen, BulbFilled, PlayCircleFilled
  },
  computed: {
    ...mapWritableState(navStore, ['sideNavigationList', 'footNavigationList', 'rightNavigationList']),
    ...mapWritableState(appStore, ['settings', 'init']),
    ...mapWritableState(useWidgetStore, ['rightModel']),
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
    ...mapActions(appStore, ['finishWizard', 'settings']),

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
      browser.openInUserSelect('https://www.bilibili.com/video/BV17t4y127no/?spm_id_from=333.337.search-card.all.click')
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
      this.step++
    },
    finish () {
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
    replaceIcon () {
      navigationData.systemFillAppList.forEach((item) => {
        this.sideNavigationList.forEach((i) => {
          if (item.name === i.name) {
            i.icon = item.icon
          }
        })
      })
      navigationData.systemFillAppList.forEach((item) => {
        this.rightNavigationList.forEach((i) => {
          if (item.name === i.name) {
            i.icon = item.icon
          }
        })
      })
      navigationData.systemAppList.forEach((item) => {
        this.footNavigationList.forEach((i) => {
          if (item.name === i.name) {
            i.icon = item.icon
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.panel {
  border: 1px #7a7a7a solid;
  border-radius: 0.5em;
  background: #3d3d3d;
  padding: 0.5em;

  min-height: 10.5em;
}

.title {
  font-weight: bold;
  font-size: 1.1em;
}

.active {
  border: 2px solid #0a84ff;
  background: rgba(116, 172, 239, 0.13);
}

.screen-section {
  background: #3b3b3b;
  padding: 1em;
  border-radius: 0.4em;
  color: #ffffff;
  margin-bottom: 1em;
}

.unfit {
  color: orangered
}

</style>
