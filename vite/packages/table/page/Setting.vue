<template>
  <vue-custom-scrollbar  :settings="scrollbarSettings" style="position:relative;width:calc(100vw - 9em);  border-radius: 8px;height: calc(100vh - 12em)">
    <div style="width: auto;    white-space: nowrap;">
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
            <a-col :span="21">

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
    <div style="zoom: 1.5;">
      <ChooseScreen></ChooseScreen>
    </div>

  </a-modal>
</template>

<script>
import cp from 'child_process'
import ChooseScreen from './ChooseScreen.vue'

export default {
  name: 'Setting',
  components: { ChooseScreen },
  data(){
    return {
      visibleChooseScreen:false
    }
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
    }
  }
}
</script>

<style scoped>

</style>
