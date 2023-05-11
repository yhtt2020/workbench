//此为整个系统的入口，比其他的几个文件周期都要早
const electron = require('electron')
const fs = require('fs-extra')
const path = require('path')
global.settings=require('./js/util/settings/settingsMain.js')
const {
  app, // Module to control application life.
  protocol, // Module to control protocol handling
  BrowserWindow, // Module to create native browser window.
  webContents,
  session,
  ipcMain: ipc,
  Menu, MenuItem,
  crashReporter,
  dialog,
  nativeTheme,
  globalShortcut
} = electron
electron.protocol.registerSchemesAsPrivileged([
  { scheme: 'tsbapp', privileges: { bypassCSP: true ,standard:true} } //将tsbapp注册为标准协议，以支持localStorage
])
global.___dirname=__dirname
global.ipcMessageMain=require('./src/main/ipcMessageMain.js')

let forceClose = false //是否强制退出应用
var clipboardContent=''
var spaceManager
var sessions=[]


app.on('session-created',async (ses)=>{
  sessions.push(ses)
  ses.protocol.registerBufferProtocol('tsbapp', (request, response) => {
    render.regDefaultProtocol(request, response)
  })
  // console.log(ses.serviceWorkers)
  // ses.serviceWorkers.on('console-message', (event, messageDetails) => {
  //   console.log(
  //     'Got service worker message',
  //     messageDetails,
  //     'from',
  //     ses.serviceWorkers.getFromVersionID(messageDetails.versionId)
  //   )
  // })
  // setInterval(()=>{
  //   console.log(ses.serviceWorkers.getAllRunning(),'ses workers')
  // },5000)


  if(ses!==session.defaultSession && session!==session.fromPartition('persist:webcontent')){
    if(typeof browser!=='undefined')
      await browser.ensureExtension(ses) //如果不是默认会话和网页会话，就载入插件
  }
})

function ensureDb(){
  const DB_ROOT=path.join(app.getPath('userData'),'db')
  const DB_PATH=path.join(DB_ROOT,'db.sqlite')
  const TPL_PATH=path.join(__dirname,'/db/tpl.sqlite')
  if(!fs.existsSync(DB_PATH)){
    fs.ensureDirSync(DB_ROOT)
    fs.copyFileSync(TPL_PATH,DB_PATH)
    console.warn('由于数据库未初始化，尝试复制初始化数据库')
  }
}

ensureDb()

global.settings.initSetting(()=>{

