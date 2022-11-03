<template>
<h3>应用信息</h3>
  <p>此处的所有设置均不会影响到当前已经安装的应用，如需设置生效，可点击安装测试应用以此配置安装一个新的本地测试应用。所有模板设置均需点击保存方可生效，否则均会丢失。</p>
  <a-form :model="formState" style="padding: 20px" :label-col="{span:5}" :wrdevApper-col="{span:19}">
    <a-form-item
      label="应用名"
      :rules="{ required: true, message: '应用名称，长度大于1，小于16' ,min:1,max:16 }"
    >
      <a-input v-model:value="devApp.name"
               placeholder="输入应用名称"
      />
    </a-form-item>
    <a-form-item v-if="debugMod"
      label="包名"
      :rules="{ message: '唯一的应用名，用于开发的时候应用身份确认，唯一' ,min:1,max:16 }"
    >
      <a-input-group compact>
        <a-input style="width: 200px" v-model:value="devApp.package"
                 placeholder="请点击注册包名"
        >
        </a-input><a-button type="primary">注册包名</a-button>
      </a-input-group>
<DebugTip tip="package"></DebugTip>
    </a-form-item>
    <a-form-item label="本地项目目录"
                 :rules="{ message: '选择一个本地项目目录，用于输出manifest.json'  }"
    >
      <a-input-group compact>
        <a-input style="width: 200px" v-model:value="devApp.local_dir"
                 placeholder="选择本地项目目录"
        >
        </a-input>
          <a-button @click="selectDir">
            选择目录
          </a-button>
      </a-input-group>
      <DebugTip tip="local_dir"></DebugTip>
    </a-form-item>
    <a-form-item
      label="应用起始地址：" >
                    <span v-if="!debugMod" class="ant-form-text" style="text-overflow: ellipsis;
  white-space: nowrap;display: inline-block;word-break: break-all; overflow: hidden;">
        {{ this.devApp.url }}
      </span>
      <a-input v-else v-model:value="devApp.url"/>
    </a-form-item>
    <a-form-item
                  label="启用调试入口：">
      <template #extra>
        <DebugTip tip="use_debug_url" />
      </template>
      <a-switch  v-model:checked="devApp.use_debug_url"/>
    </a-form-item>
    <a-form-item  v-if="devApp.use_debug_url"
      label="应用调试地址：">
      <template #extra>
      <DebugTip tip="debug_url" />
      </template>
        <a-input  v-model:value="devApp.debug_url"/>
    </a-form-item>
    <a-form-item
      label="应用说明"
      :rules="{  message: '请输入应用说明' }"
    >
      <a-textarea v-model:value="devApp.summary"
        placeholder="输入应用说明"
      />
    </a-form-item>
    <a-form-item label="主题色">
      <div>
        <a-popover style="background: transparent;border: none" title="选择颜色">
          <template #content>
            <SketchPicker v-model="this.devApp.theme_colors"></SketchPicker>
          </template>
          <span class="theme-color" :style="{'background-color':this.devApp.theme_colors.hex} "></span>
        </a-popover>
      </div>
    </a-form-item>

    <!--                  <a-form-item id="permission" label="权限管理">-->
    <!--                    <a-checkbox-group-->
    <!--                      v-decorator="['功能优化', { initialValue: ['A', 'B'] }]"-->
    <!--                      style="width: 100%;"-->
    <!--                    >-->
    <!--                      &lt;!&ndash;                    // clipboard-read - Request access to read from the clipboard.&ndash;&gt;-->
    <!--                      &lt;!&ndash;                    //   media - Request access to media devices such as camera, microphone and speakers.&ndash;&gt;-->
    <!--                      &lt;!&ndash;                    //   display-capture - Request access to capture the screen.&ndash;&gt;-->
    <!--                      &lt;!&ndash;                    //   mediaKeySystem - Request access to DRM protected content.&ndash;&gt;-->
    <!--                      &lt;!&ndash;                    //   geolocation - Request access to user's current location.&ndash;&gt;-->
    <!--                      &lt;!&ndash;                    // notifications - Request notification creation and the ability to display them in the user's system tray.&ndash;&gt;-->
    <!--                      &lt;!&ndash;                    // midi - Request MIDI access in the webmidi API.&ndash;&gt;-->
    <!--                      &lt;!&ndash;                    //   midiSysex - Request the use of system exclusive messages in the webmidi API.&ndash;&gt;-->
    <!--                      &lt;!&ndash;                    //   pointerLock - Request to directly interpret mouse movements as an input method. Click here to know more.&ndash;&gt;-->
    <!--                      &lt;!&ndash;                    //   fullscreen - Request for the devApp to enter fullscreen mode.&ndash;&gt;-->
    <!--                      &lt;!&ndash;                    //   openExternal - Request to open links in external devApplications.&ndash;&gt;-->
    <!--                      &lt;!&ndash;                    //   unknown - An unrecognized permission request&ndash;&gt;-->
    <!--                      <a-row class="setting-check-boxes">-->
    <!--                        <a-col :span="8">-->
    <!--                          <a-checkbox value="media">-->
    <!--                            多媒体（音频、麦克风、摄像头）-->
    <!--                          </a-checkbox>-->
    <!--                        </a-col>-->
    <!--                        <a-col :span="8">-->
    <!--                          <a-checkbox value="geolocation">-->
    <!--                            地理位置-->
    <!--                          </a-checkbox>-->
    <!--                        </a-col>-->
    <!--                        <a-col :span="8">-->
    <!--                          <a-checkbox value="notifications">-->
    <!--                            消息通知-->
    <!--                          </a-checkbox>-->
    <!--                        </a-col>-->
    <!--                        <a-col :span="8">-->
    <!--                          <a-checkbox value="fullscreen">-->
    <!--                            全屏-->
    <!--                          </a-checkbox>-->
    <!--                        </a-col>-->
    <!--                        <a-col :span="8">-->
    <!--                          <a-checkbox value="openExternal">-->
    <!--                            打开外部链接-->
    <!--                          </a-checkbox>-->
    <!--                        </a-col>-->
    <!--                        <a-col :span="8">-->
    <!--                          <a-checkbox value="alwaysTop">-->
    <!--                            剪切板-->
    <!--                          </a-checkbox>-->
    <!--                        </a-col>-->
    <!--                      </a-row>-->
    <!--                    </a-checkbox-group>-->
    <!--                  </a-form-item>-->
  </a-form>
