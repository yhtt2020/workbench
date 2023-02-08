<script lang="ts">
import tools from '../../../src/util/tools.js'
import {Modal} from 'ant-design-vue'
let {appModel, placesModel,statsh} = window.$models
window.ipc = require('electron').ipcRenderer
import {mapActions, mapWritableState, mapState, mapGetters} from "pinia";
import {SearchOutlined, SmileOutlined,CloseOutlined,BulbOutlined} from '@ant-design/icons-vue'
import {appStore} from "../store";

import SearchInput from "../components/SearchInput.vue";
export default {
  components: {
    SearchInput,
    SearchOutlined, SmileOutlined,CloseOutlined,BulbOutlined
  },
  watch: {
    searchWord: {
      handler: tools.debounce(async function (newValue, oldValue) {
        this.searchResult = []
        if (newValue.length > 0) {
          this.openFirst = false
          let appResult = await this.searchApp(newValue)
          this.searchResult = this.searchResult.concat(appResult, this.searchTab(newValue), this.searchTask(newValue))
          this.itemReadyedIndex = 0
          this.itemReadyedItem = this.searchResult[0]
        } else if (newValue.length === 0) {
          this.openFirst = true
          this.calculateAreaHeight(await this.getHistoryCount())
          this.recentOpenedHistory = await this.handleRecentOpenedHistory()
          this.recentReadyedIndex = 0
          this.recentReadyedItem = this.recentOpenedHistory[0]
          this.itemReadyedIndex = 0
          this.itemReadyedItem = {}
        }
        this.contentLoading = false
      }, 500),
      deep: true
    },
    visible: {
      handler: function (newValue, oldValue) {
        if (newValue === true) {
          this.$nextTick(() => {
            document.getElementById("myTextField").focus();
          })
        }
      }
    }
  },
  data() {
    return {

      indicator: '<a-icon type="loading" style="font-size: 24px" spin />',

      openFirst: true,

      visible: false,
      recentOpenedHistory: [],
      recentReadyedItem: {},
      recentReadyedIndex: 0
    }
  },
  computed: {
    ...mapState(appStore, ['getAllTasks','searchWord']),
    ...mapWritableState(appStore,['contentLoading','searchResult','apps']),

  },
  async mounted() {
    await this.getAllApps()
    this.bindKeys()

    window.changeHeight=this.changeHeight
    this.calculateAreaHeight(await this.getHistoryCount())
    this.recentOpenedHistory = await this.handleRecentOpenedHistory()
    this.recentReadyedItem = this.recentOpenedHistory[0]

  },
  methods: {


    /**
     * 修改窗体自身高度
     * @param height
     */
    changeHeight(height: number) {
      ipc.send('changeBrowserWindowHeight', height)
    },
    /**
     * 关闭全局搜索窗
     */
    close() {
      ipc.send('closeGlobalSearch')
    },

    calculateAreaHeight(res) {
      //计算搜索结果区域的高度，传给main变换窗体高度
      let num
      if (this.openFirst) {
        num = res
        if (num >= 6) {
          this.changeHeight(520)
        } else if (num === 5) {
          this.changeHeight(480)
        } else if (num === 4) {
          this.changeHeight(430)
        } else if (num === 3) {
          this.changeHeight(380)
        } else if (num === 2) {
          this.changeHeight(330)
        } else {
          this.changeHeight(280)
        }
      } else {
        num = res.length
        if (num >= 6) {
          this.changeHeight(400)
        } else if (num === 5) {
          this.changeHeight(350)
        } else if (num === 4) {
          this.changeHeight(300)
        } else if (num === 3) {
          this.changeHeight(250)
        } else if (num === 2) {
          this.changeHeight(200)
        } else {
          this.changeHeight(150)
        }
      }
    },
    async handleRecentOpenedHistory() {
      let mapHistory = []
      let history = await placesModel.getAllHistory()
      history.forEach(v => {
        mapHistory.push({
          title: v.title,
          icon: null,
          taskId: null,
          tabId: null,
          url: v.url,
          searchIndex: v.searchIndex,
          lastVisit: v.lastVisit,
          tag: 'history'
        })
      })
      return mapHistory
    },

    clickRecentHistory(item) {
      ipc.send('addTab', {url: item.url});
      this.close()
    },

    calculateHeight() {
      let currentHeight = 0
      if (this.openFirst) {
        if (this.recentReadyedIndex > 5) {
          currentHeight = (this.recentReadyedIndex - 5) * 50
        }
      } else {
        if (this.itemReadyedIndex > 5) {
          currentHeight = (this.itemReadyedIndex - 5) * 50
        }
      }
      return currentHeight
    },
    bindKeys() {
      window.onkeyup = async (e) => {
        if (e.keyCode === 13) {
          let appresult = await this.searchApp(e.target.value)
          this.searchResult = this.searchResult.concat(appresult, this.searchTab(e.target.value), this.searchTask(e.target.value))
          this.itemReadyedIndex = 0
          this.itemReadyedItem = this.searchResult[0]
          this.contentLoading = false
        }
      }
      window.onkeydown = (e) => {
        if (e.keyCode === 40) {
          e.preventDefault()
          // 向下键切换li
          if (this.openFirst) {
            //如果是在初始页
            if (this.recentReadyedIndex + 1 < this.recentOpenedHistory.length) {
              this.recentReadyedIndex = this.recentReadyedIndex + 1
              this.recentReadyedItem = this.recentOpenedHistory[this.recentReadyedIndex]
              document.getElementsByClassName('recent-list-hook')[0].scrollTop = this.calculateHeight()
            } else {
              this.recentReadyedIndex = 0
              this.recentReadyedItem = this.recentOpenedHistory[0]
              document.getElementsByClassName('recent-list-hook')[0].scrollTop = this.calculateHeight()
            }
          } else {
            if (this.itemReadyedIndex + 1 < this.compSearchResult.length) {
              this.itemReadyedIndex = this.itemReadyedIndex + 1
              this.itemReadyedItem = this.compSearchResult[this.itemReadyedIndex]
              document.getElementsByClassName('list-hook')[0].scrollTop = this.calculateHeight()
            } else {
              this.itemReadyedIndex = 0
              this.itemReadyedItem = this.compSearchResult[0]
              document.getElementsByClassName('list-hook')[0].scrollTop = this.calculateHeight()
            }
          }
        } else if (e.keyCode === 38) {
          e.preventDefault()
          //向上键切换li
          if (this.openFirst) {
            //如果是在初始页
            if (this.recentReadyedIndex + 1 <= this.recentOpenedHistory.length && this.recentReadyedIndex !== 0) {
              this.recentReadyedIndex = this.recentReadyedIndex - 1
              this.recentReadyedItem = this.recentOpenedHistory[this.recentReadyedIndex]
              document.getElementsByClassName('recent-list-hook')[0].scrollTop = this.calculateHeight()
            } else {
              this.recentReadyedIndex = 0
              this.recentReadyedItem = this.recentOpenedHistory[0]
              document.getElementsByClassName('recent-list-hook')[0].scrollTop = this.calculateHeight()
            }
          } else {
            if (this.itemReadyedIndex + 1 <= this.compSearchResult.length && this.itemReadyedIndex !== 0) {
              this.itemReadyedIndex = this.itemReadyedIndex - 1
              this.itemReadyedItem = this.compSearchResult[this.itemReadyedIndex]
              document.getElementsByClassName('list-hook')[0].scrollTop = this.calculateHeight()
            } else {
              this.itemReadyedIndex = 0
              this.itemReadyedItem = this.compSearchResult[0]
              document.getElementsByClassName('list-hook')[0].scrollTop = this.calculateHeight()
            }
          }
        } else if (e.keyCode === 9) {
          //按下tab键切换类型
          if (this.openFirst) {
            setTimeout(() => {
              document.getElementById("myTextField").focus();
            }, 500)
          } else {
            let index = this.tags.findIndex(v => v.checked == true)
            if (index < 3) {
              this.handleChange(this.tags, index + 1)
            } else {
              this.handleChange(this.tags, 0)
            }
            setTimeout(() => {
              document.getElementById("myTextField").focus();
            }, 500)
          }
        } else if (e.keyCode === 13 && (Object.keys(this.itemReadyedItem).length > 0 || Object.keys(this.recentReadyedItem).length > 0)) {
          //回车按键
          if (this.openFirst) {
            this.clikRecentHistory(this.recentReadyedItem)
          } else {
            this.clkli(this.itemReadyedItem)
          }
        } else if (e.keyCode === 27) {
          //退出键
          this.searchWord.length > 0 ? this.searchWord = '' : ipc.send('closeGlobalSearch')
        }
      }
    },
    handleChange(tag, index) {
      this.tags.forEach(e => {
        e.checked = false
      })
      this.tags[index].checked = !tag.checked
    },
    async getHistoryCount() {
      return await placesModel.getHistoryCount()
    },
    async getAllApps() {
      this.apps = await appModel.getAllApps({order: 'last_execute_time', limit: 6})
    },
    async searchApp(word) {
      let apps = await appModel.find(word, {order: 'last_execute_time'})
      return apps.map(v => {
        return {
          title: v.name,
          icon: v.logo,
          tabId: null,
          url: null,
          tag: 'app',
          attached: '应用',
          app: v
        }
      })
    },
    searchTask(word) {
      let mapTasks = this.getAllTasks.map(v => {
        return {
          title: v.name,
          icon: v.icon,
          taskId: v.id,
          tabId: null,
          url: v.hasOwnProperty('url') ? v.url : null,
          tag: 'task',
          attached: `标签组·${v.tabs.length}个标签`,
          app: null
        }
      })
      return mapTasks.filter(v => v.title.includes(word))
    },
    searchTab(word) {
      let mapTabs = []
      this.getAllTasks.forEach(v => {
        v.tabs.forEach(k => {
          mapTabs.push({
            title: k.title,
            icon: k.icon,
            taskId: v.id,
            tabId: k.id,
            url: k.hasOwnProperty('url') ? k.url : null,
            tag: 'tab',
            attached: `${v.name}·` + tools.execDomain(k.url),
            app: null
          })
        })
      })
      return mapTabs.filter(v => v.title.toLowerCase().includes(word) || tools.execDomain(v.url).toLowerCase().includes(word) || tools.pinyinMatch(v.title, word))
    }
  }
}
</script>

<template>
  <div id="globalSearch" class="gs-wrap">
    <div :class="{'first-gs-dialog': openFirst}" class="gs-dialog">
      <SearchInput></SearchInput>

      <router-view>

      </router-view>

    </div>
  </div>
</template>
<style>
html, body {
  overflow: hidden !important;
}
</style>
<style lang="scss" scoped>

</style>
