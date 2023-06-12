const { ipcMain: ipc } = require('electron')
const { nanoid } = require('nanoid')

class TableTabManager {
  //运行中的tab
  runningTabs = []
  tableWin = null //方便调用
  runningTabsInstance = []

  setTableWin (tableWin) {
    this.tableWin = tableWin
  }

  /**
   * 获取一个tab的name，此name用于查找instance
   * @param id id，是一个自动生成的nanoid
   * @returns {string}
   */
  getName (id) {
    return 'table_tab_' + id
  }

  /**
   * 确认运行，未运行则异步启动，直接返回当前状态
   * @returns {boolean} 返回执行命令时刻的应用运行状态
   * @param args 参数，需要提交app参数
   */
  ensureTab (args) {
    let appInstance = this.get(this.getName(args.id))
    if (!appInstance) {
      this.addTab({ url: args.url, silent: true }).then()
      return false //告知未运行
    } else {
      return true
    }
  }

  /**
   * 打开标签页
   * @param args
   * @returns {Promise<*>}
   */
  async addTab (args) {
    //app args silent静默
    console.log('addtab参数',args)
    let { url, position, silent } = args
    let id = nanoid(4)
    let tab = {
      url: url,
      id: id,
      name: this.getName(id)
    }
    let tabInstance = await global.windowManager.createView({
      name: tab.name,
      webPreferences: {
        //preload: app.preload ? ___dirname + '/src/appPreload/' + app.preload + '.js' : appPreload, //默认使用tsApi
        sandbox: false,
        partition: 'persist:webcontent',
        nodeIntegration: false,
        webSecurity: true,
        contextIsolation: true,
        additionalArguments: [
          // '--app-type=table'//添加控制台参数
        ]
      },
      url: url
    })
    let view = tabInstance.view
    view.webContents.on('before-input-event', (event, input) => {
      if (input.key.toLowerCase() === 'f12') {
        view.webContents.openDevTools({
          mode: 'detach'
        })
        event.preventDefault()
      } else if (input.key.toLowerCase() === 'f11') {
        view.webContents.executeJavaScript(`
        function toggleFullScreen() {
  if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}
    toggleFullScreen()
        `)
        event.preventDefault()
      }
    })
    if (!silent) {//静默则不设置位置
      this.tableWin.setBrowserView(view)//置入app
      view.webContents.on('dom-ready', () => {
        this.setViewPos(tabInstance.view, position)
      })
    }
    this.runningTabs.push({
      url: url,
      id: id
    })
    this.runningTabsInstance.push(tabInstance)

    return {
      tabInstance, tab
    }
  }

  /**
   * 同步位置
   * @param id
   * @param position
   */
  setBounds (id, position) {
    console.log('setBounds id',id)
    let tabInstance=this.get(this.getName(id))
    if(tabInstance){
      this.setViewPos(tabInstance.view, position)
    }else{
      console.error('不存在的tableTab',id)
    }

  }

  /**
   * 设置网页缩放
   * @param name
   * @param scale
   */
  setScale (id, scale) {
    this.get(this.getName(id)).view.webContents.setZoomFactor(Number((Number(scale) / 100).toFixed(2)))
  }

  refresh (id) {
    this.get(this.getName(id)).view.webContents.reload()
  }

  setViewPos (view, position) {
    view.setBackgroundColor('#ccc')
    view.setBounds(position)
    view.setAutoResize({
      height: true,
      width: true,
    })
  }

  hideTab (id) {
    let instance = this.get(id)
    if (instance) {
      this.tableWin.removeBrowserView(instance.view)
    }
  }

  closeAllTab () {
    this.runningTabs.forEach(app => {
      this.closeTab(this.getName(app.name))
    })
    console.log(this.runningTabsInstance)
    console.log(this.runningTabs)
  }

  closeTab (id) {
    let instance = this.get(id)
    if (instance) {
      if (this.tableWin && !this.tableWin.isDestroyed()) {
        this.tableWin.removeBrowserView(instance.view)
      }
      instance.close()
      let index = this.getIndex(id)
      this.runningTabsInstance.splice(index, 1)
      this.runningTabs.splice(index, 1)
    }
  }

  showTab (id, position) {
    //实现还存在问题，需要去获取到最新的位置再重置
    let instance = this.get(id)
    if (instance) {
      this.tableWin.setBrowserView(instance.view)
      this.setViewPos(instance.view, position)
    }
  }

  get (name) {
    return this.runningTabsInstance.find(instance => {
      return instance.name === name
    })
  }

  getIndex (id) {
    return this.runningTabsInstance.findIndex(instance => {
      return instance.id === id
    })
  }

  send (id, channel, args) {
    let appInstance = this.get(this.getName(id))
    if (appInstance) {
      appInstance.view.webContents.send(channel, args)
    }
  }

  /**
   * 获取到全部运行中的应用
   * @returns {{instances: *[], apps: *[]}}
   */
  getRunningTabs () {
    return {
      tabs: this.runningTabs,
      instances: this.runningTabsInstance
    }
  }

  bindIPC () {
    ipc.on('getRunningTableTabs', (event, args) => {
      let data = this.getRunningTabs()
      event.reply('updateRunningTableTabs', { tabs: data.tabs })
    })

    ipc.on('syncTableTabBounds', (e, a) => {
      console.log(a,'接收到的console')
      this.setBounds(a.tab.id, a.bounds)
    })

    ipc.on('setTableTabScale', (e, a) => {
      this.setScale(a.tab.id, a.scale)
    })

    ipc.on('addTableTab', async (event, args) => {
      let tab = {}
      try {
       let  result = await this.addTab({ url: args.url, position: args.position })
        tab=result.tab
      } catch (e) {
        console.error(e, '创建出错')
        tab = {
          error: e
        }
      }

      console.log('回传tab',tab)
      event.returnValue = tab
    })

    ipc.on('ensureTableTab', async (event, args) => {
      try {
        event.returnValue = this.ensureTab({ tab: args.tab })
      } catch (e) {
        event.returnValue = false
      }
    })
    ipc.on('refreshTableTab', (e, a) => {
      this.refresh(a.tab.id)
    })

    ipc.on('closeTableTab', (event, args) => {
      this.closeTab(this.getName(args.tab.id))
    })
    ipc.on('hideTableTab', (event, args) => {
      this.hideTab(this.getName(args.tab.id))
    })
  }
}

module.exports = TableTabManager
