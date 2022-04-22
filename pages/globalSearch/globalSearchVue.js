const store = require('./store.js')
const placesModel = require('../util/model/placesModel')

const globalSearch = new Vue({
  el: "#globalSearch",
  store: store,
  watch: {
    searchWord: {
      handler: tools.debounce(async function (newValue, oldValue) {
        this.searchResult = []

        if(newValue.length > 0) {
          this.openFirst = false
          let appresult = await this.searchApp(newValue)
          this.searchResult = this.searchResult.concat(appresult, this.searchTab(newValue), this.searchTask(newValue))
          this.itemReadyedIndex = 0
          this.itemReadyedItem = this.searchResult[0]
          console.log(this.searchResult)
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
      }, 200),
      deep: true
    },
    visible: {
      handler: function(newValue, oldValue) {
        if(newValue === true) {
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
    };
  },
  computed: {
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
      }
    }
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
      ipc.send('closeGlobalSearch')
    },
    clikRecentHistory(item) {
      ipc.send('addTab',{url: item.url});
      ipc.send('closeGlobalSearch')
    },
    clkli(item) {
      if(item.tag === 'tab') {
        ipc.send('switchToTab', {
          taskId: item.taskId,
          tabId: item.tabId
        })
        ipc.send('closeGlobalSearch')
      } else if(item.tag === 'task') {
        ipc.send('switchToTask', {
          id: item.taskId,
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
      this.apps = await saAppModel.getAllApps({order:'lastExecuteTime',limit:6})
    },
    async searchApp(word) {
      let apps = await saAppModel.find(word,{order:'lastExecuteTime'})
      return apps.map(v => {
        return {
          title: v.name,
          icon: v.logo,
          tabId: null,
          tabId: null,
          url: null,
          tag: 'app',
          attached: '应用',
          app: v
        }
      })
    },
    searchTask(word) {
      let mapTasks = this.$store.getters.getAllTasks.map(v => {
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
      this.$store.getters.getAllTasks.forEach(v => {
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
  },
  async mounted () {
    await this.getAllApps()
    this.bindKeys()

    // console.log(await this.getHistoryCount(), '%%%%%%%%%%%')

    this.calculateAreaHeight(await this.getHistoryCount())
    this.recentOpenedHistory = await this.handleRecentOpenedHistory()
    this.recentReadyedItem = this.recentOpenedHistory[0]
  },
});

window.$globalSearch = globalSearch
