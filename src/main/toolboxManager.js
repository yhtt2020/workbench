const { app } = require('electron')

class ToolboxManager{
    windowInstance=null//窗口实例
    static ensure(){
      if(!global.toolboxManager){
        global.toolboxManager=new ToolboxManager()
      }
    }
    async open(){
      if(!this.windowInstance){
        this.windowInstance=await global.windowManager.create({
          name:'toolbox',
          url:global.render.getUrl('toolbox.html'),
          windowOption:{
            frame:false,
            width:572,
            height:420,
          },
          webPreferences:{
            nodeIntegration: true,
            webSecurity: false,
            preload: require('path').join(__dirname, '../../src/preload/toolboxPreload.js'),
            sandbox: false,
            contextIsolation: false,
            enableBlinkFeatures: ['unsafely-treat-insecure-origin-as-secure'],
            additionalArguments: [
              '--app-path=' + app.getPath('exe'),
              '--app-dir_name=' + __dirname,
            ]
          }
        })
        const window=this.windowInstance.window
       // window.webContents.openDevTools()//打开调试工具，注释此行，禁止直接打开调试工具
        // window.on('blur',()=>{
        //   this.windowInstance.close() //注释此行禁止失焦隐藏
        //   this.windowInstance=null
        // })
        window.on('closed',()=>{
          this.windowInstance=null
        })
      }else{
        this.windowInstance.window.focus()
      }
    }
}

module.exports=ToolboxManager
