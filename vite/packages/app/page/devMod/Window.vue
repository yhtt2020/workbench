<template>
  <h3>窗体设置</h3>
  <p>至少启用其中一种模式，如果启用了多种模式，可通过调用api切换模式。</p>
  <div class="mod-line">
    默认窗体类型：
    <a-radio-group v-model:value="this.windowConfigs.defaultType">
      <a-radio v-if="windowConfigs.frameWindow.enable" value="frameWindow">边框窗体</a-radio>
      <a-radio v-if="windowConfigs.window.enable" value="window">无边框窗体</a-radio>
<!--      <a-radio v-if="windowConfigs.attach.enable" value="attach">分屏窗体</a-radio>-->
    </a-radio-group>
  </div>
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="frame_window" tab="边框窗体">
      <div class="mod-line detail-setting">
        <div>
        <span class="sub-label" style="margin-left: 10px;font-weight: bold">启用</span>
        <a-switch v-model:checked="windowConfigs.frameWindow.enable">边框窗体</a-switch>
        <a-row>
          <a-col :span="9" ><div style="float:left;transform:scale(0.6); display: block;width:410px;height: 320px;background:url('../img/window.png');margin: -69px;
    margin-left: -86px;"></div></a-col>
          <a-col :span="15" >
            <p class="introduce">此模式会自动提供『后退』、『前进』、『刷新』、『设置』等窗体控制按钮，且支持『主题色』的设置。
              <br>开发比较简单，但是由于多了一层外框，内存消耗几乎是无边框的2倍。
            <br>推荐一些web改造应用使用此模式。
            </p>
          </a-col>
        </a-row>

      </div>
        <div class="inner-box" v-if="windowConfigs.frameWindow.enable">

          <a-divider orientation="left">宽度</a-divider>
          <a-row>
            <a-col :span="8">
              <span class="sub-label">默认宽度</span>
              <a-input v-model:value="windowConfigs.frameWindow.width" style="width: 60px"></a-input>
            </a-col>
            <a-col :span="16">
              <template v-if="windowConfigs.frameWindow.canResize">
                <span class="sub-label">宽度限制</span>
                <span style="display: inline-block">
                  <a-input-group compact>
                    <a-input
                      v-model:value="windowConfigs.frameWindow.minWidth"
                      style="width: 100px; text-align: center"
                      placeholder="最小"
                    />
                    <a-input
                      style="width: 30px; border-left: 0; pointer-events: none; background-color: #fff"
                      placeholder="~"
                      disabled
                    />
                    <a-input
                      v-model:value="windowConfigs.frameWindow.maxWidth"
                      style="width: 100px; text-align: center; border-left: 0"
                      placeholder="最大"
                    />
                  </a-input-group>
                </span>
              </template>
            </a-col>
          </a-row>


          <a-divider orientation="left">高度</a-divider>
          <a-row>
            <a-col :span="8">
              <span class="sub-label">默认高度</span>
              <a-input v-model:value="windowConfigs.frameWindow.height" style="width: 60px"></a-input>
            </a-col>
            <a-col>
              <template v-if="windowConfigs.frameWindow.canResize">
                <span class="sub-label">高度限制</span>
                <span style="display: inline-block">
                  <a-input-group compact>
                    <a-input
                      v-model:value="windowConfigs.frameWindow.minHeight"
                      style="width: 100px; text-align: center"
                      placeholder="最小"
                    />
                    <a-input
                      style="width: 30px; border-left: 0; pointer-events: none; background-color: #fff"
                      placeholder="~"
                      disabled
                    />
                    <a-input
                      v-model:value="windowConfigs.frameWindow.maxHeight"
                      style="width: 100px; text-align: center; border-left: 0"
                      placeholder="最大"
                    />
                  </a-input-group>
                </span>


              </template>
            </a-col>
          </a-row>


          <a-divider orientation="left">其他</a-divider>
          <div>
            <span class="sub-label" style="width: 150px">允许用户改变窗口尺寸</span>
            <a-switch v-model:checked="windowConfigs.frameWindow.canResize"></a-switch>
          </div>
          <div>
            <span class="sub-label" style="width: 130px">默认主题色</span>
          </div>
          <div>
            <span class="sub-label">窗口置顶</span>
            <a-switch v-model:checked="windowConfigs.frameWindow.top"></a-switch>
          </div>
          <div>
            <span class="sub-label">按钮启用</span>
            <a-checkbox v-model:checked="windowConfigs.frameWindow.controllers.goForward">前进</a-checkbox>
            <a-checkbox v-model:checked="windowConfigs.frameWindow.controllers.goBack">后退</a-checkbox>
            <a-checkbox v-model:checked="windowConfigs.frameWindow.controllers.refresh">刷新</a-checkbox>
            <a-checkbox v-model:checked="windowConfigs.frameWindow.controllers.home">首页</a-checkbox>
          </div>
        </div>

      </div>
    </a-tab-pane>
    <a-tab-pane key="window" tab="无边框窗体">
      <div class="mod-line detail-setting">
        <div>
          <span class="sub-label" style="margin-left: 10px;font-weight: bold">启用</span>
          <a-switch v-model:checked="windowConfigs.window.enable">无边框窗体</a-switch>
