<script lang="ts">
import tools from '../../../src/util/tools.js'
let {appModel,placesModel}=window.$models
let ipc=require('electron').ipcRenderer
import {mapActions, mapWritableState, mapState, mapGetters} from "pinia";
import {appStore} from "../store";
export default {
  components: {
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
      contentLoading: false,
      searchWord: '',
      tags: [
        {
          label: '全部',
          checked: true
        },
        {
          label: '应用',
          checked: false
        },
        // {
        //   label: '应用市场',
        //   checked: false
        // },
        {
          label: '网页',
          checked: false
        },
        {
          label: '标签组',
          checked: false
        }
      ],
      searchResult: [],
      itemReadyedIndex: 0,
      itemReadyedItem: {},
      openFirst: true,
      apps: [],
      visible: false,
      recentOpenedHistory: [],
      recentReadyedItem: {},
      recentReadyedIndex: 0
    }
  },
  computed:{
    ...mapState(appStore,['getAllTasks']),
    compSearchResult() {
      let findResult = this.tags.find(v => v.checked === true)
      if(findResult.label === '全部') {
        this.itemReadyedIndex = 0
        this.itemReadyedItem = this.searchResult[0]
        this.calculateAreaHeight(this.searchResult)
        return this.searchResult
      } else if (findResult.label === '网页') {
        let filterRes = this.searchResult.filter(v => v.tag === 'tab')
        this.itemReadyedIndex = 0
        this.itemReadyedItem = filterRes[0]
        this.calculateAreaHeight(filterRes)
        return filterRes
      } else if (findResult.label === '标签组') {
        let filterRes = this.searchResult.filter(v => v.tag === 'task')
        this.itemReadyedIndex = 0
        this.itemReadyedItem = filterRes[0]
        this.calculateAreaHeight(filterRes)
        return filterRes
      } else if (findResult.label === '应用') {
        let filterRes = this.searchResult.filter(v => v.tag === 'app')
        this.itemReadyedIndex = 0
        this.itemReadyedItem = filterRes[0]
        this.calculateAreaHeight(filterRes)
        return filterRes
      } else if (findResult.label === '应用市场') {
        let filterRes = this.searchResult.filter(v => v.tag === 'appstore')
        this.itemReadyedIndex = 0
        this.itemReadyedItem = filterRes[0]
        this.calculateAreaHeight(filterRes)
        return filterRes
      }
    }
  },
  async mounted() {
    await this.getAllApps()
    this.bindKeys()

    this.calculateAreaHeight(await this.getHistoryCount())
    this.recentOpenedHistory = await this.handleRecentOpenedHistory()
    this.recentReadyedItem = this.recentOpenedHistory[0]
  },
  methods: {
    calculateAreaHeight(res) {
      //计算搜索结果区域的高度，传给main变换窗体高度
      let num
      if(this.openFirst) {
        num = res
        if(num >= 6) {
          ipc.send('changeBrowserWindowHeight', 520)
        } else if(num === 5) {
          ipc.send('changeBrowserWindowHeight', 480)
        } else if(num === 4) {
          ipc.send('changeBrowserWindowHeight', 430)
        } else if(num === 3) {
          ipc.send('changeBrowserWindowHeight', 380)
        } else if(num === 2) {
          ipc.send('changeBrowserWindowHeight', 330)
        } else {
          ipc.send('changeBrowserWindowHeight', 280)
        }
      } else {
        num = res.length
        if(num >= 6) {
          ipc.send('changeBrowserWindowHeight', 400)
        } else if(num === 5) {
          ipc.send('changeBrowserWindowHeight', 350)
        } else if(num === 4) {
          ipc.send('changeBrowserWindowHeight', 300)
        } else if(num === 3) {
          ipc.send('changeBrowserWindowHeight', 250)
        } else if(num === 2) {
          ipc.send('changeBrowserWindowHeight', 200)
        } else {
          ipc.send('changeBrowserWindowHeight', 150)
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
    executeApp(app){
      ipc.send('executeApp',{app:app})

      //statsh 全局搜索打开的应用数量
      statsh.do({
        action: 'increase',
        key: 'globalSearchBaseOpenApp',
        value: 1
      })
      ipc.send('closeGlobalSearch')
    },
    clickRecentHistory(item) {
      ipc.send('addTab',{url: item.url});
      ipc.send('closeGlobalSearch')
    },
    openAppstore(){
      ipc.send('executeAppByPackage',{package:'com.thisky.appStore'})
    },
    click(item) {
      if(item.tag === 'tab') {
        ipc.send('switchToTab', {
          taskId: item.taskId,
          tabId: item.tabId
        })

        //statsh 全局搜索打开的网页数量
        statsh.do({
          action: 'increase',
          key: 'globalSearchBaseOpenWeb',
          value: 1
        })
        ipc.send('closeGlobalSearch')
      } else if(item.tag === 'task') {
        ipc.send('switchToTask', {
          id: item.taskId,
        })

        //statsh 全局搜索打开的标签组数量
        statsh.do({
          action: 'increase',
          key: 'globalSearchBaseOpenTask',
          value: 1
        })
        ipc.send('closeGlobalSearch')
      } else if(item.tag === 'app') {
        this.executeApp(item.app)
        ipc.send('closeGlobalSearch')
      }
    },
    calculateHeight() {
      let currentHeight = 0
      if(this.openFirst) {
        if(this.recentReadyedIndex > 5) {
          currentHeight = (this.recentReadyedIndex - 5) * 50
        }
      } else {
        if(this.itemReadyedIndex > 5) {
          currentHeight = (this.itemReadyedIndex - 5) * 50
        }
      }
      return currentHeight
    },
    bindKeys() {
      window.onkeyup = async (e) => {
        if(e.keyCode === 13) {
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
          if(this.openFirst) {
            //如果是在初始页
            if(this.recentReadyedIndex + 1 < this.recentOpenedHistory.length) {
              this.recentReadyedIndex = this.recentReadyedIndex + 1
              this.recentReadyedItem = this.recentOpenedHistory[this.recentReadyedIndex]
              document.getElementsByClassName('recent-list-hook')[0].scrollTop = this.calculateHeight()
            } else {
              this.recentReadyedIndex = 0
              this.recentReadyedItem = this.recentOpenedHistory[0]
              document.getElementsByClassName('recent-list-hook')[0].scrollTop = this.calculateHeight()
            }
          } else {
            if(this.itemReadyedIndex + 1 < this.compSearchResult.length) {
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
          if(this.openFirst) {
            //如果是在初始页
            if(this.recentReadyedIndex + 1 <= this.recentOpenedHistory.length && this.recentReadyedIndex !== 0) {
              this.recentReadyedIndex = this.recentReadyedIndex - 1
              this.recentReadyedItem = this.recentOpenedHistory[this.recentReadyedIndex]
              document.getElementsByClassName('recent-list-hook')[0].scrollTop = this.calculateHeight()
            } else {
              this.recentReadyedIndex = 0
              this.recentReadyedItem = this.recentOpenedHistory[0]
              document.getElementsByClassName('recent-list-hook')[0].scrollTop = this.calculateHeight()
            }
          } else {
            if(this.itemReadyedIndex + 1 <= this.compSearchResult.length && this.itemReadyedIndex !== 0) {
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
          if(this.openFirst) {
            setTimeout(()=> {
              document.getElementById("myTextField").focus();
            }, 500)
          } else {
            let index = this.tags.findIndex(v => v.checked == true)
            if(index < 3) {
              this.handleChange(this.tags, index + 1)
            } else {
              this.handleChange(this.tags, 0)
            }
            setTimeout(()=> {
              document.getElementById("myTextField").focus();
            }, 500)
          }
        } else if(e.keyCode === 13 && (Object.keys(this.itemReadyedItem).length > 0 || Object.keys(this.recentReadyedItem).length > 0)) {
          //回车按键
          if(this.openFirst) {
            this.clikRecentHistory(this.recentReadyedItem)
          } else {
            this.clkli(this.itemReadyedItem)
          }
        } else if(e.keyCode === 27) {
          //退出键
          this.searchWord.length > 0 ? this.searchWord = '' : ipc.send('closeGlobalSearch')
        }
      }
    },
    handleInput(e) {
      this.searchWord = e.target.value
      this.contentLoading = true
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
      this.apps = await appModel.getAllApps({order:'last_execute_time',limit:6})
    },
    async searchApp(word) {
      let apps = await appModel.find(word,{order:'last_execute_time'})
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
    <div class="gs-dialog" :class="{'first-gs-dialog': openFirst}">
      <div class="search flex justify-start align-center">
        <a-icon
          class="search-lf"
          type="search"
          :style="{ fontSize: '26px' }"
        ></a-icon>
        <input
          placeholder="搜索应用、网页、标签组"
          spellcheck="false"
          id="myTextField"
          onfocus="this.select()"
          tabindex="-1"
          type="text"
          class="search-rg"
          :value="searchWord"
          @input="handleInput($event)"
          style="font-size: 20px"
        />
        <div>
          <a-avatar :size="35" @click="openAppstore" class="app-hover"
                    src="../appStore/favicon.svg"
                    alt=""
                    shape="circle"
          ></a-avatar>
        </div>
      </div>
      <div
        class="apps flex flex-direction justify-between align-start"
        v-if="openFirst"
      >
        <span class="text-grey">推荐</span>
        <div class="apps-content flex">
          <ul class="flex">
              <li v-for="(app, index) in apps"
                :key="index"
                class="flex flex-direction justify-around align-center"
                @click="executeApp(app)"
              >
                <img
                  onerror="this.src='../../icons/default.svg'"
                  :src="app.logo"
                  alt=""
                  :style="{'border-color':app.userThemeColor?app.userThemeColor:app.themeColor}"
                  shape="circle"
                />
                <span
                  class="text-black sg-omit-sm flex justify-center align-center"
                >{{app.name}}</span
                >
              </li>
          </ul>
        </div>
      </div>
      <div class="category flex justify-between align-center" v-else>
        <div class="category-lf">

            <a-tag v-for="(tag, index) in tags"
              :key="index"
              :color="tag.checked ? 'blue' : ''"
              @click="handleChange(tag, index)"
              style="font-size: 15px; border-radius: 10px"
            >
              {{tag.label}}
            </a-tag>
        </div>
        <div class="category-rg flex justify-around align-center">
          <a-icon type="smile"></a-icon>
          <div
            class="flex align-center justify-center"
            style="padding-left: 5px"
          >
            按下Tab键切换类型
          </div>
        </div>
      </div>

      <div
        class="recent-open flex flex-direction justify-between"
        v-if="openFirst"
      >
        <span class="text-grey">最近打开</span>
        <div class="recent-open-content flex flex-direction recent-list-hook">
          <ul>
              <li v-for="(item, index) in recentOpenedHistory"
                :key="index"
                class="flex justify-start align-center"
                :class="{'li-ready': recentReadyedIndex === index}"
                @click="clickRecentHistory(item)"
              >
                <img
                  src="../../icons/default.svg"
                  style="width: 30px; height: 30px"
                />
                <div
                  class="flex flex-direction justify-around align-start"
                  style="padding-left: 20px; height: 100%"
                >
                  <div class="text-black-lg sg-omit-sm">{{item.title}}</div>
                  <div class="text-grey-sm sg-omit-sm">{{item.url}}</div>
                </div>
              </li>
          </ul>
        </div>
      </div>
      <div class="content flex justify-center list-hook" v-else>
          <div v-if="contentLoading" key="loading">
            <a-spin>
              <a-icon
                slot="indicator"
                type="loading"
                style="font-size: 40px"
                spin
              ></a-icon>
            </a-spin>
          </div>
        <ul v-else>

            <li v-for="(item, index) in compSearchResult"
              class="flex justify-start align-center"
              :class="{'li-ready': itemReadyedIndex === index}"
              :key="index"
              @click="click(item)"
            >
              <img
                onerror="this.src='../../icons/default.svg'"
                :src="item.icon"
                style="width: 30px; height: 30px"
              />
              <div
                class="flex flex-direction justify-around align-start"
                style="padding-left: 20px; height: 100%"
              >
                <div class="text-black-lg sg-omit-sm" v-html="item.title.replaceAll(searchWord,`<strong style='color:orangered'>${searchWord}</strong>`)"></div>
                <div class="text-grey-sm sg-omit-sm" v-html="item.attached.replaceAll(searchWord,`<strong style='color:orangered'>${searchWord}</strong>`)"></div>
              </div>
            </li>
          <div
            v-show="compSearchResult.length === 0 && !openFirst"
            class="text-grey flex justify-center align-center"
            style="width: 100%; height: 50px"
          >
            未找到任何结果
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>
<style>
html, body {
  overflow: hidden !important;
}
</style>
<style scoped lang="scss">

</style>
