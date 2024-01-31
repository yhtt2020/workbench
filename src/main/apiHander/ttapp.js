const Base = require('./base')
const appModel = require('../../model/appModel')

const useRegisterTTApps = require('../ttApps/useRegisterTTApps')
const { BrowserWindow } = require('electron')
class TTApp extends Base {
  instances = []

  callbacks = {}

  constructor () {
    super('ttapp')
  }
  bindIPC () {
    this.on('install', async (event,args)=>{
    //todo appSqlModel.install()
      //unzip  copy  generatemd5  writedb    id=>path
    let res =  await useRegisterTTApps(args.zipPath)
    console.log('res :>> ', res);
      event.reply(args.cbId,res)
    })
  }
}

module.exports=TTApp