<a-row>
          <a-col :span="9">
  <div style="transform:scale(0.6); display: block;width:410px;height: 320px;background:url('../img/window.png');background-position:-410px 0;margin: -69px;
    margin-left: -86px;"></div>
</a-col>


          <a-col :span="15" >
            <p class="introduce">此模式不会提供任何控制按钮，非常节省资源，但是要求开发者自行通过api设计窗体交互逻辑，开发较为繁琐。<br>
              此模式适合一些小工具类的，例如计时器、歌词等应用。
              <br>
              建议熟练掌握应用开发的开发者使用。
            </p>
          </a-col></a-row>
        </div>


        <div class="inner-box" v-if="windowConfigs.window.enable">
          <a-divider orientation="left">宽度</a-divider>
          <a-row>
            <a-col :span="8">
              <span class="sub-label">默认宽度</span>
              <a-input v-model:value="windowConfigs.window.width" style="width: 60px"></a-input>
            </a-col>
            <a-col :span="16">
              <template v-if="windowConfigs.window.canResize">
                <span class="sub-label">宽度限制</span>
                <span style="display: inline-block">
                  <a-input-group compact>
                    <a-input
                      v-model:value="windowConfigs.window.minWidth"
                      style="width: 100px; text-align: center"
                      placeholder="最小"
                    />
                    <a-input
                      style="width: 30px; border-left: 0; pointer-events: none; background-color: #fff"
                      placeholder="~"
                      disabled
                    />
                    <a-input
                      v-model:value="windowConfigs.window.maxWidth"
                      style="width: 100px; text-align: center; border-left: 0"
                      placeholder="最大"
                    />
                  </a-input-group>
                </span>
              </template>
            </a-col>
          </a-row>


          <a-divider orientation="left">高度</a-divider>
          <a-row>
            <a-col :span="8">
              <span class="sub-label">默认高度</span>
              <a-input v-model:value="windowConfigs.window.height" style="width: 60px"></a-input>
            </a-col>
            <a-col>
              <template v-if="windowConfigs.window.canResize">
                <span class="sub-label">高度限制</span>
                <span style="display: inline-block">
                  <a-input-group compact>
                    <a-input
                      v-model:value="windowConfigs.window.minHeight"
                      style="width: 100px; text-align: center"
                      placeholder="最小"
                    />
                    <a-input
                      style="width: 30px; border-left: 0; pointer-events: none; background-color: #fff"
                      placeholder="~"
                      disabled
                    />
                    <a-input
                      v-model:value="windowConfigs.window.maxHeight"
                      style="width: 100px; text-align: center; border-left: 0"
                      placeholder="最大"
                    />
                  </a-input-group>
                </span>
              </template>
            </a-col>
          </a-row>
          <a-divider orientation="left">其他</a-divider>
          <div>
            <span class="sub-label">窗口置顶</span>
            <a-switch v-model:checked="windowConfigs.window.top"></a-switch>
          </div>
          <div>
            <span class="sub-label">失焦操作</span>
            <a-radio-group button-style="solid" v-model:value="windowConfigs.window.blurAction">
              <a-radio-button value="none">无操作</a-radio-button>
              <a-radio-button value="hide">隐藏</a-radio-button>
              <a-radio-button value="close">关闭</a-radio-button>

            </a-radio-group>
          </div>
          <div>
            <span class="sub-label" style="width: 150px">允许用户改变窗口尺寸</span>
            <a-switch v-model:checked="windowConfigs.window.canResize"></a-switch>
          </div>
        </div>
      </div>
    </a-tab-pane>
<!--    <a-tab-pane key="attach" tab="分屏">-->
<!--      <div class="mod-line detail-setting">-->
<!--        <div>-->
<!--          <span class="sub-label" style="margin-left: 10px;font-weight: bold">启用</span>-->
<!--          <a-switch v-model:checked="windowConfigs.attach.enable"></a-switch>-->

