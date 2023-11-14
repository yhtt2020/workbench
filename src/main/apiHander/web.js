const Base = require('./base')
const ipc = require('electron').ipcMain

class Web extends Base {
  instances =[]

  callbacks={}
  constructor () {
    super('web')
  }

  bindIPC () {

    this.on('callback',async(event,args,instance)=>{
      console.log('子窗体回调到达',args)
      let ins=this.callbacks[args.cbId]
      ins.table.window.webContents.send(args.cbId,{
        ...args
      })
    })
    this.on('openPreloadWindow', async (event, args, instance) => {
      // width:800,
      //   height:600,
      //   background:false,
      //   url:'https://passport.jd.com/uc/login',
      //   preload:window.globalArgs['app-dir_name'] +'/src/appPreload/ecommerce/jd/login.js',
      //   callback:(data)=>{
      //   //todo 获取到登录成功的信号
      //   tsbApi.web.openPreloadWindow({
      //     background:true,
      //     url:"https://order.jd.com/center/list.action",
      //     preload:window.globalArgs['app-dir_name'] +'/src/appPreload/ecommerce/jd/order.js'
      //   })
      // }
      const name='api_web_' + args.cbId
      console.log('创建一个cbid',args.cbId)
      let windowInstance = await global.windowManager.create({
        name: name ,
        show: !args.background,//不显示
        windowOption: {
          width: args.width || 800,
          height: args.height || 600,
          frame: true
        },
        webPreferences: {
          autoplayPolicy: 'document-user-activation-required',
          preload: args.preload, //默认使用tsApi
          sandbox: false,
          partition: 'persist:webcontent',
          webSecurity: false,
          additionalArguments: [
            '--app-type=apiWeb',//添加控制台参数,
            '--cbId='+args.cbId
           // ...additionalArguments
          ]
        },
        url: args.url
      })
      if(args.cbId){
        this.callbacks[args.cbId]={
          from:windowInstance,
          table:instance
        }
      }
      //windowInstance.window.setMenu(null)

    })

  }
}

module.exports = Web

