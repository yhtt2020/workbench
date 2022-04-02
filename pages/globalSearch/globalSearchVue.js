const store = require('./store.js')

const globalSearch = new Vue({
  el: "#globalSearch",
  store: store,
  // props: {
  //   visible: {
  //     type: Boolean,
  //   },
  //   currentTaskId: {
  //     type: String
  //   }
  // },
  watch: {
    searchWord: {
      handler: tools.debounce(async function (newValue, oldValue) {
        console.log(newValue)
        this.searchResult = []

        if(newValue.length > 0) {
          this.openFirst = false
          let appresult = await this.searchApp(newValue)
          console.log(appresult, '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
          this.searchResult = this.searchResult.concat(this.searchTab(newValue), this.searchTask(newValue), appresult)
          this.itemReadyedIndex = 0
          this.itemReadyedItem = this.searchResult[0]
          console.log(this.searchResult)
        } else {
          this.openFirst = true
        }
        this.contentLoading = false

      }, 200),
      deep: true
    },
    // visible: {
    //   handler: function(newValue, oldValue) {
    //     if(newValue === true) {
    //       this.$nextTick(() => {
    //         document.getElementById("myTextField").focus();
    //       })
    //     }
    //   }
    // }
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
      recentOpenedTabs: [],
      //visible: false
    };
  },
  computed: {
    compSearchResult() {
      let findResult = this.tags.find(v => v.checked === true)
      if(findResult.label === '全部') {
        this.itemReadyedIndex = 0
        this.itemReadyedItem = this.searchResult[0]
        return this.searchResult
      } else if (findResult.label === '网页') {
        let filterRes = this.searchResult.filter(v => v.tag === 'tab')
        this.itemReadyedIndex = 0
        this.itemReadyedItem = filterRes[0]
        return filterRes
      } else if (findResult.label === '标签组') {
        let filterRes = this.searchResult.filter(v => v.tag === 'task')
        this.itemReadyedIndex = 0
        this.itemReadyedItem = filterRes[0]
        return filterRes
      } else if (findResult.label === '应用') {
        let filterRes = this.searchResult.filter(v => v.tag === 'app')
        this.itemReadyedIndex = 0
        this.itemReadyedItem = filterRes[0]
        return filterRes
      }
    },
    compRecentOpenedTabs() {
      //console.log(tools.bubbleSort(this.recentOpenedTabs, 'lastActivity').reverse(), '!!!!!!!!!!!')
      return tools.bubbleSort(this.recentOpenedTabs, 'lastActivity').reverse()
    }
  },
  methods: {
    handleRecentOpenedTabs() {
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
            lastActivity: k.lastActivity,
            attached: `${v.name}·` + tools.execDomain(k.url)
          })
        })
      })
      return mapTabs
    },
    executeApp(app){
      ipc.send('executeApp',{app:app})
    },
    clikRecentTab(item) {
      this.$parent.openPopoverTab(item.taskId, item.tabId)
      this.clkmask()
    },
    clkli(item) {
      if(item.tag === 'tab') {
        this.$parent.openPopoverTab(item.taskId, item.tabId)
        this.clkmask()
      } else if(item.tag === 'task') {
        this.$parent.openItem(item.taskId)
        this.clkmask()
      } else if(item.tag === 'app') {
        this.executeApp(item.app)
        this.clkmask()
      }
    },
    calculateHeight() {
      // let viewHeight = document.getElementsByClassName('list-hook')[0].offsetHeight
      // let scrollHeight = document.getElementsByClassName('list-hook')[0].scrollHeight
      let currentHeight = 0
      if(this.itemReadyedIndex > 5) {
        currentHeight = (this.itemReadyedIndex - 5) * 50
      }
      return currentHeight
    },
    bindKeys() {
      window.onkeydown = (e) => {
        if (e.keyCode === 40) {
          // 向下键切换li
          if(this.openFirst) {
            //如果是在初始页

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
          //向上键切换li
          if(this.openFirst) {
            //如果是在初始页

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
        } else if(e.keyCode === 13 && Object.keys(this.itemReadyedItem).length > 0) {
          //回车按键
          if(this.openFirst) {

          } else {
            this.clkli(this.itemReadyedItem)
          }
        }
      }
    },
    handleInput(e) {
      this.searchWord = e.target.value
      this.contentLoading = true
    },
    clkmask() {
      this.$emit("closeGlobalSearch");
    },
    handleChange(tag, index) {
      this.tags.forEach(e => {
        e.checked = false
      })
      this.tags[index].checked = !tag.checked
    },
    async getAllApps() {
      this.apps = await saAppModel.getAllApps()
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
      return mapTabs.filter(v => v.title.includes(word) || v.url.includes(word) )
    }
  },
  async mounted () {
    await this.getAllApps()
    this.bindKeys()
    setTimeout(() => {
      this.recentOpenedTabs = this.handleRecentOpenedTabs()
      console.log(this.recentOpenedTabs, 'recentOpenedTabs')
    }, 2000)
  },
});

window.$globalSearch = globalSearch
