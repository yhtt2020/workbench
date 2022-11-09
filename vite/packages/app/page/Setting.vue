<template>


  <a-layout style="height:calc(100vh)">
    <a-layout>
      <a-layout-sider width="200" theme="light" style="position: relative">
        <div  style="display:flex;flex-direction:column;width: 200px;height: 100vh">
          <div style="flex:auto">
            <a-menu
              theme="light"
              mode="inline"
              :default-selected-keys="['basic']"
              :open-keys="['basic','dev','basicDev']"
              :style="{ height: '100%', borderRight: 0 }"
            >
              <a-sub-menu   key="basic">
                <template #icon>
                  <SettingOutlined></SettingOutlined>
                </template>
                <template #title>基础设置</template>
                <a-menu-item key="1">
                  <router-link :to="{path:'/setting/'+appId}">应用信息</router-link>
                </a-menu-item>
                <a-menu-item key="2">
                  <router-link :to="{path:'/setting/optimize'}">体验优化</router-link>
                </a-menu-item>
                <a-menu-item key="auth">
                  <router-link :to="{path:'/setting/auth'}">权限管理</router-link>
                </a-menu-item>
                <a-menu-item key="6">
                  <router-link :to="{path:'/setting/develop'}">进入开发者模式</router-link>
                </a-menu-item>
              </a-sub-menu>
            </a-menu>
          </div>
        </div>


      </a-layout-sider>
      <a-layout-content>
        <a-page-header
          @back="goALl"
                       style="box-shadow: 0 2px 8px #f0f1f2;z-index: 1; padding:6px 10px;"
                       :title="this.app.name"

                       :avatar="{src:app.logo}"
                       sub-title="应用设置"
        >
          <template #extra>
            <a-button key="1" type="danger" @click="uninstall(appId)" v-if="!app.isSystemApp">
              卸载应用
            </a-button>
            <span v-else>
        <a-tooltip title="系统应用，不可卸载">
          <a-button disabled size="small" key="1" @click="uninstall(appId)">
        卸载应用
      </a-button>
        </a-tooltip>
      </span>
          </template>
        </a-page-header>
        <vue-custom-scrollbar :settings="settings" style="position:relative;height: calc(100vh - 55px)">
          <div style="padding: 20px">
            <router-view/>
          </div>
        </vue-custom-scrollbar>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import vueCustomScrollbar from '../../../src/components/vue-scrollbar.vue'
import { SettingOutlined, LaptopOutlined, SmileOutlined, } from '@ant-design/icons-vue'
import { appStore } from '../store'
import { mapState, mapActions } from 'pinia'
import { CodeTwoTone } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'

let { appModel, devAppModel } = window.$models
let appId =
  window.globalArgs['app-id']

export default {
  name: 'Setting',
  components: {
    SettingOutlined, LaptopOutlined, CodeTwoTone, vueCustomScrollbar, SmileOutlined
  },
  computed: {
    ...mapState(appStore, ['app', 'debugMod', 'devApp'])
  },
  data () {
    return {
      user:{
        user_info:{}
      },
      currentDevApp: [],
      settings: {
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: false
      },
      checkNick: false,

      // form: this.$form.createForm(this, {
      //   name: 'appSetting', onValuesChange: (props, values) => {
      //     if(values.optimize){
      //       //['keepRunning', 'theme', 'desktop', 'showInSideBar', 'alwaysTop', 'autoRun']
      //       let optimizeValue=['keepRunning', 'theme', 'desktop', 'showInSideBar', 'alwaysTop', 'autoRun','noFrame']
      //       let optimize=values['optimize']
      //       let settings={}
      //       optimizeValue.forEach(item=>{
      //         settings[item] = optimize.indexOf(item) > -1;
      //       })
      //       appModel.setAppSetting(window.globalArgs['app-id'],settings)
      //       this.tipSave()
      //       //todo 主动更新应用信息，即时更新
      //     }else if(values.name){
      //       this.saApp.name=values.name
      //       appModel.update(window.globalArgs['app-id'], { name: tools.htmlEncode(values.name) })
      //       this.tipSave()
      //       //todo 主动更新应用信息，即时更新
      //     }else if(values.summary){
      //       appModel.update(window.globalArgs['app-id'], { summary: tools.htmlEncode(values.summary) })
      //       this.tipSave()
      //       //todo 主动更新应用信息，即时更新
      //     }
      //   }
      // }),
    }
  },

  async mounted () {
    this.appId = appId
    console.log(this.$route.params)
    if(this.$route.params.appId){
      this.appId=this.$route.params.appId
    }
    await appStore().getApp(this.appId)
    let userRs =  await tsbApi.user.get()
    if(userRs.status){
      this.user=userRs.data
    }
  },
  methods: {
    run(){
      if(!this.devApp.debug_app){
        Modal.confirm({
          centered:true,
          content:'首次运行测试应用需要安装此应用，是否以当前配置安装并运行测试应用？',
          onOk:()=>{

          }
        })
      }
    },
    login(){
      tsbApi.user.login()
    },
    goALl(){
      this.devMod=false
      this.$router.push('/allApps')
    },
    ...mapActions(appStore, ['reloadDevApp', 'saveDevApp', 'setDevApp']),
    async loadDevApp (devApp) {
      await this.setDevApp(devApp)
      this.$router.push('/dev/baseDev')
    },
    goDevelop () {
      this.$router.push({ path: '/dev/' })
    },
    userThemeColorChanged (input) {
      appModel.update(this.appId, { user_theme_color: input })
      this.tipSave()
    },
    tipSave () {
      appVue.$message.info({ content: '保存成功，此处设置修改需浏览器重启后生效。', key: 'save' })
    },
    uninstall (appId) {
      this.$confirm({
        title: '确定卸载此应用？',
        content: '此操作将卸载应用并清空所有应用数据，且无法还原。请谨慎操作。',
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          appModel.uninstall(appId).then(success => {
            ipc.send('message', { type: 'success', config: { content: '卸载应用成功。' } })
            ipc.send('deleteApp', { nanoid: appId })
          }, err => {
            ipc.send('message', { type: 'success', config: { content: '卸载失败。' } })
          })
        },
        onCancel () {
          console.log('Cancel')
        },
      })

    },
    check () {
      this.form.validateFields(err => {
        if (!err) {
          console.info('success')
        }
      })
    },
    handleChange (e) {
      this.checkNick = e.target.checked
      this.$nextTick(() => {
        this.form.validateFields(['nickname'], { force: true })
      })
    },
    reset () {
      Modal.confirm({
        content: '是否放弃当前所有改动重载之前的配置？',
        onOk: () => {
          this.reloadDevApp()
          message.success('已为您重置当前开发应用的信息。')
        }
      })
    },
    async save () {
      try {
        await this.saveDevApp()
        message.success('保存成功。')
      } catch (e) {
        message.error('保存失败。' + e)
      }

    }
  }
}
</script>
<style>
body, html {
  overflow: hidden;
  width: 100% !important
}
</style>
<style lang="scss">
h3 {
  &:before {
    content: "";
    display: inline-block;
    background: #0051ff;
    width: 5px;
    border-radius: 3px;
    height: 16px;
    position: absolute;
    bottom: 8px;
    left: -8px;

  }
}
</style>
