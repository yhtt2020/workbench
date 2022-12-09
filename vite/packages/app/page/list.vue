<template>
  <div style=" -webkit-app-region: none;">
    <div style="padding: 10px;">
      <a-input-search ref="searchBar" v-model:value="searchWords" placeholder="输入应用名称（支持拼音、简拼）、起始页网址"
                      style="width: 100%" @search="onSearch"></a-input-search>
    </div>

    <div class="app-list" style="padding: 10px;padding-top: 0" >
      <template v-if="this.searchWords===''" style="position: relative;">
        <a-tabs v-model:value="tabIndex" type="card">
          <a-tab-pane key="recent" tab="最近使用">
            <vue-custom-scrollbar :settings="settings" style="position:relative;height:calc(100vh - 120px);margin-right:-15px;margin-left:-10px;padding-left:10px;padding-top: 5px;padding-right: 15px">
              <a-row  >
                <div style="width: 20%"  v-for="app in appsRecently">
                  <div style="margin-bottom: 15px;text-align: center">
                    <AppItem  @favUpdated="refresh" :app="app"></AppItem>
                  </div>
                </div>
              </a-row>
            </vue-custom-scrollbar>
          </a-tab-pane>
          <a-tab-pane key="fav" tab="收藏">
            <a-empty description="暂无收藏，您可在应用上「右键」-「添加为收藏」" v-if="this.appsFav.length===0" style="margin-top: 100px"></a-empty>
            <vue-custom-scrollbar :settings="settings" style="position:relative;height:calc(100vh - 120px);margin-right:-15px;margin-left:-10px;padding-left:10px;padding-top: 5px;padding-right: 15px">
              <a-row  >
                <div style="width: 20%"  v-for="app in appsFav">
                  <div style="margin-bottom: 15px;text-align: center">
                    <AppItem  @favUpdated="refresh" :app="app"></AppItem>
                  </div>
                </div>
              </a-row>
            </vue-custom-scrollbar>
          </a-tab-pane>
          <a-tab-pane key="all" tab="全部" >
            <div style="position:relative;margin-bottom: 15px">
              <a-select
                v-model:value="type"
                size="small"
                style="width: 80px;"
                :options="options"
              ></a-select>
              <div style="position:absolute;right: 0;top: 0">
                <a @click="manage">管理</a> &nbsp;
                <a type="primary" @click="addNew">添加</a>
              </div>
            </div>

            <vue-custom-scrollbar :settings="settings" style="position:relative;height:calc(100vh - 160px);margin-right:-15px;margin-left:-10px;padding-left:10px;padding-top: 5px;padding-right: 15px">
              <a-row  >
                <div style="width: 20%"  v-for="app in filteredApps">
                  <div style="margin-bottom: 15px;text-align: center">
                    <AppItem @favUpdated="refresh" :app="app"></AppItem>
                  </div>
                </div>
              </a-row>
            </vue-custom-scrollbar>
          </a-tab-pane>
        </a-tabs>
      </template>
      <div v-if="this.searchWords!==''">
        <h1>搜索结果 - <span>{{ searchWords }}</span></h1>
        <a-empty v-if="this.searchResult.length===0" description="暂无相关应用"></a-empty>
        <a-row>
          <a-col :span="4" v-for="app in searchResult">
            <AppItem :app="app"></AppItem>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
const tools = window.$models.util.tools
const ipc = require('electron').ipcRenderer
const appModel = window.$models.appModel
tools.getWindowArgs(window)
import vueCustomScrollbar from '../../../src/components/vue-scrollbar.vue'
import AppItem from '../components/AppItem.vue'

export default {
  name: 'list',
  components: {
    AppItem, vueCustomScrollbar
  },
  data () {
    return {
      type: 'all',
      apps: [],
      tabIndex: 'all',
      appsRecently: [],
      searchResult: [],
      appsFav:[],//我的收藏
      options: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: 'system',
          label: '系统'
        },
        {
          value: 'third',
          label: '第三方'
        },
        {
          value: 'debug',
          label: '调试'
        }

      ],
      searchWords: '',
      settings: {
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: false
      },
    }
  },
  watch: {
    async searchWords () {
      if (this.searchWords !== '')
        this.searchResult = await appModel.find(this.searchWords, { order: 'last_execute_time' })
    }
  },
  computed: {
    filteredApps () {
      if (this.type === 'all') {
        return this.apps
      } else if (this.type === 'system') {
        return this.apps.filter(app => {
          return app.isSystemApp
        })
      } else if (this.type === 'third') {
        return this.apps.filter(app => {
          return !app.isSystemApp
        })
      } else if (this.type === 'debug') {
        return this.apps.filter(app => {
          return app.is_debug
        })
      }
    }
  },
  async mounted () {
    window.$refesh = this.refresh
    await appModel.initDb()
    this.refresh()
  },
  methods: {
    async addNew () {
      ipc.send('executeApp', { app: await appModel.get({ package: 'com.thisky.appStore' }) })
    },
    async manage () {
      ipc.send('openAppManage')
    },
    onSearch (value) {
      this.searchWords = value
    },
    refresh () {
      appModel.getAllApps({ order: 'create_time' }).then((data) => {
        this.apps = data
      })
      this.refreshFav()
      appModel.getAllApps({ order: 'last_execute_time' }).then((data) => {
        this.appsRecently = data
      })

    },
    refreshFav(){
      appModel.getAllApps({ where:{is_fav:true} }).then((data) => {
        this.appsFav = data
      })
    }
  }
}
ipc.on('refresh', () => {
  window.$refesh()
})
</script>
<style>
.app-list p {
  margin: 0;
}
.app-list > .ant-tabs-card .ant-tabs-content {
  height: calc(100vh - 100px);
  margin-top: -16px;
}
.app-list > .ant-tabs-card .ant-tabs-content > .ant-tabs-tabpane {
  padding: 16px;
  background: #fff;
}
.app-list > .ant-tabs-card > .ant-tabs-nav::before {
  display: none;
}
.app-list > .ant-tabs-card .ant-tabs-tab,
[data-theme='compact'] .app-list > .ant-tabs-card .ant-tabs-tab {
  background: transparent;
  border-color: transparent;
}
.app-list > .ant-tabs-card .ant-tabs-tab-active,
[data-theme='compact'] .app-list > .ant-tabs-card .ant-tabs-tab-active {
  background: #fff;
  border-color: #fff;
}
#components-tabs-demo-card-top .code-box-demo {
  padding: 24px;
  overflow: hidden;
  background: #f5f5f5;
}
[data-theme='compact'] .app-list > .ant-tabs-card .ant-tabs-content {
  height: 300px;
  margin-top: -8px;
}
[data-theme='dark'] .app-list > .ant-tabs-card .ant-tabs-tab {
  background: transparent;
  border-color: transparent;
}
[data-theme='dark'] #components-tabs-demo-card-top .code-box-demo {
  background: #000;
}
[data-theme='dark'] .app-list > .ant-tabs-card .ant-tabs-content > .ant-tabs-tabpane {
  background: #141414;
}
[data-theme='dark'] .app-list > .ant-tabs-card .ant-tabs-tab-active {
  background: #141414;
  border-color: #141414;
}
</style>
<style scoped>
h1 {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 20px;
  margin-top: 10px;
}

body {
  user-select: none;
}
</style>
