<template>
  <h3>体验优化</h3>

  <a-form :model="userSetting" style="padding: 20px" :label-col="{span:5}" :wrapper-col="{span:19}">
    <a-form-item :rules="{ initialValue: ['A', 'B'] }" id="optimize" label="体验优化" style="margin-bottom: 0">

        <a-row class="setting-check-boxes">
          <a-col :span="8">
            <a-checkbox name="autoRun" v-model:checked="userSetting.optimize.autoRun">
              默认启动
            </a-checkbox>
          </a-col>
          <a-col :span="8">
            <a-checkbox name="keepRunning" v-model:checked="userSetting.optimize.keepRunning">
              保持运行
            </a-checkbox>
          </a-col>
          <!--                        <a-col :span="8">-->
          <!--                          <a-checkbox value="theme">-->
          <!--                            沉浸式主题色-->
          <!--                          </a-checkbox>-->
          <!--                        </a-col>-->
          <!--                        <a-col :span="8">-->
          <!--                          <a-checkbox value="desktop">-->
          <!--                            桌面快捷方式-->
          <!--                          </a-checkbox>-->
          <!--                        </a-col>-->
          <a-col :span="8">
            <a-checkbox name="showInSideBar" v-model:checked="userSetting.optimize.showInSideBar">
              保持在左侧栏
            </a-checkbox>
          </a-col>
        </a-row>
    </a-form-item>
    <a-form-item :wrapper-col="{ offset: 5, span: 19 }">
      <a-button @click="restore" html-type="button">还原初始设置</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import {mapWritableState,mapActions} from 'pinia'
import {appStore} from '../../store'
import DebugTip from '../../components/DebugTip.vue'
import _ from 'lodash-es'
const {appModel} = window.$models
export default {
  name: 'Optimize',
  components: { DebugTip },
  data(){
    return {
    }
  },
  computed:{
    ...mapWritableState(appStore,['app','debugMod','userSetting'])
  },
  mounted(){
  },
  methods:{
   async  restore(){

     let defaultSetting=await appModel.getDefaultUserSetting(this.app.nanoid)


      this.userSetting.optimize=defaultSetting.optimize
    },
    ...mapActions(appStore,['toggleDbugMod'])
  }
}
</script>

<style scoped>

</style>
