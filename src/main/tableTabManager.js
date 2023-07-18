const { ipcMain: ipc } = require('electron')
const { nanoid } = require('nanoid')
const { capture } = require('./captureHelper')

class TableTabManager {
  //运行中的tab
  runningTabs = []
  tableWin = null //方便调用
  runningTabsInstance = []
  lastPosition={}

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

  sendToBrowser(channel,args){
    if(this.tableWin){
      this.tableWin.webContents.send(channel,args)
    }
  }
  /**
   * 打开标签页
   * @param args
   * @returns {Promise<*>}
   */
  async addTab (args) {
    //app args silent静默
    let { url, position, silent } = args
    if(!position){
      position=this.lastPosition
    }
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

    view.webContents.on('page-title-updated', (event, title) => {
      tab.title=title
      this.sendToBrowser('updateTabTitle', { id: id, title: title })
    })
    view.webContents.on('page-favicon-updated', (event, favicons) => {
      tab.favicons=favicons
      this.sendToBrowser('updateTabFavicon', { id: id, favicons: favicons })
    })

    view.webContents.setWindowOpenHandler( async (details) => {
      const { url } = details
      let result = await this.addTab({
        url: url
      })
      let tab = result.tab
      this.sendToBrowser('addedTableTab', {
        tab: tab
      })
      return false
    })
    // view.webContents.on('-add-new-contents',  async (e, webContents, disposition, _userGesture, _left, _top, _width, _height, url, frameName, referrer, rawFeatures, postData) => {
    //   e.preventDefault()
    //
    // })
    if (!silent) {//静默则不设置位置
      this.tableWin.setBrowserView(view)//置入app
      view.webContents.on('dom-ready', () => {
        this.setViewPos(tabInstance.view, position)
        this.lastPosition=position
        setTimeout(()=>{
          capture(view.webContents,undefined,'tab_'+id).then((image) => {
            this.sendToBrowser('updateTabCapture', { id: tab.id, image: image })
          })
        },1000)
      })
    }
    this.runningTabs.push(tab)
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
    let tabInstance = this.get(this.getName(id))
    if (tabInstance) {
      this.setViewPos(tabInstance.view, position)
      this.lastPosition={}
    } else {
      console.error('不存在的tableTab', id)
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

  goBackTab(id){
    let instance = this.get(id)
    instance.view.webContents.goBack()
  }
  goForwardTab(id){
    let instance = this.get(id)
    instance.view.webContents.goForward()
  }
  closeAllTab () {
    this.runningTabs.forEach(app => {
      this.closeTab(this.getName(app.name))
    })
    console.log(this.runningTabsInstance)
    console.log(this.runningTabs)
  }

  closeTab (id) {
    //先移除，以避免移除过程中数据被移除的情况
    let instance = this.get(id)
    let index = this.getIndex(id)
    this.runningTabsInstance.splice(index, 1)
    this.runningTabs.splice(index, 1)
    if (instance) {
      if (this.tableWin && !this.tableWin.isDestroyed()) {
        this.tableWin.removeBrowserView(instance.view)
      }
      instance.close()
    }
  }

  showTab (id, position) {
    //实现还存在问题，需要去获取到最新的位置再重置
    let instance = this.get(this.getName(id))
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
      this.setBounds(a.tab.id, a.bounds)
    })

    ipc.on('setTableTabScale', (e, a) => {
      this.setScale(a.tab.id, a.scale)
    })

    ipc.on('addTableTab', async (event, args) => {
      console.log('需要添加tab',args)
      let tab = {}
      try {
        let result = await this.addTab({ url: args.url, position: args.position })
        tab = result.tab
        console.log('完成添加',tab)
         this.sendToBrowser('addedTableTab',{
           tab:tab
         })
      } catch (e) {
        console.error(e, '创建出错')
      }

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
    ipc.on('goBackTableTab',(event,args)=>{
      this.goBackTab(this.getName(args.tab.id))
    })
    ipc.on('goForwardTableTab',(event,args)=>{
      this.goForwardTab(this.getName(args.tab.id))
    })
    ipc.on('updateRunningTabsCapture', (event, args) => {
      this.runningTabs.forEach((tab, index) => {
        capture(this.runningTabsInstance[index].view.webContents,undefined,'tab_'+tab.id).then((image) => {
          event.reply('updateTabCapture', { id: tab.id, image: image })
        })
      })
    })

    /**
     * 更新单个网页的截图
     */
    ipc.on('updateTabCapture', (event, args) => {
      this.runningTabs.forEach((tab, index) => {
        if (tab.id === args.id) {
          capture(this.runningTabsInstance[index].view.webContents,undefined,'tab_'+tab.id).then((image) => {
            event.reply('updateTabCapture', { id: tab.id, image: image })
          })
        }
      })
    })

    ipc.on('showTableTab',(event,args)=>{
      this.showTab(args.id,args.position)
    })
  }
}

module.exports = TableTabManager
