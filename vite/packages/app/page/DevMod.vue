<template>
  <a-layout-header  style="background: rgb(255,255,255);box-shadow: 0 0 8px rgba(63,63,63,0.2);z-index: 1;padding-left: 20px;padding-right: 20px;" class="header" theme="light">
    <div style="display: flex">
      <div>
        <div class="logo" style="font-size: 16px;margin-right: 20px;font-weight: 700"><a-avatar style="margin-right: 10px" src="/icons/dev.svg"></a-avatar> 开发模式</div>
      </div>
      <div style="flex: auto">
        <a-menu
          v-model:selectedKeys="currentDevApp"
          theme="light"
          mode="horizontal"
          :style="{ lineHeight: '64px' ,borderBottom:'none'}"
        >
          <a-sub-menu>
            <template #title>
              开发中的项目
            </template>
            <a-menu-item v-for="app in devApps" @click="loadDevApp(app)" :key="app.nanoid">
              <template #icon>
                <a-avatar :src="app.logo"></a-avatar>
              </template>
              {{ app.name }}
            </a-menu-item>
            <a-menu-item key="all">
              <router-link :to="{path:'/allDevapps'}"><strong>全部项目</strong>
              </router-link>
            </a-menu-item>
          </a-sub-menu>
          <a-menu-item key="tool">
            <router-link :to="{path:'/dev/tool'}">开发者工具</router-link>
          </a-menu-item>
          <a-menu-item key="doc">
            <template #icon>
              <SelectOutlined style="transform: rotateY(180deg)"/>
            </template>
            <a @click="goDoc">在线文档</a>
          </a-menu-item>
        </a-menu>
      </div>
      <div>
<span @click="login" v-if="!user" style="cursor: pointer">  <a-avatar>
              开
            </a-avatar> 登录</span>
        <a-dropdown v-else>
          <a-avatar :src="user.user_info.avatar">
          </a-avatar>
          {{ user.user_info.nickname }}
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a href="javascript:;">打开应用市场</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>


  </a-layout-header>
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

            <!--              <a-menu-item key="fenshen">-->
            <!--                <a-icon type="user"></a-icon>-->
            <!--                应用分身-->
            <!--              </a-menu-item>-->

            <a-sub-menu v-if="debugMod" key="basicDev">
              <template #icon>
                <code-two-tone/>
              </template>
              <template #title>应用开发设置</template>
              <a-menu-item key="baseDev">
                <router-link :to="{path:'/dev/'}">基础信息</router-link>
              </a-menu-item>
              <a-menu-item key="author">
                <router-link :to="{path:'/dev/author'}">作者信息</router-link>
              </a-menu-item>
              <a-menu-item key="authDev">
                <router-link :to="{path:'/dev/auth'}">权限设置</router-link>
              </a-menu-item>
              <a-menu-item key="optimizeDev">
                <router-link :to="{path:'/dev/optimize'}">体验优化</router-link>
              </a-menu-item>

              <a-menu-item v-if="debugMod" key="window">
                <router-link :to="{path:'/dev/window'}"><strong>窗体设置</strong>
                </router-link>
              </a-menu-item>
            </a-sub-menu>

            <a-sub-menu key="dev">
              <template #icon>
                <LaptopOutlined></LaptopOutlined>
              </template>
              <template #title>开发工具</template>
              <!--                <a-menu-item key="5">-->
              <!--                  菜单管理-->
              <!--                </a-menu-item>-->
              <router-link :to="{path:'/dev/tool'}">

                <a-menu-item key="export">
                  <router-link :to="{path:'/dev/export'}">导出工具</router-link>
                </a-menu-item>
              </router-link>


            </a-sub-menu>
          </a-menu>
        </div>
        <div style="height: 160px;padding: 10px" >
          <div style="width: 82%;margin: auto;margin-bottom: 10px;">

            <router-link :to="{path:'/dev/wizard'}"><a-button block type="danger" >    <smile-outlined/><strong>&nbsp; 开发向导</strong></a-button>
            </router-link>
          </div>
          <div style=" text-align: center;width: 100%">
            <a-button type="primary" style="margin-right: 20px" @click="save">保存</a-button>
            <a-button @click="reset">重置</a-button>
          </div>
        </div>
      </div>
    </a-layout-sider>
    <a-layout-content>
      <a-page-header  @back="goALl"
                      style="box-shadow: 0 2px 8px #f0f1f2;z-index: 1; padding:6px 10px;"
                      :title="this.devApp.name"

                      :avatar="{src:devApp.logo}"
                      sub-title="开发中的项目"
      >
        <template #extra>
          <a-dropdown-button type="primary" @click="run">
            运行测试应用
            <template #overlay>
              <a-menu>
                <a-menu-item  @click="reInstallAndRun" key="1">
                  重新安装并运行
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown-button>
        </template>
      </a-page-header>
      <vue-custom-scrollbar :key="routeUpdateTime" :settings="settings" style="position:relative;height: calc(100vh - 105px)">
        <div style="padding: 20px">
          <router-view/>
        </div>
      </vue-custom-scrollbar>
    </a-layout-content>
  </a-layout>
