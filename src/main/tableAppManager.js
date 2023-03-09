

class TableAppManager {
  runningApps = []
  tableWin=null //方便调用
  runningAppsInstance = []

  setTableWin (tableWin) {
    this.tableWin = tableWin
  }

  getName (name) {
    return 'table_app_' + name
  }

  async executeApp (args) {

    //app args
    let { app, position } = args
    let view
    let appInstance=this.get(this.getName(app.name))
    if(appInstance){
      //已经运行了
      this.showApp(appInstance.name,position)
      // this.tableWin.setBrowserView(view)//置入app
      // this.setViewPos(appInstance.view, position)
    }else{
      //初始化一下
      appInstance = await global.windowManager.createView({
        name: this.getName(app.name),
        webPreferences: {
          preload:___dirname + '/src/appPreload/' + app.preload + '.js',
          sandbox: false,
          partition:'persist:webcontent',
          nodeIntegration:app.node==='true',
          webSecurity:app.webSecurity==='true',
          contextIsolation:app.node!=='true',
        },
        url:app.url
      })
      view = appInstance.view
      view.webContents.on('before-input-event', (event, input) => {
        if (input.key.toLowerCase() === 'f12') {
          view.webContents.openDevTools({
            mode: 'detach'
          })
          event.preventDefault()
        }else if(input.key.toLowerCase() === 'f11'){
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
      this.tableWin.setBrowserView(view)//置入app
      view.webContents.on('dom-ready',()=>{
        this.setViewPos(appInstance.view, position)
      })
      this.runningApps.push(app)
      this.runningAppsInstance.push(appInstance)
    }
    return appInstance
  }

  /**
   * 同步位置
   * @param name
   * @param position
   */
  setBounds(name,position){
    console.log('setbounds',name,position)
    this.setViewPos(this.get(this.getName(name)).view,position)
}
  setViewPos (view, position) {
    view.setBackgroundColor('#ccc')
    view.setBounds(position)
    view.setAutoResize({
      height:true,
      width:true,
    })
  }

  hideApp(name){
    let instance=this.get(name)
    if(instance){
      this.tableWin.removeBrowserView(instance.view)
    }
  }
  closeAllApp(){
    this.runningApps.forEach(app=>{
      this.closeApp(this.getName(app.name))
    })
  }
  closeApp(name){
    let instance=this.get(name)
    if(instance){
      if(this.tableWin && !this.tableWin.isDestroyed()) {
        this.tableWin.removeBrowserView(instance.view)
      }
      instance.close()
      this.runningAppsInstance.splice(this.getIndex(name),1)
      this.runningApps.splice(this.getIndex(name),1)
    }
  }
  showApp(name,position){
    //实现还存在问题，需要去获取到最新的位置再重置
    let instance=this.get(name)
    if(instance){
      this.tableWin.setBrowserView(instance.view)
      this.setViewPos(instance.view,position)
    }
  }
  get(name){
    return this.runningAppsInstance.find(instance=>{
      return instance.name===name
    })
  }
  getIndex(name){
    return this.runningAppsInstance.findIndex(instance=>{
      return instance.name===name
    })
  }
  send(name,channel,args){
    let appInstance=this.get(this.getName(name))
    if(appInstance){
      appInstance.view.webContents.send(channel,args)
    }
  }
}

module.exports = TableAppManager
