<template>
  <h3>权限设置</h3>
  <h4>应用默认所需权限</h4>
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="base" tab="基础权限">
      <div class="mod-line detail-setting">
        <p class="introduce">基础权限包括一些特殊的能力，此类能力一般是网页无法获得的权限。
        </p>
        <div class="items-container">
          <a-row v-for="item in baseList" class="item">
            <a-col :span="8"> <a-checkbox v-model:checked="auth.base[item.key]"><strong>{{ item.name }}</strong> <br>{{ item.alias }}</a-checkbox></a-col>
            <a-col :span="16"> {{ item.summary }}</a-col>
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
const  {appModel} = window.$models

export default {
  name: 'base',

  computed: {
    ...mapWritableState(appStore, ['app', 'debugMod','devApp'])
  },
  components: {
    DebugTip
  },
  data () {
    return {
      activeKey: 'base',
      formItemLayout,
      formTailLayout,
      authDefaultConfigs:{
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
      auth:{
        base:{},
        api:{},
        ability:{}
      },
      baseList:appModel.authBaseList,
      apiList:appModel.authApiList,
      abilityList:appModel.authAbilityList
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
    if(!this.devApp.auth){
      this.devApp.auth={}
    }
    this.devApp.auth=Object.assign(this.authDefaultConfigs,this.devApp.auth)
    this.auth=this.devApp.auth
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
