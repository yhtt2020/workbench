<template>


  <a-layout style="height:calc(100vh)">
    <a-layout>
      <a-layout-sider width="200" theme="light" style="position: relative">
        <div  style="display:flex;flex-direction:column;width: 200px;height: 100vh">
          <div style="flex:auto">
            <a-menu
              theme="light"
              mode="inline"
              v-model:selectedKeys="activeNav"
              :default-selected-keys="['base']"
              :open-keys="['basic' ]"
              :style="{ height: '100%', borderRight: 0 }"
            >
              <a-sub-menu   key="basic">
                <template #icon>
                  <SettingOutlined></SettingOutlined>
                </template>
                <template #title>基础设置</template>
                <a-menu-item key="base">
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
          <div style="height: 50px" >
            <div style=" text-align: center;width: 100%">
              <a-button type="primary" style="margin-right: 20px" @click="save">保存</a-button>
              <a-dropdown>
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="restore" key="restoreAppSetting">还原到初始设置</a-menu-item>
                  </a-menu>
                </template>
                <a-button @click="reset">
                  重置 <DownOutlined />
                </a-button>
              </a-dropdown>
            </div>
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
import { SettingOutlined, LaptopOutlined, SmileOutlined,DownOutlined } from '@ant-design/icons-vue'
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
    SettingOutlined, LaptopOutlined, CodeTwoTone, vueCustomScrollbar, SmileOutlined,DownOutlined
  },
  computed: {
    ...mapState(appStore, ['app', 'debugMod', 'devApp'])
  },
  data () {
    return {
      activeNav:['base'],
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
    login(){
      tsbApi.user.login()
    },
    goALl(){
      this.devMod=false
      this.$router.push('/allApps')
    },
    ...mapActions(appStore, ['reloadAppSetting', 'saveAppSetting', 'setApp','restoreAppSetting']),
    goDevelop () {
      this.$router.push({ path: '/dev/' })
    },
    restore(){
      Modal.confirm({
        content:'是否还原应用的全部设置？这将丢失所有的设置内容，还原到首次安装时的设置状态。',
        onOk:()=>{
          this.restoreAppSetting()
          this.$router.replace({path:'/setting/'+this.app.nanoid})
          this.activeNav=['base']
          message.success('还原设置成功。')
        }
      })
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
          this.reloadAppSetting()
          this.$router.replace({path:'/setting/'+this.app.nanoid})
          this.activeNav=['base']
          message.success('已为您重置当前应用的信息。')

        }
      })
    },
    async save () {
      try {
        await this.saveAppSetting()
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
