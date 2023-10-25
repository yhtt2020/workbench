<template>
  <!-- 快速搜索 应用 主页 -->
  <div style="display: flex;height: 100%;color: var(--primary-text)">
    <SecondPanel :search="true" :menus="menus" logo="https://up.apps.vip/logo/favicon.svg" @change-tab="changeTab">
    </SecondPanel>
    <div v-show="currentIndex === 'my'" @dragover.prevent="dragOver" @drop.prevent="drop" class="app-content s-bg"
         style="margin: 1em;background: var(--primary-bg);">
      <div v-if="myApps.length === 0" style="font-size: 2em;padding-top: 6em;text-align: center;">
        <Icon style="font-size: 2em;vertical-align: middle;"
              icon="line-dragdroptuofang"></Icon>
        将应用拖放到此处，即可用于快捷启动
      </div>
      <div v-if="myApps.length === 0" style="text-align: center">
        <div @click="loadDeskIconApps" class="btn" style="font-size: 1.5em;width: 8em">导入桌面应用</div>
      </div>
      <div style="margin: 1em">
        <MyApps
          @addIcons="iconVisible = true"
          v-if="myApps.length > 0"
        ></MyApps>
        <Teleport to="body">
          <AddIcon
            v-if="iconVisible"
            @getSelectApps="getSelectApps"
            @close="iconHide"
            navName="Desktop"
            :navList="[
              { name: '桌面图标', component: 'Desktop' },
            ]"
          >
          </AddIcon>
        </Teleport>
      </div>
    </div>
    <div class="app-content s-bg" style="margin: 1em;background: var(--primary-bg);" v-if="currentIndex === 'qing'">
      <QingApps>
      </QingApps>
    </div>
    <div class="app-content s-bg" v-if="currentIndex === 'store'"
         style="margin:1em;padding: 1em;background: var(--primary-bg);"
    >
      <vue-custom-scrollbar :settings="settings" style="position:relative;height:100%;  border-radius: 8px;">
        <div style="margin: auto;width:100%;height: auto;margin-bottom:1em;text-align: center ">
          <div style="margin-bottom: 1em;font-size: 1.5em">
            <div @click="becomeDeveloper" class="pointer" style="float:left;font-size: 0.8em;">
              <notification-outlined/>
              入驻成为开发者
            </div>
            共 {{ storeApps.length }} 应用
            <div class="pointer" @click="openDir"
                 style="font-size: 0.8em;float: right">
              <FolderOpenOutlined/>
              下载目录
            </div>
          </div>
          <a-row :gutter="[30, 20]">
            <template v-for="app in   storeApps  ">
              <a-col :span="3">
                <div class="text-left" style="position:absolute;z-index: 9;">
                  <a-tag color="#ff5500cc" v-if="app.data.type === 'system'">系统</a-tag>
                  <a-tag color="#87d068cc" v-else-if="app.needInstall">软件</a-tag>
                  <a-tag color="black" v-else-if="app.data.type === 'game'">游戏</a-tag>
                  <a-tag color="#108ee9cc" v-else>网页</a-tag>
                </div>
                <a-avatar shape="square" :src="app.icon" style="margin-top: 10px" :size="60">
                </a-avatar>
              </a-col>
              <a-col :span="5">
                <div class="app-name  font-bold text-white" style="text-align: left;"
                     :style="{ color: 'var(--font-color)' }">
                  {{
                    app.name
                  }}

                </div>

                <div class="app-summary" :title="app.summary" style="text-align: left;">
                  {{ app.summary }}
                </div>
              </a-col>
              <a-col :span="4">
                <tempalate v-if="app.needInstall">
                  <div v-if="!checkInstalled(app)" @click="install(app)" class="btn">
                    <template v-if="app.downloading">
                      <svg style="vertical-align: text-bottom;" class="ml-1 animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                           xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                      </svg>
                      <span>{{ app.percent }} %</span>
                    </template>
                    <template v-else-if="app.installing">
                      <svg style="vertical-align: text-bottom;" class="ml-1 animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                           xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                      </svg>
                      安装中
                    </template>
                    <template v-else>
                      <span>下载安装</span>
                    </template>
                  </div>
                  <div v-else @click="executeLocalApp(app)" class="btn">
                    运行软件
                  </div>
                </tempalate>
                <template v-else>
                  <div @click="executeApp(app.data)" class="btn">
                    打开
                  </div>
                </template>
              </a-col>

            </template>
          </a-row>
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
import { message } from 'ant-design-vue'
import { runExec } from '../js/common/exec'
import Template from '../../user/pages/Template.vue'
import { NotificationOutlined, FolderOpenOutlined } from '@ant-design/icons-vue'
import browser from '../js/common/browser'
import AddIcon from '../page/app/addIcon/index.vue'
import Desktop from '../page/app/addIcon/modules/Desktop.vue'
import pathLib from 'path'

