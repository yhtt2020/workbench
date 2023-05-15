const { app ,ipcMain:ipc } = require('electron')
function sendToTable(event,args){
  global.tableManager.send(event,args)
}
/**
 * 分屏管理器，此处的管理器不直接操作屏幕数据，而只存运行时
 */
class TableScreenManager {
  //运行中的屏幕
  runningScreens={}

  /**
   * 获取分屏的url
   */
  getUrl(){

  }

  /**
   * 设置bounds设置项
   * @param window
   * @param key
   */
  saveBounds(window,key){
    let tableWinSetting = {
      bounds: window.getBounds(),
      isMaximized: window.isMaximized()
    }
    settings.set('tableWinSetting_'+key, tableWinSetting)
    console.log('设置',key,tableWinSetting)
  }

  /**
   * 获取到bounds的设置
   * @param key
   * @returns {*}
   */
  getBounds(key){
    return settings.get('tableWinSetting_' + key)
  }

  /**
   * 绑定存储位置的事件组
   * @param window
   * @param key
   */
  bindSaveBoundsEvent(window,key){
    window.on('close', () => {
      this.saveBounds(window,key)
    })

    window.on('resized',()=>{
      this.saveBounds(window,key)
    })

    window.on('enter-html-full-screen',()=>{
      this.saveBounds(window,key)
    })

    window.on('leave-html-full-screen',()=>{
      this.saveBounds(window,key)
    })


    window.on('blur',()=>{
      this.saveBounds(window,key)
    })

    window.on('content-bounds-updated',()=>{
      this.saveBounds(window,key)
    })

    window.on('session-end',()=>{
      this.saveBounds(window,key)
    })

    window.on('moved',()=>{
      this.saveBounds(window,key)
    })
    window.on('leave-full-screen',()=>{
      this.saveBounds(window,key)
    })
    window.on('enter-full-screen',()=>{
      this.saveBounds(window,key)
    })
  }
  closeByDomain(domain){
    console.log('关闭分屏')
    let key=Object.keys(this.runningScreens).find(key=>{
      return this.runningScreens[key].fullDomain===domain
    })
    let screen=this.runningScreens[key]
    if(screen){
      screen.window.close()
      delete this.runningScreens[key]
    }
  }
  /**
   *
   * @param screen
   */
  async startupScreen (screen) {
    let key = screen.key
    if (this.runningScreens[key]) {
      const window = this.runningScreens[key].window
      if (window && !window.isDestoryed()) {
        window.focus()
      }
    } else {
      let windowInstance = await windowManager.create({
        name: 'table',
        windowOption: {
          alwaysOnTop: false,
          width: 1098,
          minimizable: false,
          height: 618,
          minWidth: 800,
          minHeight: 480,
          frame: false,
          skipTaskbar: screen.settings.skipTaskbar,//增加单独的设置项目
          transparent: true,
          show:true,
          //backgroundColor: '#fff',
        },
        webPreferences: {
          webSecurity: false,
          devTools: true,
          preload: require('path').join(__dirname, '../../src/preload/tablePreload.js'),
          nodeIntegration: true,
          sandbox: false,
          contextIsolation: false,
          additionalArguments: [
            '--app-path=' + app.getPath('exe'),
            '--app-dir_name=' + __dirname,
          ]
        }
      })
      let savedBounds = this.getBounds(screen.key)
      let window=windowInstance.window
      if (savedBounds) {
        window.setBounds(savedBounds.bounds)
        setTimeout(()=>{
          if (savedBounds.isMaximized) {
            window.maximize()
          }
        },1000)
      }

      this.bindSaveBoundsEvent(window, screen.key)
      const url=render.getUrl('table.html',{},screen.fullDomain)
      window.loadURL(url)
      this.runningScreens[key]={
        windowInstance:windowInstance,
        window:window,
        screen:screen,
        domain:screen.domain,
        fullDomain:screen.fullDomain
      }
    }
  }
  bindIPC(){
    ipc.on('startupScreen',async (event, args) => {
      await this.startupScreen(args.screen)
    })

    ipc.on('closeScreen',(event,args)=>{
      let fullDomain=args.fullDomain
      this.closeByDomain(fullDomain)
      sendToTable('closeScreen')
    })

    ipc.on('sendToSubs',(event,argsOrigin)=>{
      console.log('接收到转发到全部分屏的消息',event,argsOrigin)
      const {
        channel,args
      }=argsOrigin
      Object.keys(this.runningScreens).forEach(sub=>{
        this.runningScreens[sub].window.webContents.send(channel,args)
      })
    })
    ipc.on('sendToSub',(event,argsOrigin)=>{
      console.log('接收到转发到指定分屏的消息',event,argsOrigin)
      const {
        key,channel,args
      }=argsOrigin
      Object.keys(this.runningScreens).forEach(sub=>{
        if(this.runningScreens[sub].screen.key===key){
          this.runningScreens[sub].window.webContents.send(channel,args)
        }
      })
    })
  }
}

module.exports=TableScreenManager
