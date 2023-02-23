<template>
  <h2  style="text-align: center;padding: 1em;-webkit-app-region:drag"><Icon icon="jurassic_nav" style="font-size: 1.2em"></Icon> 工作台使用向导</h2>
  <div
    style="text-align: left;font-size: 1.2em;line-height: 2;width: 500px;margin: auto;position: relative;height: 80vh">
    <div style="padding: 0.5em">
      <a-steps :current="step" size="large">
        <a-step v-for="item in steps" :title="item.title"/>
      </a-steps>
    </div>
    <div v-if="step===0">
      <div style="margin-bottom: 1em" v-if="true">
        发现您正在使用多块屏幕。
        <br>推荐使用副屏模式，获得最佳体验，后续可随时更改。
      </div>
      <div style="margin-bottom: 1em" v-else>
        您当前仅有一块屏幕，无法启用副屏模式，您可在增添副屏后启用。<a>了解更多</a>
      </div>
      <a-row :gutter="20">
        <a-col :span="12">
          <div v :class="{'active':mod==='second-screen'}" @click="this.mod='second-screen'" class="panel pointer">
            <div class="title">
              <icon icon="touping" style="font-size: 1.2em"></icon>
              副屏模式
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
              启动器模式
            </div>
            <p>
              通过默认快捷键<br>Alt+空格<br>呼出界面。
            </p></div>
        </a-col>
      </a-row>


    </div>
    <div v-if="step===1 && mod==='second-screen'">
      <div>系统检测到您正在使用触摸屏</div>
      <div>目前副屏是否已经可正确识别触摸？</div>
      <div style="text-align: center;">
        <a-switch v-model:checked="canTouch" checked-children="可正确触摸"
                  un-checked-children="不可正常触摸"></a-switch>
      </div>
      <div v-if="canTouch">选择显示的屏幕
      <ChooseScreen></ChooseScreen>
      </div>
      <div class="panel" style="line-height: 1;margin-top: 0.5em" v-if="!canTouch">
        <p>如果无法触摸，进行可进行屏幕触摸矫正。</p>
        <p>矫正方法：</p>
        <p>在非触摸屏上按下Enter键，在触摸屏上进行触摸。</p>
        <p style="text-align: center">
          <a-button type="primary" size="large" @click="startAdjust">触摸矫正</a-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a-button type="primary" size="large" @click="adjustPen">笔矫正</a-button>
        </p>
      </div>
    </div>
    <div v-if="step===1 && mod==='bootstrap'">
      <div>启动器模式配置</div>
      <div>配置启动快捷键(如果与其他软件冲突，请修改）：</div>
      <div style="text-align: center;margin-top: 1em">
        呼出工作台快捷键
        <a-input-group compact>
          <a-input style="width: calc(100% - 200px)"  placeholder="按下快捷键" size="large" :value="shortKeysTable">
          </a-input>
          <a-button @click="toggleListenKey('table')" size="large" type="primary">
            修改
          </a-button>
        </a-input-group>
      </div>
      <div style="text-align: center;margin-top: 2em">
        呼出全局搜索快捷键
        <a-input-group compact>
        <a-input style="width: calc(100% - 200px)"   placeholder="按下快捷键" size="large" :value="shortKeysSearch">
        </a-input>
          <a-button @click="toggleListenKey('search')" size="large" type="primary">
            修改
          </a-button>
        </a-input-group>
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

    <div style="position: absolute;bottom: 1em;left: calc(50% - 8em)">
      <a-button v-if="step!==0" @click="prevStep" style="" :disabled="!canTouch" size="large">上一步</a-button>
      <a-button v-if="step!==2" @click="nextStep" style="margin-left: 6em" :disabled="!canTouch" size="large" type="primary">下一步
      </a-button>
      <a-button v-else @click="finish" style="margin-left: 6em"   size="large" type="primary">完成
      </a-button>
    </div>

  </div>
  <div v-if="listening" style="position: fixed;width: 100vw;height: 100vh;left: 0;right: 0;text-align: center;bottom: 0;top: 0;background: rgba(21,21,21,0.93);line-height: 33vh;font-size: 3em">
    请按下 {{this.currentListen==='table'?'启动器':'全局搜索'}} 快捷键<br>先按功能键（Ctrl、Shift、Alt再按其他键）<br>
    当前键位 {{this.currentListen==='table'?this.shortKeysTable:this.shortKeysSearch}}
  </div>
</template>

<script>
import ChooseScreen from './ChooseScreen.vue'
import { appStore } from '../store'
import {mapWritableState,mapActions} from 'pinia'
import cp from 'child_process'

export default {
  name: 'Wizard',
  components:{
    ChooseScreen
  },
  computed:{
    ...mapWritableState(appStore,['settings','init'])
  },
  data () {
    return {
      ctrl: false,
      shift: false,
      alt: false,
      listening:false,
      currentListen:'table',
      step: 0,
      canTouch: true,
      shortKeysTable: 'alt+space',
      shortKeysSearch: 'alt+f',
      mod: 'second-screen',//bootstrap
      steps: [
        {
          title: '设置模式'

        }, {
          title: '模式配置'
        },
        {
          title: '完成'
        }
      ],stepsBoot: [
        {
          title: '设置模式'

        }, {
          title: '模式配置'
        },
        {
          title: '完成'
        }
      ],
      stepsSecond: [
        {
          title: '设置模式'

        }, {
          title: '屏幕设置'
        }, {
          title: '模式配置'
        },
        {
          title: '完成'
        }
      ]
    }
  },
  mounted () {
    document.onkeydown = (e) => {

      // this.setKeyStatus(e.keyCode, true)

    }
    document.onkeyup = (e) => {
      // this.setKeyStatus(e.keyCode, false)
      // console.log(e)
      // if(this.listening){
      //   //return false
      // }
      if(this.listening && (e.ctrlKey||e.altKey||e.shiftKey)){
        if(this.currentListen==='table'){
          this.shortKeysTable = this.getKeys(e)
        }else if(this.currentListen==='search'){
          this.shortKeysSearch = this.getKeys(e)
        }
        if(this.shortKeysTable===this.shortKeysSearch){
          if(this.currentListen==='table'){
            this.shortKeysTable=''
          }else{
            this.shortKeysSearch=''
          }
        }
        this.listening=false
        e.preventDefault()
    }

    document.onkeypress=(e)=>{
      console.log(e)

      }

    }
  },
  methods: {
    ...mapActions(appStore,['finishWizard']),
    toggleListenKey(short){
      this.listening=true
      this.currentListen=short
    },
    setKeyStatus (keyCode, status) {
      switch (keyCode) {
        case 16:
          this.shift = status
          break
        case 17:
          this.ctrl = status
          break
        case 18:
          this.alt = status
          break
      }
    },
    async startAdjust () {
      await tsbApi.window.setAlwaysOnTop(false)
      let cp = require('child_process')
      cp.exec('MultiDigiMon.exe -touch', async (err) => {
        await tsbApi.window.setAlwaysOnTop(true)
        this.canTouch = true
      })
    },
    async adjustPen () {
      await tsbApi.window.setAlwaysOnTop(false)
      let cp = require('child_process')
      cp.exec('MultiDigiMon.exe -pen', async (err) => {
        await tsbApi.window.setAlwaysOnTop(true)
        this.canTouch = true
      })
    },
    prevStep () {
      if(this.mod==='second-screen'){
        this.steps=this.stepsSecond
      }else{
        this.steps=this.stepsBoot
      }
      this.step--
    },
    nextStep () {
      if(this.mod==='second-screen'){
        this.steps=this.stepsSecond
      }else{
        this.steps=this.stepsBoot
      }
      this.step++
    },
    pressTable (e) {
      this.currentListen='table'
      this.listening=true
      return false
    },
    finish(){
      this.finishWizard()
      this.$router.replace({path:'/'})
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
  }
}
</script>

<style scoped lang="scss">
.panel {
  border: 1px #7a7a7a solid;
  border-radius: 0.5em;
  background: #3d3d3d;
  padding: 0.5em;

}

.title {
  font-weight: bold;
  font-size: 1.1em;
}

.active {
  border: 2px solid #0a84ff;
  background: rgba(116, 172, 239, 0.13);
}

</style>