</template>

<script>
import { message, Upload } from 'ant-design-vue';
const formItemLayout = {
  labelCol: { span: 6 },
  wrdevApperCol: { span: 16 },
}
const formTailLayout = {
  labelCol: { span: 4 },
  wrdevApperCol: { span: 8, offset: 4 },
}
import { appStore } from '../../store'
import { mapWritableState } from 'pinia'
import {Sketch} from '@lk77/vue3-color'
import DebugTip from '../../components/DebugTip.vue'
const path=require('path')
export default {
  name: 'base',
  computed: {
    ...mapWritableState(appStore, ['devApp','debugMod'])
  },
  components:{
    DebugTip,'SketchPicker':Sketch
  },
  methods:{
    getExtra(type){
      let tip=`&nbsp;调试&nbsp;`
      switch (type){
        case 'debug_url':
          return tip+`调试入口，仅调试模式下生效，可根据开关启用调试入口`
      }
    },
    async selectDir(){
      let  dir=ipc.sendSync('selectDir')
      if(dir){
        this.devApp.local_dir=dir[0]
      }
    }
  },
  mounted () {
    this.formState.name = this.devApp
    let optimizeValues = ['keepRunning', 'theme', 'desktop', 'showInSideBar', 'alwaysTop', 'autoRun', 'noFrame']
    let optimize = []
    if(this.devApp.settings){
      optimizeValues.forEach(item => {
        if (this.devApp.settings[item]) {
          optimize.push(item)
        }
      })
    }

    // this.form.setFieldsValue({
    //   name: data.name,
    //   summary: data.summary,
    //   theme_color: data.theme_color,
    //   optimize:optimize
    // })

  },
  data () {
    return {
      formItemLayout,
      formTailLayout,
      formState: {
        name: '',
        summary: '',
        theme_color: '',
        optimize: '',
        user_theme_colors: {
          hex:'#ffffff'
        }
      },
    }
  }
}
</script>

<style scoped>
.theme-color {
  width: 42px;
  height: 42px;
  display: inline-block;
  border-radius: 100%;
}
</style>
