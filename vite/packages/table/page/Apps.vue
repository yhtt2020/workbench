<template>
  <div style="display: flex;height: 100%">
    <SecondPanel :search="true" :menus="menus" logo="https://up.apps.vip/logo/favicon.svg"
                 @change-tab="changeTab"></SecondPanel>
    <div v-show="currentIndex==='my'" @dragover.prevent="dragOver" @drop.prevent="drop" class="app-content">
      <div v-if="myApps.length===0" style="font-size: 2em;padding-top: 6em;text-align: center;">
        <Icon style="color: #ccc;font-size: 2em;vertical-align: middle" icon="line-dragdroptuofang"></Icon>
        将应用拖放到此处，即可用于快捷启动
      </div>
      <div v-if="myApps.length===0" style="text-align: center">
        <div @click="loadDeskIconApps" class="btn" style="font-size: 1.5em;width: 8em">导入桌面应用</div>
      </div>
      <div style="padding: 1em">
        <MyApps></MyApps>
      </div>
    </div>
    <div class="app-content" v-if="currentIndex==='qing'">
      <QingApps></QingApps>
    </div>
    <div class="app-content" v-if="currentIndex==='store'" style="padding:2em;">
      <vue-custom-scrollbar :settings="settings"
                            style="position:relative;height:100%;  border-radius: 8px;">
        <div style="margin: auto;width: 95%;height: auto;text-align: center">
          <div style="margin-bottom: 1em;font-size: 1.5em">
            共 {{ storeApps.length }} 应用
          </div>
          <div v-for="app in storeApps"
               style="display: inline-block;width:660px;height: 130px;padding: 20px;margin-right:10px;margin-bottom:10px;background: #313131;border-radius: 10px;">
            <a-row :gutter="20">
              <a-col :span="5">
                <a-avatar shape="square" :src="app.icon" style="margin-top: 10px" :size="80">
                </a-avatar>
              </a-col>
              <a-col :span="13">
                <div class="app-name" style="text-align: left">{{ app.name }}</div>
                <div class="app-summary" style="text-align: left">
                  {{ app.summary }}
                </div>
              </a-col>
              <a-col :span="6">
                <div v-if="app.needInstall" class="btn">
                  安装
                </div>
                <div @click="executeApp(app.data)" v-else class="btn">
                  打开
                </div>
              </a-col>
            </a-row>
          </div>
        </div>
      </vue-custom-scrollbar>
    </div>
  </div>


</template>

<script>
import { mapWritableState, mapActions } from 'pinia'
import { appStore } from '../store'
import SecondPanel from '../components/SecondPanel.vue'
import QingApps from '../components/QingApps.vue'
import MyApps from '../components/MyApps.vue'
import { appsStore } from '../store/apps'

let fs = require('fs')
export default {
  name: 'Apps',
  components: { MyApps, QingApps, SecondPanel },
  computed: {
    ...mapWritableState(appStore, ['appData']),
    ...mapWritableState(appsStore, ['myApps'])
  },
  data () {
    return {
      settings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      currentIndex: 'my',
      menus: [{
        title: '我的应用',
        index: 'my',
        icon: ''
      }, {
        title: '轻应用',
        index: 'qing'
      },
        {
          title: '应用市场',
          icon: '',
          index: 'store'
        }
      ],
      desktopApps: [],
      dropFiles: [],
      storeApps: [
        {
          icon: 'https://s1.hdslb.com/bfs/static/jinkela/popular/assets/icon_popular.png',
          name: '网页数据监控小助手',
          summary: '一个用于检测网页数据的工具，可以实时监测一个网页数据动态，并组织成可视化的报表，目前支持B站视频数据追踪。',
          needInstall: false,
          data: {
            fullScreen: false,
            theme: '#030c13',
            name: 'watch',
            type: 'system',//网页助手
            route: JSON.stringify({
              name: 'watch',
            })
          }
        },
        {
          icon: 'https://a.apps.vip/icons/ppet.png',
          name: 'PPet桌面宠物',
          summary: '一款开源桌面看板娘，让你不再孤单。',
          needInstall: true,
          data: {
            security: true
          }
        },
        {
          icon: 'https://a.apps.vip/wallpaper/favicon.png',
          name: 'OneWallheaven壁纸',
          summary: '开源壁纸轻应用，可以将wallheaven上的壁纸设置为桌面壁纸或者工作台壁纸。',
          needInstall: false,
          data: {
            theme: '#030c13',
            name: 'wallpapaer',
            url: 'https://a.apps.vip/wallpaper',
            preload: 'wallpaper',
            background: true,
            node: true,
            security: false
          }
        }, {
          icon: 'https://a.apps.vip/icons/kook.png',
          name: 'Kook',
          summary: '在副屏上使用Kook，一个好用的开黑组团语音沟通工具',
          needInstall: false,
          data: {
            theme: 'rgb(23,24,26)',
            name: 'kook',
            url: 'https://www.kookapp.cn/app/discover',
            background: true,
            node: false,
            security: true,
            fullScreen:false,
          }
        },
        {
          icon: 'https://res.wx.qq.com/a/wx_fed/assets/res/OTE0YTAw.png',
          name: '微信',
          summary: '在副屏上使用网页版微信聊天。（已适配小屏）',
          needInstall: false,
          data: {
            theme: '#2e3238',
            name: 'weixin',
            url: 'https://wx.qq.com',
            preload: 'weixin',
            background: true,
            node: false,
            security: true
          }
        },
        {
          icon: 'https://p1-hera.byteimg.com/tos-cn-i-jbbdkfciu3/22718e94fbd9483ea54301cf431ce2ee~tplv-jbbdkfciu3-image:0:0.image',
          name: '飞书',
          summary: '在副屏上使用飞书办公。（可用）',
          needInstall: false,
          data: {
            theme: '#465069',
            name: 'feishu',
            url: ' https://feishu.cn/messenger/',
            preload: 'app',
            background: true,
            node: false,
            security: true
          }
        },
        {
          icon: 'https://a.apps.vip/todo/logo.png',
          name: '轻待办',
          summary: '快速创建和管理你的待办。',
          needInstall: false,
          data: {
            fullScreen: false,
            theme: 'transparent',
            name: 'todo',
            url: 'https://a.apps.vip/todo',
            preload: 'app',
            background: true,
            node: true,
            security: true
          }
        }
      ]
    }
  },
  methods: {
    ...mapActions(appsStore, ['addApps']),
    executeApp (appData) {
      this.$router.push({
        name: 'app',
        params: appData
      })
    },
    open (app) {
      require('electron').shell.openPath(app.path)
    },

    async loadDeskIconApps () {
      const desktopApps = await ipc.sendSync('getDeskApps')
      this.desktopApps = desktopApps
      this.addApps(this.desktopApps)
    },
    dragOver () {

    },
    changeTab (data) {
      this.currentIndex = data.index
    },
    async drop (e) {
      let files = e.dataTransfer.files

      let filesArr = []
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          filesArr.push(files[i].path)
          console.log('path:', files[i])
        }
      }
      this.dropFiles = await ipc.sendSync('getFilesIcon', { files: JSON.parse(JSON.stringify(filesArr)) })
      this.addApps(this.dropFiles)
    }
  }
}
</script>

<style scoped lang="scss">
.app-content {
  background: #3b3b3b;
  height: 100%;
  flex-shrink: 1;
  flex-grow: 1;
  border-radius: 8px;
  margin-left: 1em;
  margin-right: 1em;
}

</style>
