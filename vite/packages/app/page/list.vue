<template>
  <div style="padding: 20px; -webkit-app-region: none;">
    <div style="margin-bottom: 30px">
      <a-input-search ref="searchBar" v-model:value="searchWords" placeholder="输入应用名称（支持拼音、简拼）、起始页网址"
                      style="width: 100%" @search="onSearch"></a-input-search>
    </div>
    <div>
      <div v-if="this.searchWords===''">
        <h1>最近使用</h1>
        <a-row>
          <a-col :span="4" v-for="app in appsRecently">
            <AppItem :app="app"></AppItem>
          </a-col>
        </a-row>
      </div>
      <div v-if="this.searchWords===''" style="position: relative;">
        <h1>全部应用 </h1>
        <div style="position:absolute;right: 0;top: 0">
          <a @click="manage">管理</a> &nbsp;
          <a type="primary" @click="addNew">添加</a>
        </div>
        <a-row>
          <a-col :span="4" v-for="app in apps">
            <div style="margin-bottom: 15px;text-align: center">
              <AppItem :app="app"></AppItem>
            </div>

          </a-col>
        </a-row>
      </div>
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

import AppItem from '../components/AppItem.vue'

export default {
  name: 'list',
  components: {
    AppItem
  },
  data () {
    return {
      apps: [],
      appsRecently: [],
      searchResult: [],
      searchWords: ''
    }
  },
  watch: {
    async searchWords () {
      if (this.searchWords !== '')
        this.searchResult = await appModel.find(this.searchWords, { order: 'last_execute_time' })
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
      appModel.getAllApps({ order: 'last_execute_time', limit: 6 }).then((data) => {
        this.appsRecently = data
      })

    },

  }
}
ipc.on('refresh', () => {
  window.$refesh()
})
</script>

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

.wrapper-scroller::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: white;
  margin-top: 10px;
  margin-bottom: 10px;
}

.wrapper-scroller::-webkit-scrollbar {
  width: 6px;
  background-color: white;
}

.wrapper-scroller::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.15);
}

</style>
