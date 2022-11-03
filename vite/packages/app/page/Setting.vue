<template>

  <a-page-header v-if="!debugMod"
    style="box-shadow: 0 2px 8px #f0f1f2;z-index: 1; padding:6px 10px;"
    :title="this.app.name"

    :avatar="{src:app.logo}"
    sub-title="应用设置"
  >
    <template #extra>
      <a-button  key="1" type="danger" @click="uninstall(appId)" v-if="!app.isSystemApp">
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
  <a-page-header v-else
                 style="box-shadow: 0 2px 8px #f0f1f2;z-index: 1; padding:6px 10px;"
                 :title="this.devApp.name"

                 :avatar="{src:devApp.logo}"
                 sub-title="开发中的应用"
  >
    <template #extra>
      <a-button @click=""  type="primary">
        运行测试应用
      </a-button>
      <a-button @click="()=>{this.$router.push({path:'/allDevApps'})}"  key="go" >
        查看其他开发中应用
      </a-button>
    </template>
  </a-page-header>
  <a-layout id="components-layout-demo-top-side-2" style="height:calc(100vh - 50px)">
    <a-layout>
      <a-layout-sider width="200" theme="light" style="position: relative">
        <a-menu
          theme="light"
          mode="inline"
          :default-selected-keys="['basic']"
          :open-keys="['basic','dev']"
          :style="{ height: '100%', borderRight: 0 }"
        >
          <a-menu-item v-if="debugMod"  key="8">
            <template #icon>
              <smile-outlined />
            </template>
            <router-link :to="{path:'/setting/wizard'}"><strong>开发向导</strong>
            </router-link>
          </a-menu-item >
          <a-sub-menu v-if="!debugMod" key="basic">
            <template #icon>
              <SettingOutlined></SettingOutlined>
            </template>
            <template #title>基础设置</template>
            <a-menu-item key="1">
              <router-link :to="{path:'/setting/'}">应用信息</router-link>
            </a-menu-item>
            <a-menu-item key="2">
              <router-link :to="{path:'/setting/optimize'}">体验优化</router-link>
            </a-menu-item>
            <a-menu-item v-if="debugMod" key="auth">
              <router-link :to="{path:'/setting/auth'}">应用授权</router-link>
            </a-menu-item>


            <!--                <a-menu-item key="3">-->
            <!--                  <a href="#permission">权限管理</a>-->
            <!--                </a-menu-item>-->
          </a-sub-menu>
          <!--              <a-menu-item key="fenshen">-->
          <!--                <a-icon type="user"></a-icon>-->
          <!--                应用分身-->
          <!--              </a-menu-item>-->

          <a-sub-menu  v-if="debugMod" key="basicDev">
            <template #icon>
              <code-two-tone/>
            </template>
            <template #title>应用开发设置</template>
            <a-menu-item key="baseDev">
              <router-link :to="{path:'/setting/baseDev'}">基础信息</router-link>
            </a-menu-item>
            <a-menu-item  key="authDev">
              <router-link :to="{path:'/setting/authDev'}">权限设置</router-link>
            </a-menu-item>
            <a-menu-item key="optimizeDev">
            <router-link :to="{path:'/setting/optimizeDev'}">体验优化</router-link>
          </a-menu-item>

            <a-menu-item v-if="debugMod" key="window">
              <router-link :to="{path:'/setting/window'}"><strong>窗体设置</strong>
              </router-link>
            </a-menu-item>
          </a-sub-menu>

          <a-sub-menu key="dev">
            <template #icon>
              <LaptopOutlined></LaptopOutlined>
            </template>
            <template #title>深度集成</template>
            <!--                <a-menu-item key="5">-->
            <!--                  菜单管理-->
            <!--                </a-menu-item>-->
            <a-menu-item key="6">
              <router-link :to="{path:'/setting/develop'}">开发者模式</router-link>
            </a-menu-item>
            <router-link :to="{path:'/setting/tool'}">
            <a-sub-menu v-if="debugMod" key="devtool">
              <template #title>开发者工具</template>
              <a-menu-item key="export">
                <router-link :to="{path:'/setting/export'}">导出工具</router-link>
              </a-menu-item>
            </a-sub-menu>
            </router-link>

            <a-menu-item v-if="debugMod" key="all">
              <router-link :to="{path:'/setting/allDevapps'}"><strong>开发中的应用</strong>
              </router-link>
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
        <div  v-if="debugMod"  style="position:absolute;bottom: 10px;left: 10px;text-align: center;width: 100%">
          <a-button type="primary" style="margin-right: 20px" @click="save">保存</a-button>
          <a-button @click="reset">重置</a-button>
        </div>
      </a-layout-sider>
      <a-layout-content>
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
import { SettingOutlined, LaptopOutlined,SmileOutlined,} from '@ant-design/icons-vue'
import { appStore } from '../store'
import { mapState,mapActions } from 'pinia'
import { CodeTwoTone } from '@ant-design/icons-vue'
import {message,Modal} from 'ant-design-vue'
let { appModel } = window.$models
let appId =
  window.globalArgs['app-id']

export default {
  name: 'Setting',
  components: {
     SettingOutlined, LaptopOutlined, CodeTwoTone, vueCustomScrollbar,SmileOutlined
  },
  computed: {
    ...mapState(appStore, ['app', 'debugMod','devApp'])
  },
  data () {
    return {
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
    await appStore().getApp(appId)

  },
  methods: {
    ...mapActions(appStore,['reloadDevApp','saveDevApp']),
    goDevelop () {
      this.$router.push({ path: 'develop' })
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
    reset(){
      Modal.confirm({
        content:'是否放弃当前所有改动重载之前的配置？',
        onOk:()=>{
          this.reloadDevApp()
          message.success('已为您重置当前开发应用的信息。')
        }
      })
    },
    async save () {
      try{
        await this.saveDevApp()
        message.success('保存成功。')
      }catch (e) {
        message.error('保存失败。'+e)
      }

    }
  }
}
</script>
<style>
body,html {
  overflow: hidden;
  width:100% !important
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
