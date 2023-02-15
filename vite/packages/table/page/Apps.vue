<template>
  <SecondPanel :menus="menus" logo="https://up.apps.vip/logo/favicon.svg" @change-tab="changeTab"></SecondPanel>
  <div v-show="currentIndex==='my'" @dragover.prevent="dragOver" @drop.prevent="drop" class="app-content">
    <div v-if="apps.length===0" style="font-size: 2em;padding-top: 6em;text-align: center;">
      <Icon style="color: #ccc;font-size: 2em;vertical-align: middle" icon="#icon-line-dragdroptuofang"></Icon>
      将应用拖放到此处，即可用于快捷启动
    </div>
    <div v-if="apps.length===0" style="text-align: center">
      <div @click="loadDeskIconApps" class="btn" style="font-size: 1.5em;width: 8em">导入桌面应用</div>
    </div>
    <div style="padding: 1em">
      <div @click="open(app)" class="app" v-for="app in apps">
        <a-avatar :size="50" shape="square" :src="app.icon"></a-avatar>
        <br>
        <div class="name">
          {{ app.name }}
        </div>
      </div>
    </div>
  </div>
  <div class="app-content" v-if="currentIndex==='qing'">
    轻应用
  </div>
  <div class="app-content" v-if="currentIndex==='store'" style="padding:2em">
    <div v-for="app in storeApps"
         style="display: inline-block;width:560px;height: 130px;padding: 20px;margin-right:10px;margin-bottom:10px;background: #262626;border-radius: 10px">
      <a-row :gutter="20">
        <a-col :span="4">
          <a-avatar shape="square" :src="app.icon" style="margin-top: 10px" :size="80">
          </a-avatar>
        </a-col>
        <a-col :span="14">
          <div class="app-name">{{ app.name }}</div>
          <div class="app-summary">
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
</template>

<script>
import { mapWritableState, mapActions } from 'pinia'
import { appStore } from '../store'
import SecondPanel from '../components/SecondPanel.vue'

let fs = require('fs')
export default {
  name: 'Apps',
  components: { SecondPanel },
  computed: {
    ...mapWritableState(appStore, ['apps'])
  },
  data () {
    return {
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
        }
      ]
    }
  },
  methods: {
    executeApp (appData) {
      this.$router.push({
        name: 'app',
        params: appData
      })
    },
    open (app) {
      require('electron').shell.openPath(app.path)
    },
    ...mapActions(appStore, ['addApps']),
    async loadDeskIconApps () {
      const desktopApps = await ipc.sendSync('getDeskApps')
      this.desktopApps = desktopApps
      this.addApps(this.desktopApps)
    },
    dragOver () {

    },
    changeTab (data) {
      console.log(data, 'data')
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
  height: calc(100vh - 2em);
  margin-left: 11em;
  border-radius: 8px;
}

.app {
  display: inline-block;
  width: 5em;
  text-align: center;
  vertical-align: text-top;
  padding: 0.5em;
  margin: 0.5em;
  cursor: pointer;

  &:hover {
    background: #969696;
    border-radius: 4px;

  }

  .name {
    font-size: 0.8em;
    word-break: break-all;
  }
}

.app-name {
  font-size: 1.3em;
  font-weight: bold;
  padding-top: 0.2em;
  padding-bottom: 0.2em;

}

.btn {
  width: 6em;
  text-align: center;
  background: #575757;
  font-size: 1.2em;
}

.app-summary {
  font-size: 1.1em;
}
</style>
