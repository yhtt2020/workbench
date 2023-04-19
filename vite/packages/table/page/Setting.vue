<template>

  <div style="display: flex;width: 100%">
    <vue-custom-scrollbar :settings="scrollbarSettings"
                          style="position:relative;  border-radius: 8px;height: calc(100vh - 12em)">
      <div style="width: auto;    white-space: nowrap;">
        <div
          class="suspension-background"
          style="margin: 2em;margin-right: 1em;padding:1em;border-radius: 0.5em;width:20em;display: inline-block">
          <h3>快速开关功能</h3>
          <a-row :gutter="[20,20]" style="font-size: 1.2em;text-align: center">
            <a-col :span="12">
              <div class="btn relative ">
                弹幕
                <br>
                <a-switch @change="switchBarrage" v-model:checked="settings.enableBarrage"></a-switch>
                <GradeSmallTip powerType="barrage" lastPowerType="关闭弹幕"></GradeSmallTip>
              </div>
            </a-col>
            <a-col :span="12">
              <div class="btn relative">
                聊天<br>
                <a-switch v-model:checked="settings.enableChat"></a-switch>
                <GradeSmallTip powerType="closeChat"></GradeSmallTip>
              </div>
            </a-col>
            <a-col :span="12">
              <div class="btn">
                免打扰模式<br>
                <a-switch></a-switch>
              </div>
            </a-col>
            <a-col :span="12">
              <div class="btn">
                浅色模式<br>
                <a-switch></a-switch>
              </div>
            </a-col>
            <a-col :span="12">
              <div class="btn">
                静音<br>
                <a-switch></a-switch>
              </div>
            </a-col>
          </a-row>
          <div>
          </div>
        </div>
        <div style="display: inline-block;vertical-align: top">
          <div style="margin: 2em;padding:1em;border-radius: 0.5em;width: 40em;" class="suspension-background">
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
          <div style="margin: 2em;padding:1em;border-radius: 0.5em;width: 40em;" class="suspension-background">

            <a-row style="font-size: 1.2em;text-align: center" :gutter="[10,10]">
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
<!--              <a-col :span="6">-->
<!--                <div @click="verifyCode" class="btn">-->
<!--                  <Icon icon="shezhi" style="font-size: 2em"></Icon>-->
<!--                  <div> 验证激活码</div>-->
<!--                </div>-->
<!--              </a-col>-->
              <a-col v-if="userInfo && userInfo.uid===4" :span="6">
                <div @click="createCodes" class="btn">
                  <Icon icon="shezhi" style="font-size: 2em"></Icon>
                  <div> 生成激活码</div>
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
  </div>



  <a-modal
    v-model:visible="visibleChooseScreen"
    :title="null"
    width="100%"
    :footer="null"
    wrap-class-name="full-modal"
    @ok="()=>{this.visibleChooseScreen=false}"
  >
    <div style="zoom: 1.5;font-size: 16px;padding-top: 5em;text-align: center">
      <div style="width: 500px;overflow: visible;display: inline-block">
        <ChooseScreen></ChooseScreen>
      </div>
    </div>

  </a-modal>
</template>

<script>
import ChooseScreen from './ChooseScreen.vue'
import { appStore } from '../store'
import { mapWritableState } from 'pinia'
import { message } from 'ant-design-vue'
import {mapActions} from 'pinia'
import { codeStore } from '../store/code'
import SecondPanel from '../components/SecondPanel.vue'
import GradeSmallTip from "../components/GradeSmallTip.vue";
export default {
  name: 'Setting',
  components: { SecondPanel, ChooseScreen,GradeSmallTip },
  data () {
    return {
      visibleChooseScreen: false,
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true
      },

    }
  },
  mounted () {
    console.log(this.userInfo)
  },
  computed: {
    ...mapWritableState(appStore, ['settings']),
    ...mapWritableState(appStore,['userInfo'])
  },
  methods: {
    ...mapActions(codeStore, ['verify', 'create']),
    async verifyCode () {
      let rs=await  this.verify(this.userInfo.uid)
      if (rs) {
        message.success('激活码有效')
      } else {
        message.error('激活码无效')
      }
    },
    async createCodes () {
      this.create().then(rs=>{
        message.success('生成激活码10个')
      })
    },
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
    chooseScreen () {
      this.visibleChooseScreen = true
    },
    wizard () {
      this.$router.push('/wizard')
    },
    barrage () {
      this.$router.push({
        path: '/barrage'
      })
    },
    papersSettings () {
      this.$router.push({
        name:'my'
      })
    },
    basic () {
      this.$router.push({
        name: 'common'
      })
    },
    switchBarrage (value) {
      if (value) {
        window.$manager.show()
      } else {
        window.$manager.hidden()
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
