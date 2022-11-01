<template>
<h3>应用信息</h3>
  <a-form :model="formState" style="padding: 20px" :label-col="{span:5}" :wrapper-col="{span:19}">
    <a-form-item
      label="应用名"
      :rules="{ required: true, message: '应用名称，长度大于1，小于16' ,min:1,max:16 }"
    >
      <a-input v-model:value="app.name"
               placeholder="输入应用名称"
      />
    </a-form-item>
    <a-form-item v-if="debugMod"
      label="包名"
      :rules="{ required: true, message: '唯一的应用名，用于开发的时候应用身份确认，唯一' ,min:1,max:16 }"
    >
      <a-input-group compact>
        <a-input style="width: 200px" v-model:value="app.package"
                 placeholder="请点击注册包名"
        >
        </a-input><a-button type="primary">注册包名</a-button>
      </a-input-group>
<DebugTip tip="package"></DebugTip>
    </a-form-item>
    <a-form-item
      label="应用起始地址：" >
                    <span v-if="!debugMod" class="ant-form-text" style="text-overflow: ellipsis;
  white-space: nowrap;display: inline-block;word-break: break-all; overflow: hidden;">
        {{ this.app.url }}
      </span>
      <a-input v-else v-model:value="app.url"/>
    </a-form-item>
    <a-form-item  v-if="debugMod"
                  label="启用调试入口：">
      <template #extra>
        <DebugTip tip="use_debug_url" />
      </template>
      <a-switch  v-model:checked="app.use_debug_url"/>
    </a-form-item>
    <a-form-item  v-if="debugMod && app.use_debug_url"
      label="应用调试地址：">
      <template #extra>
      <DebugTip tip="debug_url" />
      </template>
        <a-input  v-model:value="app.debug_url"/>
    </a-form-item>
    <a-form-item
      label="应用说明"
      :rules="{ required: true, message: '请输入应用说明' }"
    >
      <a-textarea v-model:value="app.summary"
        placeholder="输入应用说明" maxlength="50"
      />
    </a-form-item>
    <a-form-item
      label="主题色">
      <div>
        <span class="theme-color" :style="{'background-color':this.formState.theme_color} "></span>
        <div style="">图标背景色</div>
      </div>
    </a-form-item>
    <a-form-item>
      <!--                  <v-swatches class="color-select" @input="userThemeColorChanged" shapes="circles" v-model="formState.user_theme_color" popover-x="left" popover-y="bottom" show-fallback swatches="text-advanced" fallback-input-type="color"></v-swatches>-->
      <div style="margin-left: 50px;margin-top: -33px">自定义背景色</div>
      <a-button style="position: absolute;margin-left: 140px;margin-top: -21px" type="default" size="small"
                @click="app.user_theme_color='';userThemeColorChanged('')">重置
      </a-button>
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
    <!--                      &lt;!&ndash;                    //   fullscreen - Request for the app to enter fullscreen mode.&ndash;&gt;-->
    <!--                      &lt;!&ndash;                    //   openExternal - Request to open links in external applications.&ndash;&gt;-->
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
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
}
import { appStore } from '../../store'
import { mapWritableState } from 'pinia'
import DebugTip from '../../components/DebugTip.vue'
export default {
  name: 'base',
  computed: {
    ...mapWritableState(appStore, ['app','debugMod'])
  },
  components:{
    DebugTip
  },
  methods:{
    getExtra(type){
      let tip=`&nbsp;调试&nbsp;`
      switch (type){
        case 'debug_url':
          return tip+`调试入口，仅调试模式下生效，可根据开关启用调试入口`
      }
    }
  },
  mounted () {
    console.log(this.app)
    this.formState.name = this.app
    let optimizeValues = ['keepRunning', 'theme', 'desktop', 'showInSideBar', 'alwaysTop', 'autoRun', 'noFrame']
    let optimize = []
    if(this.app.settings){
      optimizeValues.forEach(item => {
        if (this.app.settings[item]) {
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
        user_theme_color: ''
      },
    }
  }
}
</script>

<style scoped>

</style>
