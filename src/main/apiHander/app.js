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
      global.appManager.openApp(args.nanoid, args.background, args.app,args.option)
    })
    this.on('runByPackage', (event, args, instance) => {
      global.appManager.executeAppByPackage(args.pkg, args.background, args.option)
    })
    this.on('getAll', async (event, args, instance) => {
      const all = await appModel.getAllApps()
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

    this.on('installTTApp',(event,args)=>{
    //todo appSqlModel.install()
      //unzip  copy  generatemd5  writedb    id=>path
      event.reply(args.cbId,{status:1,nanoid:data.nanoid})
    })
  }
}

module.exports=App
