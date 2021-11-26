const EventEmitter = require('events')

const webviews = require('webviews.js')
const focusMode = require('focusMode.js')
const readerView = require('readerView.js')
const tabAudio = require('tabAudio.js')
const dragula = require('dragula')
const settings = require('util/settings/settings.js')
const urlParser = require('util/urlParser.js')

const tabEditor = require('navbar/tabEditor.js')
const progressBar = require('navbar/progressBar.js')
const permissionRequests = require('navbar/permissionRequests.js')

//添加tab上的右键菜单，支持右键选择关闭行为组
const remoteMenu = require('remoteMenuRenderer.js')

const ipc = electron.ipcRenderer

var lastTabDeletion = 0 // TODO get rid of this

const tabBar = {
  navBar: document.getElementById('navbar'),
  container: document.getElementById('tabs'),
  containerInner: document.getElementById('tabs-inner'),
  tabElementMap: {}, // tabId: tab element
  events: new EventEmitter(),
  dragulaInstance: dragula([document.getElementById('tabs-inner')], {
    direction: 'horizontal',
    slideFactorX: 25,
  }),
  getTab: function (tabId) {
    return tabBar.tabElementMap[tabId]
  },
  getTabInput: function (tabId) {
    return tabBar.getTab(tabId).querySelector('.tab-input')
  },
  setActiveTab: function (tabId) {
    var activeTab = document.querySelector('.tab-item.active')

    if (activeTab) {
      activeTab.classList.remove('active')
      activeTab.removeAttribute('aria-selected')
    }

    var el = tabBar.getTab(tabId)
    el.classList.add('active')
    el.setAttribute('aria-selected', 'true')

    requestAnimationFrame(function () {
      el.scrollIntoView()
    })
  },
  /*标签栏补充的右键菜单触发动作开始*/
  //关闭其他的标签
  closeOtherTabs: function (tabId) {
    require('browserUI.js').switchToTab(tabId)
    let needDestroy = []
    tasks.getSelected().tabs.forEach(function (tab, index) {
      if (tab.id != tabId) needDestroy.push(tab.id)
    })
    needDestroy.forEach(function (tid, index) {
      require('browserUI.js').destroyTab(tid)
    })
    //$store.getters.fillTasksToItems
  },
  //关闭左侧标签
  closeLeftTabs: function (tabId) {
    require('browserUI.js').switchToTab(tabId)
    let needDestroy = []
    let tabs = tasks.getSelected().tabs
    let count = tabs.count()
    console.log(count)
    for (i = 0; i < count; i++) {
      if (tabs.getAtIndex(i).id != tabId) needDestroy.push(tabs.getAtIndex(i).id)
      else {
        break
      }
    }
    needDestroy.forEach(function (tid, index) {
      require('browserUI.js').destroyTab(tid)
    })
    //$store.getters.fillTasksToItems
  },
  //关闭右侧标签
  closeRightTabs: function (tabId) {
    require('browserUI.js').switchToTab(tabId)
    let needDestroy = []
    let tabs = tasks.getSelected().tabs
    let count = tabs.count()
    console.log(count)
    for (i = count - 1; i >= 0; i--) {
      if (tabs.getAtIndex(i).id != tabId) needDestroy.push(tabs.getAtIndex(i).id)
      else {
        break
      }
    }
    needDestroy.forEach(function (tid, index) {
      require('browserUI.js').destroyTab(tid)
    })
    //$store.getters.fillTasksToItems
  },
  //移动到第一个标签
  moveToFirst: function (tabId) {
    let tabs = tasks.getSelected().tabs
    tab = tabs.get(tabId)
    index = tabs.getIndex(tabId)
    tabs.splice(index, 1)
    tabs.splice(0, 0, tab)
    tabBar.updateAll()
    require('browserUI.js').switchToTab(tabId)
  },
  //刷新
  refresh: function (id) {
    webviews.update(id, tasks.getSelected().tabs.get(id).url)
  },

  //添加到本地导航(我的应用)
  addToMyapps: function (tabId) {
    let tabs = tasks.getSelected().tabs
    let tab = tabs.get(tabId)
    const appNow = {
      icon: tab.favicon == null ? '../../icons/default.svg' : tab.favicon.url,
      name: tab.title,
      url: tab.url,
      summary:"",
      listId:0,
      star: "5"
    }
    const appsRestore = require('../../pages/apps/appsRestore.js')
    appsRestore.addApp(appNow)
    ipc.send('message', { type: 'success', config: { content: '添加到本地导航成功，可在我的导航和新标签页中查看。' } })
  },

  //移动tab到新的分组且完成切换
  moveTabTask: function (tabId) {
    //拿到当前tab标签页
    let tabs = tasks.getSelected().tabs
    let tab = tabs.get(tabId)
    ipc.send('addTask', {
      name: tab.title,
      url: tab.url,
      icon: tab.favicon == null ? '../../icons/empty.png' : tab.favicon.url,
    })
    setTimeout(() => {
      let taskNew = tasks.getAll()[tasks.getAll().length - 1]
      require('browserUI.js').destroyTab(tabId)
      require('browserUI.js').switchToTask(taskNew.id)
      ipc.send('message', { type: 'success', config: { content: '移动到分组成功，已为您切换到新的分组。' } })
    }, 300)
  },

  //复制tab链接
  shareTab: function (tabId) {
    let tabs = tasks.getSelected().tabs
    let tab = tabs.get(tabId)
    if(tab.url.startsWith('file:///')) {
      ipc.send('message',{type:'error',config:{content:'链接复制失败'}})
    } else {
      Tools.copy(tab.url)
    }
  },

  //复制tasks整组链接生成分享页
  shareTask: function () {
    let tabs = tasks.getSelected().tabs
    let filterList =  tabs.tabs.filter(e => !e.url.startsWith('file:///'))    //过滤掉file层面的tab
    let args = []
    for(let i = 0; i < filterList.length; i++) {
      const obj = {
        url: filterList[i].url,
        favicon: filterList[i].favicon === null ? '/shareTask/default.svg' : filterList[i].favicon.url,
        title: filterList[i].title
      }
      args.push(obj)
    }
    ipc.send('shareTask', args)
  },

  /*标签栏补充的右键菜单触发动作结束*/
  createTab: function (data) {
    var tabEl = document.createElement('div')
    tabEl.className = 'tab-item'
    tabEl.setAttribute('data-tab', data.id)
    tabEl.setAttribute('role', 'tab')

    tabEl.appendChild(readerView.getButton(data.id))
    tabEl.appendChild(tabAudio.getButton(data.id))
    tabEl.appendChild(progressBar.create())

    // icons

    var iconArea = document.createElement('span')
    iconArea.className = 'tab-icon-area'

    if (data.private) {
      var pbIcon = document.createElement('i')
      pbIcon.className = 'icon-tab-is-private tab-icon tab-info-icon i carbon:view-off'
      iconArea.appendChild(pbIcon)
    }

    var secIcon = document.createElement('i')
    secIcon.className = 'icon-tab-not-secure tab-icon tab-info-icon i carbon:unlocked'
    secIcon.title = l('connectionNotSecure')
    iconArea.appendChild(secIcon)

    var closeTabButton = document.createElement('button')
    closeTabButton.className = 'tab-icon tab-close-button i carbon:close'

    closeTabButton.addEventListener('click', function (e) {
      tabBar.events.emit('tab-closed', data.id)
      // prevent the searchbar from being opened
      e.stopPropagation()
    })

    iconArea.appendChild(closeTabButton)

    tabEl.appendChild(iconArea)

    // title

    var title = document.createElement('span')
    title.className = 'title'

    tabEl.appendChild(title)

    // click to enter edit mode or switch to a tab
    tabEl.addEventListener('click', function (e) {
      if (tabs.getSelected() !== data.id) {
        // else switch to tab if it isn't focused
        tabBar.events.emit('tab-selected', data.id)
      } else {
        // the tab is focused, edit tab instead
        tabEditor.show(data.id)
      }
    })

    tabEl.addEventListener('auxclick', function (e) {
      if (e.which === 2) {
        // if mouse middle click -> close tab
        tabBar.events.emit('tab-closed', data.id)
      }
    })

    tabEl.addEventListener('wheel', function (e) {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
        // https://github.com/minbrowser/min/issues/698
        return
      }
      if (e.deltaY > 65 && e.deltaX < 10 && Date.now() - lastTabDeletion > 900) {
        // swipe up to delete tabs
        lastTabDeletion = Date.now()

        /* tab deletion is disabled in focus mode */
        if (focusMode.enabled()) {
          focusMode.warn()
          return
        }

        this.style.transform = 'translateY(-100%)'

        setTimeout(function () {
          tabBar.events.emit('tab-closed', data.id)
        }, 150) // wait until the animation has completed
      }
    })

    tabEl.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      e.stopPropagation()

      let template = [
        [
          {
            id: 'open',
            label: '创建一个新组',
            click: function () {
              require('browserUI.js').addTask()
              //$store.getters.fillTasksToItems
            },
          },
          {
            id: 'open',
            label: '打开新标签',
            click: function () {
              //console.log('关闭全部标签被点击')
              require('browserUI.js').addTab()
            },
          },
          {
            label: '移动到最左边',
            toolTip: '作为组代表,当前任务组会更新为此标签的网站图标',
            click: function () {
              //console.log('关闭全部标签被点击')
              tabBar.moveToFirst(data.id)
            },
          },
          {
            label: '关闭标签',
            click: function () {
              //console.log('关闭全部标签被点击')
              //$store.getters.fillTasksToItems
              require('browserUI.js').closeTab(data.id)
            },
          },
        ],
        [
          {
            label: '关闭整组',
            click: function () {
              require('browserUI.js').closeTask(tasks.getSelected().id)
            },
          },
          {
            label: '关闭其他标签',
            click: function () {
              tabBar.closeOtherTabs(data.id)
            },
          },
          {
            label: '关闭左侧标签',
            click: function () {
              tabBar.closeLeftTabs(data.id)
            },
          },
          {
            label: '关闭右侧标签',
            click: function () {
              tabBar.closeRightTabs(data.id)
            },
          },
        ],
        [
          {
            label: '添加到本地导航',
            click: function () {
              tabBar.addToMyapps(data.id)
            },
          },
          {
            label: '移入新建分组中',
            click: function () {
              tabBar.moveTabTask(data.id)
            },
          },
        ],
        [
          {
            label: '分享标签',
            submenu: [
              {
                label: '复制链接',
                click: function () {
                  tabBar.shareTab(data.id)
                },
              },
            ],
          },
          {
            label: '分享整组',
            submenu: [
              {
                label: '复制链接',
                click: function() {
                  tabBar.shareTask()
                }
              },
            ],
          },
        ],
      ]

      remoteMenu.open(template)
      //绑定代码结束
    })

    tabBar.updateTab(data.id, tabEl)

    return tabEl
  },

  updateTab: function (tabId, tabEl = tabBar.getTab(tabId)) {
    var tabData = tabs.get(tabId)

    // update tab title
    var tabTitle

    const isNewTab = tabData.url === '' || tabData.url === urlParser.parse('min://newtab')
    if (isNewTab) {
      tabTitle = l('newTabLabel')
    } else if (tabData.title) {
      tabTitle = tabData.title
    } else if (tabData.loaded) {
      tabTitle = tabData.url
    }

    tabTitle = (tabTitle || l('newTabLabel')).substring(0, 500)

    var titleEl = tabEl.querySelector('.title')

    //给tab加上favicon的显示，以提升每个页面的辨识度
    var iconEl = this.createIconEl(tabData, tabData.loaded)
    //titleEl.textContent = tabTitle  原先的方法只是添加了文字
    titleEl.innerHTML = ''
    titleEl.appendChild(iconEl)
    titleEl.append(tabTitle)

    tabEl.title = tabTitle
    if (tabData.private) {
      tabEl.title += ' (' + l('privateTab') + ')'
    }

    // update tab audio icon
    var audioButton = tabEl.querySelector('.tab-audio-button')
    tabAudio.updateButton(tabId, audioButton)

    tabEl.querySelectorAll('.permission-request-icon').forEach((el) => el.remove())

    permissionRequests
      .getButtons(tabId)
      .reverse()
      .forEach(function (button) {
        tabEl.insertBefore(button, tabEl.children[0])
      })

    var secIcon = tabEl.getElementsByClassName('icon-tab-not-secure')[0]
    if (tabData.secure === false) {
      secIcon.hidden = false
    } else {
      secIcon.hidden = true
    }
  },
  updateAll: function () {
    empty(tabBar.containerInner)
    tabBar.tabElementMap = {}

    tabs.get().forEach(function (tab) {
      var el = tabBar.createTab(tab)
      tabBar.containerInner.appendChild(el)
      tabBar.tabElementMap[tab.id] = el
    })

    if (tabs.getSelected()) {
      tabBar.setActiveTab(tabs.getSelected())
    }
  },
  addTab: function (tabId) {
    var tab = tabs.get(tabId)
    var index = tabs.getIndex(tabId)

    var tabEl = tabBar.createTab(tab)
    tabBar.containerInner.insertBefore(tabEl, tabBar.containerInner.childNodes[index])

    tabBar.tabElementMap[tabId] = tabEl
  },
  removeTab: function (tabId) {
    var tabEl = tabBar.getTab(tabId)
    if (tabEl) {
      // The tab does not have a corresponding .tab-item element.
      // This happens when destroying tabs from other task where this .tab-item is not present
      tabBar.containerInner.removeChild(tabEl)
      delete tabBar.tabElementMap[tabId]
    }
  },
  handleDividerPreference: function (dividerPreference) {
    if (dividerPreference === true) {
      tabBar.navBar.classList.add('show-dividers')
    } else {
      tabBar.navBar.classList.remove('show-dividers')
    }
  },

  //扩充一个获取icon的方法
  createIconEl: function (tabData, loaded) {
    var iconEl = document.createElement('img')
    iconEl.className = 'icon'
    var src = ''
    if (loaded == false) {
      src = __dirname + '/icons/loading.gif'
    } else {
      if (tabData.favicon == null) {
        src = __dirname + '/icons/default18.png'
      } else {
        src = tabData.favicon.url
      }
    }

    iconEl.src = src
    return iconEl
  },
}