let { fs } = window.$models
export default {
  name: 'Apps',
  components: { AddIcon, Desktop, Template, MyApps, QingApps, SecondPanel, NotificationOutlined, FolderOpenOutlined },
  computed: {
    ...mapWritableState(appStore, ['appData']),
    ...mapWritableState(appsStore, ['myApps'])
  },
  data () {
    return {
      iconVisible: false,
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
        // {
        //   icon: 'https://s1.hdslb.com/bfs/static/jinkela/popular/assets/icon_popular.png',
        //   name: 'AI助手',
        //   summary: 'AI助手',
        //   needInstall: false,
        //   data: {
        //     fullScreen: false,
        //     theme: '#030c13',
        //     name: 'ai',
        //     type: 'system',
        //     route: JSON.stringify({
        //       name: 'ai',
        //     })
        //   }
        // },
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
        // {
        //   icon: 'http://a.apps.vip/icons/flappy.jpg',
        //   name: 'Mlappy Bird',
        //   summary: '和小伙伴们一起飞。',
        //   needInstall: false,
        //   data: {
        //     theme: '#030c13',
        //     name: 'mlappyBird',
        //     url: 'http://bird.apps.vip/?',
        //     background: false,
        //     type: 'game'
        //   }
        // },
        {
          icon: 'https://a.apps.vip/icons/weather.png',
          name: '浏览器',
          summary: '内置于工作台的浏览器，方便在工作台打开网页。',
          needInstall: false,
          data: {
            fullScreen: false,
            theme: '#030c13',
            name: 'browser',
            type: 'system',//网页助手
            route: JSON.stringify({
              name: 'browser',
            })
          }
        },
        {
          icon: 'https://a.apps.vip/icons/weather.png',
          name: '天气',
          summary: '可以自由添加城市。',
          needInstall: false,
          data: {
            fullScreen: false,
            theme: '#030c13',
            name: 'weather',
            type: 'system',//网页助手
            route: JSON.stringify({
              name: 'weather',
            })
          }
        },
        {
          icon: '/img/game.png',
          name: '游戏小助手',
          summary: '',
          needInstall: false,
          data: {
            fullScreen: false,
            theme: '#030c13',
            name: 'gameAssistant',
            type: 'system',//网页助手
            route: JSON.stringify({
              name: 'gameIndex',
            })
          }
        },
        {
          icon: 'https://a.apps.vip/icons/paper.png',
          name: '壁纸',
          summary: '锁屏壁纸，支持导入本地壁纸，以及多个图源，同时支持动态壁纸。',
          needInstall: false,
          data: {
            fullScreen: false,
            theme: '#030c13',
            name: 'gallery',
            type: 'system',//网页助手
            route: JSON.stringify({
              name: 'my',
            })
          }
        },
        {
          icon: 'https://a.apps.vip/icons/music.png',
          name: '音乐',
          summary: '网络音乐播放器。',
          needInstall: false,
          data: {
            fullScreen: false,
            theme: '#030c13',
            name: 'music',
            type: 'system',//网页助手
            route: JSON.stringify({
              name: 'music',
            })
          }
        },
        {
          icon: 'https://a.apps.vip/icons/tomato.png',
          name: '番茄钟',
          summary: '一个时间管理工具。',
          needInstall: false,
          data: {
            fullScreen: false,
            theme: '#030c13',
            name: 'tomato',
            type: 'system',//网页助手
            route: JSON.stringify({
              name: 'tomato',
            })
          }
        },
        // {
        //   icon: 'https://a.apps.vip/icons/tomato.png',
        //   name: '便签',
        //   summary: '便签工具',
        //   needInstall: false,
        //   data: {
        //     fullScreen: false,
        //     theme: '#030c13',
        //     name: 'note',
        //     type: 'system',//网页助手
        //     route: JSON.stringify({
        //       name: 'note',
        //     })
        //   }
        // },
        {
          icon: 'https://a.apps.vip/icons/ppet.png',
          name: 'PPet桌面宠物',
          summary: '一款开源桌面看板娘，让你不再孤单。',
          needInstall: true,
          installPath: 'C:\\Program Files\\PPet3\\PPet3.exe',
          downloadUrl: 'https://a.apps.vip/download/ppet3330.exe',
          data: {
            security: true
          }
        },
        {
          icon: 'https://a.apps.vip/icons/debugtron.svg',
          name: 'Debugtron',
          summary: '基于Electron的调试工具，用于发现问题。',
          needInstall: true,
          installPath: '%LOCALAPPDATA%\\debugtron\\Debugtron.exe',
          downloadUrl: 'https://a.apps.vip/download/debugtron.exe',
          data: {
            security: true
          }
        },
        {
          icon: 'https://a.apps.vip/download/aida64.jpg',
          name: 'AIDA64',
          summary: '一款商业级计算机硬件状态监控软件。',
          needInstall: true,
          silent: false,//静默安装
          installPath: 'C:\\Program Files (x86)\\FinalWire\\AIDA64 Extreme\\aida64.exe',
          downloadUrl: 'https://a.apps.vip/download/aida64extreme685.exe',
          data: {
            security: true
          }
        },
        {
          icon: 'https://a.apps.vip/download/rtss.png',
          name: 'RTSS',
          summary: '一款免费的游戏帧数监测软件。',
          needInstall: true,
          installPath: 'C:\\Program Files (x86)\\RivaTuner Statistics Server\\RTSS.exe',
          downloadUrl: 'https://a.apps.vip/download/rtss.exe',
          data: {
            security: true
          }
        },
        {
          icon: 'https://a.apps.vip/download/dsf.svg',
          name: 'DisplayFusion',
          summary: '解决游戏触摸最小化问题。一款用来提升副屏体验的商业软件。',
          needInstall: true,
          silent: false,//非静默安装
          installPath: 'C:\\Program Files\\DisplayFusion\\DisplayFusion.exe',
          downloadUrl: 'https://a.apps.vip/download/DisplayFusionSetup-10.0.exe',
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
            fullScreen: false,
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
        },
        // {
        //   icon: '/img/game.png',
        //   name: '剪切板（正在开发中）',
        //   summary: '',
        //   needInstall: false,
        //   data: {
        //     fullScreen: false,
        //     theme: '#030c13',
        //     name: 'clipboard',
        //     type: 'system',//网页助手
        //     route: JSON.stringify({
        //       name: 'clipboard',
        //     })
        //   }
        // },
        // {
        //   icon: 'http://a.apps.vip/icons/flappy.jpg',
        //   name: '快捷键 （开发中）',
        //   summary: '',
        //   needInstall: false,
        //   data: {
        //     fullScreen: false,
        //     theme: '#030c13',
        //     name: 'shortcutKey',
        //     type: 'system',//网页助手
        //     route: JSON.stringify({
        //       name: 'shortcutKey',
        //     })
        //   }
        // },
      ]
    }
  },
  methods: {
    ...mapActions(appsStore, ['addApps']),
    getSelectApps (data) {
      this.addApps(data['default'])
    },
    executeApp (appData) {
      this.$router.push({
        name: 'app',
        params: appData
      })
    },
    open (app) {
      require('electron').shell.openPath(app.path)
    },
    iconHide () {
      this.iconVisible = false
    },
    async loadDeskIconApps () {
      this.iconVisible = true
      // const desktopApps = await ipc.sendSync('getDeskApps')
      // this.desktopApps = desktopApps
      // this.addApps(this.desktopApps)
    },
    dragOver () {

    },
    changeTab (data) {
      this.currentIndex = data.index
    },
    checkInstalled (checkApp) {
      if (fs.existsSync(checkApp.installPath)) {
        return true
      }
    },
    executeLocalApp (app) {
      runExec('"' + app.installPath + '"')
    },
    /**
     * 安装，区分静默与否
     * @param app
     * @param path
     */
    setup (app, path, silent = true) {
      message.success({ content: '正在为您安装', key: 'install' })
      app.installing = true
      if (silent) {
        runExec('start /wait ' + path + ' /S', require('path').dirname(path)).then(rs => {
          message.success({ content: '安装成功，并为您运行此软件', key: 'install' })
          this.executeLocalApp(app)
          app.installed = true
        }, (rs) => {
          message.error({ content: '安装失败', key: 'install' })
        }).catch((err) => {
          message.error({ content: '安装错误', key: 'install' })
        }).finally(() => {
          app.installing = false
        })
      } else {
        runExec('start /wait ' + path, require('path').dirname(path)).then(rs => {
          message.success({ content: '安装成功，并为您运行此软件', key: 'install' })
          this.executeLocalApp(app)
          app.installed = true
        }, (rs) => {
          message.error({ content: '安装失败', key: 'install' })
        }).catch((err) => {
          message.error({ content: '安装错误', key: 'install' })
        }).finally(() => {
          app.installing = false
        })
      }

    },
    becomeDeveloper () {
      browser.openInUserSelect('https://www.yuque.com/tswork/mqon1y/hugtrbdiax9863ug')
    },
    openDir () {
      require('electron').shell.openPath(require('path').join(window.globalArgs['user-data-dir'], 'download'))
    },
    install (app) {
      if (app.downloading) {
        return
      }
      app.downloading = true
      let downloadDir = require('path').join(window.globalArgs['user-data-dir'], 'download')

      fs.ensureDirSync(downloadDir)
      let basePath = require('path').join(downloadDir, require('path').basename(new URL(app.downloadUrl).pathname))
      if (fs.existsSync(basePath)) {
        app.downloading = false
        this.setup(app, basePath)
        return
      }

      let downloadPath = basePath + '.' + Date.now()

      console.log(downloadPath)
      tsbApi.download.start({
        url: app.downloadUrl,
        savePath: downloadPath,
        updated: (args) => {
          app.done = 1
          app.percent = (args.downloadInfo.receivedBytes / args.downloadInfo.totalBytes * 100).toFixed(1)
          //https://www.electronjs.org/zh/docs/latest/api/download-item#%E4%BA%8B%E4%BB%B6%E5%90%8D-updated
        },
        done: (args) => {
          fs.renameSync(downloadPath, downloadPath.substring(0, downloadPath.lastIndexOf('.')))
          app.downloading = false
          app.percent = 100
          app.done = 1
          this.setup(app, basePath)
        },
        willDownload: (args) => {
        }
      })
    },
    async drop (e) {
      let files = e.dataTransfer.files

      let filesArr = []
      const pathLib = require('path')
      console.log(files)
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          let path = files[i].path
          let ext = pathLib.extname(path)
          let icon = ['.png', '.jpg', '.jpeg'].includes(ext) ? path : await tsbApi.system.extractFileIcon(files[i].path)
          filesArr.push({
            icon: icon,
            name: require('path').basename(files[i].path),
            path: path
          })
          console.log('path:', files[i])
        }
      }
      this.dropFiles = filesArr
      this.addApps(this.dropFiles)
    }
  }
}
</script>

<style scoped lang="scss">
.btn {
  background: var(--secondary-bg);

  &:hover {
    color: var(--primary-text);
    background: var(--active-secondary-bg);

  }
}

.app-content {
  flex-shrink: 1;
  flex-grow: 1;
  border-radius: 8px;
  margin-left: 1em;
  margin-right: 1em;
}

.app-summary {
  -webkit-line-clamp: 2; //这里就是最大显示三行
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
</style>
