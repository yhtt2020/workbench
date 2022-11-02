<template>
  <h3>权限设置</h3>
  <h4>应用默认所需权限</h4>
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="base" tab="基础权限">
      <div class="mod-line detail-setting">
        <p class="introduce">基础权限包括一些特殊的能力，此类能力一般是网页无法获得的权限。
        </p>
        <div class="items-container">
          <a-row>
            <a-col :span="8"> <a-checkbox v-model:checked="auth.base.webSecure"><strong>base.webSecure</strong> <br>跨域</a-checkbox></a-col>
            <a-col :span="16"> 支持跨域发起请求，在服务器端未做任何设置的情况下都可发起api请求。</a-col>
          </a-row>
          <a-row>
            <a-col :span="8"> <a-checkbox v-model:checked="auth.base.node"><strong>base.node</strong> <br/>Node集成</a-checkbox></a-col>
            <a-col :span="16"> 支持跨域发起请求，在服务器端未做任何设置的情况下都可发起api请求。</a-col>
          </a-row>
        </div>
      </div>
    </a-tab-pane>
    <a-tab-pane key="api" tab="API权限">
      <div class="mod-line detail-setting">
        <div>
          <p class="introduce">启用API后，系统将会在window注入全局对象tsbApi，开发者可直接使用tsbApi.xxx.xxx调用api。
          </p>
          <span class="sub-label" style="margin-left: 10px;font-weight: bold">启用</span>
          <a-switch v-model:checked="auth.api.enable"></a-switch>
        </div>
        <div class="items-container" v-if="auth.api.enable">
          <a-row v-for="api in apiList" class="item">
            <a-col :span="9"> <a-checkbox :disabled="api.disabled" v-model:checked="auth.api[api.key]"><strong>{{ api.name }}</strong> <br>{{api.alias}}</a-checkbox></a-col>
            <a-col :span="15">{{api.summary}}</a-col>
          </a-row>
        </div>
      </div>
    </a-tab-pane>
    <a-tab-pane key="ability" tab="额外能力权限">
      <div class="mod-line detail-setting">
        <div>
          <p class="introduce">此类权限和api权限的区别在于，此类能力一般需要配置，且很多都是要和后端api进行交互的。
          </p>
        </div>
        <div class="items-container">
          <a-row v-for="api in abilityList" class="item">
            <a-col :span="9"> <a-checkbox :disabled="api.disabled" v-model:checked="auth.api[api.key]"><strong>{{ api.name }}</strong> <br>{{api.alias}}</a-checkbox></a-col>
            <a-col :span="15">{{api.summary}}</a-col>
            <a-col v-if="auth.api[api.key]" style="padding-left: 20px" :span="24">
              <div v-if="api.key==='offlinePush'">
                必须注册包名，并申请开放平台应用才可使用此功能。<a>点此申请</a>
              </div>
            </a-col>
          </a-row>
        </div>


      </div>
    </a-tab-pane>
  </a-tabs>

  <div style="text-align:right;margin-right: 10px;">
    <a-button style="margin-right: 20px" type="primary" @click="save">保存</a-button>
    <a-button>重置</a-button>
  </div>
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
import { Modal, message } from 'ant-design-vue'
const apiList=[
  {
    disabled:true,
    key:'runtime',
    name:'tsbApi.runtime.*',
    alias:'运行时',
    summary:'包括API的运行状态，只要启用了API即可获得，区别是如果部分API未启用，则获取不到对应的信息。'
  },
  {
    disabled:true,
    key:'util',
    name:'tsbApi.util.*',
    alias:'工具类',
    summary:'包含一些辅助工具类，默认可使用。'
  },
  {
    key:'window',
    name:'tsbApi.window.*',
    alias:'窗体操作',
    summary:'窗体API，包括各种最大化、最小化、显示、隐藏、吸附等操作，用于模拟窗体按钮。'
  },
  {
    key:'barrage',
    name:'tsbApi.barrage.*',
    alias:'弹幕功能',
    summary:'支持通过api使用弹幕功能。'
  },
  {
    key:'tabs',
    name:'tsbApi.tabs.*',
    alias:'标签',
    summary:'可获取到当前的标签信息。'
  },
  {
    key:'user',
    name:'tsbApi.user.*',
    alias:'用户信息',
    summary:'可获取到当前的登录用户信息、手动触发用户登录。'
  },
  {
    key:'notification',
    name:'tsbApi.notification.*',
    alias:'系统消息提醒',
    summary:'通过系统的弹窗直接触发消息。'
  },
  {
    key:'fs',
    name:'tsbApi.fs.*',
    alias:'文件操作',
    summary:'可通过fs操作文件，此类API用户可能比较敏感，请谨慎开启。'
  },
  {
    key:'system',
    name:'tsbApi.system.*',
    alias:'系统便捷操作',
    summary:'包括一些常用的操作，例如设置壁纸。'
  }
]
const abilityList=[
  {
    key:'offlinePush',
    name:'offlinePush',
    alias:'离线消息',
    summary:'通过服务器向轻聊应用机器人发送消息。',
    needPackage:true
  },
  {
    key:'robot',
    name:'robot',
    alias:'群机器人',
    summary:'开通应用的群机器人，可以方便地与轻聊的群进行交互。',
    needPackage:true
  },
  {
    key:'widget',
    name:'widget',
    alias:'效率栏组件',
    summary:'启用效率栏小组件。',
    needPackage:true
  },
  {
    key:'deskWidget',
    name:'deskWidget',
    alias:'想天桌面组件',
    summary:'启用想天桌面小组件小组件。',
    needPackage:true
  },
  {
    key:'cloudArchiving',
    name:'云存档',
    alias:'云存档',
    summary:'云存档，允许调用api进行云端数据存储和读取，方便实现云同步。',
    needPackage:true,
  }
]
export default {
  name: 'base',

  computed: {
    ...mapWritableState(appStore, ['app', 'debugMod'])
  },
  components: {
    DebugTip
  },
  data () {
    return {
      activeKey: 'base',
      formItemLayout,
      formTailLayout,

      auth:{
        base:{
          webSecure:false,
          node:false
        },
        api:{
            runtime:true,
            util:true,
            window:true,
            barrage:false,
            user:false,
            tabs:false,
        },
        ability:{

        }
      },
      apiList,
      abilityList
    }
  },
  methods: {
    save () {
      let windowConfig = {}

      if (!(this.windowConfigs.frameWindow.enable || this.windowConfigs.window.enable || this.windowConfigs.attach.enable)) {
        message.error({
          content: '必须至少启用一种窗体'
        })

      }

    },
    getExtra (type) {
      let tip = `&nbsp;调试&nbsp;`
      switch (type) {
        case 'debug_url':
          return tip + `调试入口，仅调试模式下生效，可根据开关启用调试入口`
      }
    }
  },
  mounted () {
    let optimizeValues = ['keepRunning', 'theme', 'desktop', 'showInSideBar', 'alwaysTop', 'autoRun', 'noFrame']
    let optimize = []
    if (this.app.settings) {
      optimizeValues.forEach(item => {
        if (this.app.settings[item]) {
          optimize.push(item)
        }
      })
    }

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
.record-row{

}
.items-container{
  .item{
    padding:  3px 10px;
    border-radius: 4px;
    margin-bottom: 0;
    margin-top: 0;
    &:nth-child(odd){
      background: rgba(241, 241, 241, 0.47);
    }
    &:hover{
      background: #f1f1f1;
    }
  }
 padding: 15px;
}
</style>
