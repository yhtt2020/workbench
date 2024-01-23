const Base = require('./base')
const appModel = require('../../model/appModel')
const { BrowserWindow } = require('electron')
class App extends Base {
  instances = []

  callbacks = {}

  constructor () {
    super('app')
  }
  bindIPC () {
    this.on('run', (event, args, instance) => {
      global.appManager.openApp(args.nanoid, args.background, args.app)
    })
    this.on('getAll', async (event, args, instance) => {
      console.log('获取全部app')
      const all = await appModel.getAllApps()
      console.log('获取全部app', all)
      event.returnValue = all//view的话，统一返回false
    })

    this.on('installAppConfirm',(event,args)=>{
      appManager.installAppConfirm(args.manifest,'应用市场',(data)=>{
        if(data.result){
          event.reply(args.cbId,{status:1,nanoid:data.nanoid})
          event.returnValue= { status:1,nanoid:data.nanoid }
        }else{
          event.reply(args.cbId,{status:0,reason:data})
          event.returnValue= { status:0,reason:data}
        }
      },BrowserWindow.fromWebContents(event.sender))
    })
  }
}

module.exports=App