settings.listen('showDividerBetweenTabs', function (dividerPreference) {
  tabBar.handleDividerPreference(dividerPreference)
})

/* tab loading and progress bar status*/
webviews.bindEvent('did-start-loading', function (tabId) {
  progressBar.update(tabBar.getTab(tabId).querySelector('.progress-bar'), 'start')
  tabs.update(tabId, {
    loaded: false,
  })
})

webviews.bindEvent('did-stop-loading', function (tabId) {
  progressBar.update(tabBar.getTab(tabId).querySelector('.progress-bar'), 'finish')
  tabs.update(tabId, {
    loaded: true,
  })
  tabBar.updateTab(tabId)
})

tasks.on('tab-updated', function (id, key) {
  var updateKeys = ['title', 'secure', 'url', 'muted', 'hasAudio', 'favicon'] //增加了一下更新的字段，否则favcion变化是不会生效的
  if (updateKeys.includes(key)) {
    tabBar.updateTab(id)
  }
})

permissionRequests.onChange(function (tabId) {
  tabBar.updateTab(tabId)
})

if (window.platformType === 'mac') {
  tabBar.dragulaInstance.containers = []
} else {
  tabBar.dragulaInstance.on('drop', function (el, target, source, sibling) {
    var tabId = el.getAttribute('data-tab')
    if (sibling) {
      var adjacentTabId = sibling.getAttribute('data-tab')
    }

    var oldTab = tabs.splice(tabs.getIndex(tabId), 1)[0]

    var newIdx
    if (adjacentTabId) {
      newIdx = tabs.getIndex(adjacentTabId)
    } else {
      // tab was inserted at end
      newIdx = tabs.count()
    }

    tabs.splice(newIdx, 0, oldTab)
  })
}

tabBar.container.addEventListener('dragover', (e) => e.preventDefault())

tabBar.container.addEventListener('drop', (e) => {
  e.preventDefault()
  var data = e.dataTransfer
  require('browserUI.js').addTab(
    tabs.add({
      url: data.files[0] ? 'file://' + data.files[0].path : data.getData('text'),
      private: tabs.get(tabs.getSelected()).private,
    }),
    {
      enterEditMode: false,
      openInBackground: !settings.get('openTabsInForeground'),
    }
  )
})
ipc.on('refresh', () => {
  webviews.update(tabs.getSelected(), tasks.getSelected().tabs.get(tabs.getSelected()).url)
})

module.exports = tabBar
