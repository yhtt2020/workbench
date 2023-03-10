<template>
  <vue-custom-scrollbar  :settings="scrollbarSettings" style="position:relative;width:calc(100vw - 9em);  border-radius: 8px;height: calc(100vh - 12em)">
    <div style="width: auto;    white-space: nowrap;">
      <div style="margin: 2em;margin-right: 1em;background: #282828;padding:1em;border-radius: 0.5em;width:20em;display: inline-block">
        <h3>快速开关功能</h3>
        <a-row :gutter="[20,20]" style="font-size: 1.2em;text-align: center">
          <a-col :span="12">
            <div class="btn">
              弹幕
              <br>
              <a-switch @change="switchBarrage" v-model:checked="settings.enableBarrage"></a-switch>
            </div>
          </a-col>
          <a-col :span="12">
            <div  class="btn">
              聊天<br>
              <a-switch v-model:checked="settings.enableChat"></a-switch>
            </div>
          </a-col>
          <a-col :span="12">
            <div  class="btn">
              免打扰模式<br>
              <a-switch></a-switch>
            </div>
          </a-col>
          <a-col :span="12">
            <div  class="btn">
              浅色模式<br>
              <a-switch></a-switch>
            </div>
          </a-col>
          <a-col :span="12">
            <div  class="btn">
              静音<br>
              <a-switch></a-switch>
            </div>
          </a-col>
        </a-row>
        <div>
        </div>
      </div>
      <div style="display: inline-block;vertical-align: top">
        <div style="margin: 2em;background: #282828;padding:1em;border-radius: 0.5em;width: 40em;">
          <h3>屏幕设置</h3>
          <a-row style="font-size: 1.2em;text-align: center">
            <a-col :span="6">
              <div @click="setTouch" class="btn">
                <Icon icon="Touch" style="font-size: 2em"></Icon>
                <div>
                  设置触摸屏
                </div>
              </div>
            </a-col>
            <a-col :span="6">
              <div @click="setPen" class="btn">
                <Icon icon="icon-checkin" style="font-size: 2em"></Icon>
                <div>
                  设置笔
                </div>
              </div>
            </a-col>
            <a-col :span="6">
              <div @click="chooseScreen" class="btn">
                <Icon icon="touping" style="font-size: 2em"></Icon>
               <div> 选择屏幕</div>
              </div>
            </a-col>
          </a-row>
          <div>
          </div>
        </div>
        <div style="margin: 2em;background: #282828;padding:1em;border-radius: 0.5em;width: 40em;">
          <h3>其他</h3>
          <a-row style="font-size: 1.2em;text-align: center">
            <a-col :span="6">
              <div @click="wizard" class="btn">
                <Icon icon="jurassic_nav" style="font-size: 2em"></Icon>
                <div> 配置向导</div>
              </div>
            </a-col>
            <a-col :span="6">
              <div @click="barrage" class="btn">
                <Icon icon="danmushezhi" style="font-size: 2em"></Icon>
                <div> 弹幕设置</div>
              </div>


            </a-col>
            <a-col :span="6">
              <div @click="papersSettings" class="btn">
                <Icon icon="banner" style="font-size: 2em"></Icon>
                <div> 锁屏壁纸</div>
              </div>
            </a-col>
            <a-col :span="6">
              <div @click="basic" class="btn">
                <Icon icon="shezhi" style="font-size: 2em"></Icon>
                <div> 基础设置</div>
              </div>
            </a-col>
          </a-row>
          <div>
          </div>
        </div>
      </div>
    </div>
    <div>
    </div>
  </vue-custom-scrollbar>

  <a-modal
    v-model:visible="visibleChooseScreen"
    :title="null"
    width="100%"
    :footer="null"
    wrap-class-name="full-modal"
    @ok="()=>{this.visibleChooseScreen=false}"
  >
    <div style="zoom: 1.5;font-size: 16px;padding-top: 5em;text-align: center">
      <div style="width: 500px;overflow: visible;display: inline-block"><ChooseScreen></ChooseScreen></div>
    </div>

  </a-modal>
</template>

<script>
import cp from 'child_process'
import ChooseScreen from './ChooseScreen.vue'
import { appStore } from '../store'
import {mapWritableState} from 'pinia'

export default {
  name: 'Setting',
  components: { ChooseScreen },
  data(){
    return {
      visibleChooseScreen:false
    }
  },
  computed:{
    ...mapWritableState(appStore,['settings'])
  },
  methods:{
    async setTouch () {
      await tsbApi.window.setAlwaysOnTop(false)
      let cp = require('child_process')
      cp.exec('MultiDigiMon.exe -touch', async (err) => {
        await tsbApi.window.setAlwaysOnTop(true)
      })
    },
    async setPen () {
      await tsbApi.window.setAlwaysOnTop(false)
      let cp = require('child_process')
      cp.exec('MultiDigiMon.exe -pen', async (err) => {
        await tsbApi.window.setAlwaysOnTop(true)
      })
    },
    chooseScreen(){
      this.visibleChooseScreen=true
    },
    wizard(){
      this.$router.push('/wizard')
    },
    barrage(){
      this.$router.push({
        path:'/barrage'
      })
    },
    papersSettings(){
      this.$router.push({
        name:'papersSetting'
      })
    },
    basic(){
      this.$router.push({
        name:'basicSetting'
      })
    },
    switchBarrage(value){
      if(value){
        window.$manager.show()
      }else{
        window.$manager.hidden()
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
