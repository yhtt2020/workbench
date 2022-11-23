<template>
  <div style="padding: 20px;text-align: center">
    <div style="text-align: center">
      <a-avatar style="width: 60px;height: 60px" :src="app.logo">
      </a-avatar>

    </div>
    <div style="font-size: 18px;font-weight: bold;margin-top: 10px">{{ app.name }}</div>
    <div style="margin-top:10px;margin-bottom: 10px;color: grey;font-size: 12px" v-if="from">来源：{{ from }}</div>
    <div class="card-container">
      <p style="color: grey;margin-bottom: 10px">需要的权限</p>
      <a-tabs  class="card-container" type="card" size="small" v-model:active-key="current">
        <a-tab-pane  key="base" tab="基础权限">
          <a-empty style="margin-top: 30px" description="" v-if="!checkHas(this.app.auth.base)">
          </a-empty>
          <ul class="auth-list">
            <template v-for="item in authList.baseList">
              <li v-if="app.auth.base[item.key]">
                <a-checkbox block v-model:checked="userSetting.auth.base[item.key]"> {{ item.alias }}</a-checkbox>
              </li>
            </template>
          </ul>
        </a-tab-pane>
        <a-tab-pane  key="api" tab="API权限">
          <a-empty style="margin-top: 30px" description="" v-if="!checkHas(this.app.auth.api)">
          </a-empty>
          <ul class="auth-list">
            <template v-for="item in authList.apiList">
              <li v-if="app.auth.api[item.key]">
                <a-checkbox block v-model:checked="userSetting.auth.api[item.key]">{{ item.alias }}</a-checkbox>
              </li>
            </template>
          </ul>
        </a-tab-pane>
        <a-tab-pane  key="extra" tab="额外能力">
          <a-empty style="margin-top: 30px" description="" v-if="!checkHas(this.app.auth.ability)">

          </a-empty>
          <ul class="auth-list">
            <template v-for="item in authList.abilityList">
              <li v-if="app.auth.ability[item.key]">
                <a-checkbox block v-model:checked="userSetting.auth.ability[item.key]">{{ item.alias }}</a-checkbox>
              </li>
            </template>
          </ul>
        </a-tab-pane>
      </a-tabs>
    </div>


  </div>
  <div style="position: fixed;bottom: 0;padding: 20px;width: 100%;text-align: center">


    <a-button style="margin-right:40px" type="primary" @click="install">安装</a-button>
    <a-button @click="close">取消</a-button>
  </div>

  <div style="position: fixed;left: 10px;top: 10px;color: grey;font-size: 12px">应用安装</div>
</template>

<script>
const { appModel } = window.$models
import  _ from 'lodash-es'
export default {
  name: 'installApp',
  data () {
    return {
      app: {
        auth: {
          base: {},
          api: {},
          ability: {}
        }
      },
      from: '未知来源',
      auth: {},
      current: 'base',

      authList: {
        baseList: appModel.authBaseList,
        apiList: appModel.authApiList,
        abilityList: appModel.authAbilityList
      },
      userSetting: {
        auth: {
          base: {},
          api: {},
          ability: {}
        }
      }
    }

  },
  mounted () {
    ipc.on('returnInstallAppJson', (event, args) => {
      this.app = args.appJson
      this.from = args.from
      this.auth = this.app.auth
      this.userSetting.auth = _.cloneDeep(Object.assign(this.userSetting.auth,this.app.auth))
    })
    ipc.send('getInstallAppJson')
  },
  methods: {
    checkHas(object){
      return Object.keys(object).some(key=>{
        console.log(object[key])
        return object[key]
      })
    },
    async install () {
      let installedAppId=''
      delete this.app.nanoid
      if(this.app.is_debug){
        installedAppId=await appModel.installDebugAppFromJson(this.app)
      }else{
        installedAppId=await appModel.installFromJson(this.app)
      }
      await appModel.setUserSetting(this.app,this.userSetting)
      ipc.send('installAppReturn', { result: true, nanoid:installedAppId})
      ipc.send('closeSelf')
    },
    close () {
      ipc.send('installAppReturn', { result: false })
      ipc.send('closeSelf')
    }
  }
}
</script>
<style>
.card-container p {
  margin: 0;
}
.card-container > .ant-tabs-card .ant-tabs-content{
  height: 210px !important;
  border-radius: 3px;
  overflow-y: auto;
  background: white;
}
.card-container > .ant-tabs-card .ant-tabs-content {
  height: 120px;
  margin-top: -16px;
}

.card-container > .ant-tabs-card .ant-tabs-content > .ant-tabs-tabpane {
  padding: 16px;
  background: #fff;
}

.card-container > .ant-tabs-card > .ant-tabs-nav::before {
  display: none;
}

.card-container > .ant-tabs-card .ant-tabs-tab,
[data-theme='compact'] .card-container > .ant-tabs-card .ant-tabs-tab {
  background: transparent;
  border-color: transparent;
}

.card-container > .ant-tabs-card .ant-tabs-tab-active,
[data-theme='compact'] .card-container > .ant-tabs-card .ant-tabs-tab-active {
  background: #fff;
  border-color: #fff;
}

#components-tabs-demo-card-top .code-box-demo {
  padding: 24px;
  overflow: hidden;
  background: #f5f5f5;
}

[data-theme='compact'] .card-container > .ant-tabs-card .ant-tabs-content {
  height: 120px;
  margin-top: -8px;
}

[data-theme='dark'] .card-container > .ant-tabs-card .ant-tabs-tab {
  background: transparent;
  border-color: transparent;
}

[data-theme='dark'] #components-tabs-demo-card-top .code-box-demo {
  background: #000;
}

[data-theme='dark'] .card-container > .ant-tabs-card .ant-tabs-content > .ant-tabs-tabpane {
  background: #141414;
}

[data-theme='dark'] .card-container > .ant-tabs-card .ant-tabs-tab-active {
  background: #141414;
  border-color: #141414;
}

body {
  user-select: none;
}
</style>
<style scoped lang="scss">
.auth-list {
  padding-left: 0;
  text-align: left;
  list-style: none;

  li {
    margin-bottom: 5px;
    padding:  5px 10px;
    border-radius: 4px;
    border-bottom: 1px solid rgba(241, 241, 241, 0.58);

  }
}
</style>