<!--          <a-row>-->
<!--            <a-col :span="9" > <div style="transform:scale(0.6); display: block;width:410px;height: 320px;background:url('../img/window.png');background-position:-810px 0;margin: -69px;-->
<!--    margin-left: -86px;"></div></a-col>-->
<!--            <a-col :span="15" >-->
<!--              <p class="introduce">此模式将吸附到浏览器主窗体右侧，此模式需要应用支持响应式，为了提供优秀体验，建议额外增加接收拖拽事件。-->
<!--                <br>一般用于一些需要和网页频繁交互的应用，例如收藏夹、网盘、笔记等应用。-->
<!--                <br>也非常适合手机应用直接兼容此浏览方式。-->
<!--              </p>-->
<!--            </a-col>-->
<!--          </a-row>-->

<!--        </div>-->


<!--        <div class="inner-box" v-if="windowConfigs.attach.enable">-->
<!--          <a-row>-->
<!--            <a-col :span="8">-->
<!--              <span class="sub-label">默认宽度</span>-->
<!--              <a-input v-model:value="windowConfigs.attach.width" style="width: 60px"></a-input>-->
<!--            </a-col>-->
<!--            <a-col :span="16">-->
<!--              <template v-if="windowConfigs.attach.canResize">-->
<!--                <span class="sub-label">宽度限制</span>-->
<!--                <span style="display: inline-block">-->
<!--                  <a-input-group compact>-->
<!--                    <a-input-->
<!--                      v-model:value="windowConfigs.attach.minWidth"-->
<!--                      style="width: 100px; text-align: center"-->
<!--                      placeholder="最小"-->
<!--                    />-->
<!--                    <a-input-->
<!--                      style="width: 30px; border-left: 0; pointer-events: none; background-color: #fff"-->
<!--                      placeholder="~"-->
<!--                      disabled-->
<!--                    />-->
<!--                    <a-input-->
<!--                      v-model:value="windowConfigs.attach.maxWidth"-->
<!--                      style="width: 100px; text-align: center; border-left: 0"-->
<!--                      placeholder="最大"-->
<!--                    />-->
<!--                  </a-input-group>-->
<!--                </span>-->
<!--              </template>-->
<!--            </a-col>-->
<!--          </a-row>-->
<!--          <a-divider orientation="left">其他</a-divider>-->

<!--          <div>-->
<!--            <span class="sub-label" style="width: 150px">允许用户改变分屏尺寸</span>-->
<!--            <a-switch v-model:checked="windowConfigs.attach.canResize"></a-switch>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </a-tab-pane>-->
  </a-tabs>
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
import {Modal,message} from 'ant-design-vue'
export default {
  name: 'window',

  computed: {
    ...mapWritableState(appStore, ['app', 'debugMod','devApp'])
  },
  components: {
    DebugTip
  },
  data () {
    return {
      activeKey:'frame_window',
      formItemLayout,
      formTailLayout,

      windowDefaultConfigs:{
        defaultType:'frameWindow',
        frameWindow:{
          enable:true,
          width:800,
          minWidth:800,
          maxWidth:800,
          canResize:true,
          height:800,
          minHeight:800,
          maxHeight:800,
          top:false,
          themeColor:'#4680FF',
          controllers:{
            goForward:true,
            goBack:true,
            refresh:true,
            home:true,
          }
        },
        window:{
          enable:false,
          width:400,
          minWidth:300,
          maxWidth:600,
          canResize:true,
          height:400,
          minHeight:300,
          maxHeight:600,
          top:false,
          blurAction:'none',
        },
        attach:{
          enable:false,
          width:320,
          minWidth:320,
          maxWidth:320,
          canResize:true,
        }

      },
      windowConfigs:{
        frameWindow:{},
        window:{
          blurAction:'none'
        },
        attach:{}
      }

    }
  },
  methods: {
    getExtra (type) {
      let tip = `&nbsp;调试&nbsp;`
      switch (type) {
        case 'debug_url':
          return tip + `调试入口，仅调试模式下生效，可根据开关启用调试入口`
      }
    }
  },
  mounted () {
    this.devApp.window=Object.assign(this.windowDefaultConfigs,this.devApp.window)
    this.windowConfigs=this.devApp.window
  }
}
</script>

<style scoped lang="scss">
.detail-setting {
  background: white;
  padding: 10px;
  margin: 10px;
  border: 1px solid #c1c1c1;
  border-radius: 4px;

  div {
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .inner-box {
    padding: 30px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
}

.mod-line {
  margin-top: 10px;
  margin-bottom: 10px;
  padding-left: 10px;
}

.sub-label {
  margin-right: 10px;
  width: 60px;
  display: inline-block;
}

.introduce {
  font-size: 12px;
  padding: 10px;
  background: #f1f1f1;
  margin: 10px;
  border-radius: 4px
}
</style>