</template>

<script>
import vueCustomScrollbar from '../../../src/components/vue-scrollbar.vue'
import { SettingOutlined, LaptopOutlined, SmileOutlined,BookOutlined,SelectOutlined } from '@ant-design/icons-vue'
import { appStore } from '../store'
import { mapState, mapActions,mapWritableState } from 'pinia'
import { CodeTwoTone } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'

let { appModel, devAppModel } = window.$models
let appId =
  window.globalArgs['app-id']

export default {
  name: 'DevMod',
  components: {
    SettingOutlined, LaptopOutlined, CodeTwoTone, vueCustomScrollbar, SmileOutlined,BookOutlined,SelectOutlined
  },
  computed: {
    ...mapState(appStore, ['app', 'debugMod', 'devApp']),
    ...mapWritableState(appStore,['user']),
  },
  beforeRouteUpdate(){
    this.routeUpdateTime=Date.now()
  },
  data () {
    return {
      currentDevApp: [],
      routeUpdateTime:0,
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
    this.devApps = await devAppModel.getAll()
    let userRs =  await tsbApi.user.get()
    if(userRs.status){
      this.user=userRs.data
    }

    let hasTipAppManagerWizard=localStorage.getItem('hasTipAppManagerWizard')
    if(!hasTipAppManagerWizard){
      Modal.info({
        centered:true,
        content:'首次使用开发者工具，建议点击左下角红色开发向导按钮，详细了解一个应用从创建项目到上线需要做的事情。',
        okText:'我知道了，不再提示',
        onOk:()=>{
          localStorage.setItem('hasTipAppManagerWizard',true)
      }
      })
    }


  },
  methods: {
    installAndRun(){
      Modal.confirm({
        centered: true,
        content: '首次运行测试应用需要安装此应用，是否以当前配置安装并运行测试应用？此操作将保存全部的配置。',
        onOk: async () => {
          try {
            let app=await this.saveAndInstall()
            if(app)
            {
              Modal.info({
                centered:true,
                content:'成功安装运行，如若需要设置生效，则需要重新安装并运行应用',
                okText:'我知道了'
              })
            }
          } catch (e) {
            message.error('运行测试应用失败，失败原因：' + e)
          }
        }
      })
    },
    /**
     * 重装兵运行
     */
    reInstallAndRun(){
      Modal.confirm({
        centered: true,
        content: '是否以当前配置重新安装并运行测试应用？此操作将保存全部的配置并删除之前的测试应用。',
        onOk: async () => {
          try {
            let debugApp=await appModel.get({nanoid:this.devApp.debug_app_nanoid})
            if(!!!debugApp){
              console.warn('调试应用不存在，忽略')
            }else{
              await appModel.uninstall(this.devApp.debug_app_nanoid)
              ipc.sendSync('deleteApp',{nanoid:this.devApp.debug_app_nanoid})
            }
            this.devApp.debug_app_nanoid=''
            let app=await this.saveAndInstall()
          } catch (e) {
            message.error('运行测试应用失败，失败原因：' + e)
          }
        }
      })
    },
    /**
     * 保存当前设置并安装
     * @returns {Promise<*>}
     */
    async saveAndInstall () {
      await this.saveDevApp()
      let appJson = await devAppModel.get(this.devApp.nanoid)
      appJson.is_debug=true
     // let appNanoid = await appModel.installDebugAppFromJson(appJson)
      let installResult=ipc.sendSync('installAppConfirm',{background:false,appJson:appJson})
      if(installResult.result){
        let app = await appModel.get({ nanoid: installResult.nanoid })
        this.devApp.debug_app_nanoid = app.nanoid
        await this.saveDevApp()
        return app
      }else{
        message.error('安装意外终止')
      }

    },
    async run () {
      if (!this.devApp.debug_app_nanoid) {
        this.installAndRun()
      } else {
        let app = await appModel.get({ nanoid: this.devApp.debug_app_nanoid })
        if (!app) {
          this.installAndRun()
        }else{
          ipc.send('executeApp', {
            app: app
          })
        }
      }
    },
    goDoc(){
      ipc.send('addTab',{url:'https://a.apps.vip/docs'})
    },
    login(){
      tsbApi.user.login()
    },
    goALl(){
      this.devMod=false
      this.$router.push('/allDevapps')
    },
    ...mapActions(appStore, ['reloadDevApp', 'saveDevApp', 'setDevApp']),
    async loadDevApp (devApp) {
      await this.setDevApp(devApp)
      this.$router.push('/dev/')
    },
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

<style scoped lang="scss">
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
