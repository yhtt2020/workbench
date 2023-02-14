

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
    let appInstance=this.get(this.getName(app.name))
    if(appInstance){
      //已经运行了
    }else{
      appInstance = await global.windowManager.createView({
        name: this.getName(app.name),
        webPreferences: {
          preload:___dirname + '/src/appPreload/' + app.preload + '.js',
          sandbox: false,
          partition:'persist:webcontent'
        },
        url:app.url
      })
    }
    let view = appInstance.view
    view.webContents.on('before-input-event', (event, input) => {
      if (input.key.toLowerCase() === 'f12') {
        view.webContents.openDevTools({
          mode: 'detach'
        })
        event.preventDefault()
      }
    })
    this.runningApps.push(app)
    this.runningAppsInstance.push(appInstance)
    this.tableWin.setBrowserView(view)//置入app
    view.webContents.on('dom-ready',()=>{
      this.setViewPos(appInstance.view, position)
    })
    return appInstance
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
  closeApp(name){
    let instance=this.get(name)
    if(instance){
      this.tableWin.removeBrowserView(instance.view)
      instance.close()
    }
    this.runningAppsInstance.splice(this.getIndex(name),1)
    this.runningApps.splice(this.getIndex(name),1)
  }
  showApp(name){
    //实现还存在问题，需要去获取到最新的位置再重置
    let instance=this.get(name)
    if(instance){
      this.tableWin.setBrowserView(instance.view)
      this.setViewPos(instance.view,instance.position)
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
}

module.exports = TableAppManager
