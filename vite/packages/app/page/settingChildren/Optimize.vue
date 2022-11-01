<template>
  <h3>体验优化</h3>

  <a-form :model="formState" style="padding: 20px" :label-col="{span:5}" :wrapper-col="{span:19}">
    <a-form-item v-if="debugMod"  :rules="{ initialValue: ['A', 'B'] }" id="optimize" label="初始体验优化" style="margin-bottom: 0">
      <a-checkbox-group
        style="width: 100%;"
      >
        <a-row class="setting-check-boxes">
          <a-col :span="8">
            <a-checkbox value="autoRun">
              默认启动
            </a-checkbox>
          </a-col>
          <a-col :span="8">
            <a-checkbox value="keepRunning">
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
            <a-checkbox value="showInSideBar">
              保持在左侧栏
            </a-checkbox>
          </a-col>
          <a-col :span="8">
            <a-checkbox value="alwaysTop">
              保持在最顶层
            </a-checkbox>
          </a-col>
          <a-col :span="8">
            <a-checkbox value="noFrame">
              无边框窗体
            </a-checkbox>
          </a-col>
        </a-row>
      </a-checkbox-group>
      <template #extra>
        <DebugTip tip="default_opt"/>
      </template>
    </a-form-item>
    <a-form-item :rules="{ initialValue: ['A', 'B'] }" id="optimize" label="体验优化" style="margin-bottom: 0">
      <a-checkbox-group
        style="width: 100%;"
      >
        <a-row class="setting-check-boxes">
          <a-col :span="8">
            <a-checkbox value="autoRun">
              默认启动
            </a-checkbox>
          </a-col>
          <a-col :span="8">
            <a-checkbox value="keepRunning">
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
            <a-checkbox value="showInSideBar">
              保持在左侧栏
            </a-checkbox>
          </a-col>
          <a-col :span="8">
            <a-checkbox value="alwaysTop">
              保持在最顶层
            </a-checkbox>
          </a-col>
          <a-col :span="8">
            <a-checkbox value="noFrame">
              无边框窗体
            </a-checkbox>
          </a-col>
        </a-row>
      </a-checkbox-group>
    </a-form-item>
    <a-form-item :wrapper-col="{ offset: 5, span: 19 }">
      <a-button html-type="button">还原初始设置</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import {mapWritableState,mapActions} from 'pinia'
import {appStore} from '../../store'
import DebugTip from '../../components/DebugTip.vue'

export default {
  name: 'Optimize',
  components: { DebugTip },
  computed:{
    ...mapWritableState(appStore,['app','debugMod'])
  },
  methods:{
    ...mapActions(appStore,['toggleDbugMod'])
  }
}
</script>

<style scoped>

</style>
