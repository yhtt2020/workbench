/**
 * 专用于拆分出api的处理方法，主要是绑定各种方法并进行处理
 */
const { ipcMain: ipc } = require('electron')

const apiList={

  window:[
    'close',
  ]
}


class ApiHandler {
  apiInstance=[]
  static onUrlChanged=[]
  constructor () {

  }
  static bindIPC(){
    ipc.on('changeUrl',(e,a)=>{
      ApiHandler.onUrlChanged.forEach(instance=>{
        console.log(instance,'每一个监听的实例')
        instance.webContents.send('tabs.onUrlChanged',a)
      })
    })
    ApiHandler.on('tabs','setOnUrlChanged',(event,args,instance)=>{
      //添加一个弹幕观测
      console.log('添加监听',instance)
      if(instance.type==='view')
        ApiHandler.onUrlChanged.push(instance.view)
      else{
        ApiHandler.onUrlChanged.push(instance.window)
      }
    })
    ApiHandler.on('runtime','init', (event, args,instance) => {
      try{
        let modMap={
          'frameWindow':'frameWindow',
          'window':'window',
          'view':'attach'
        }
        let runtime={
          mod:modMap[instance.type]
        }

        event.sender.send('api.runtime.initResponse',{runtime}) //回传当前模式信息
      }catch (e) {
        console.warn('回传失败',e)
      }
    })

    ApiHandler.on('screen','getAllDisplays',(event,args,instance)=>{
      event.returnValue= require('electron').screen.getAllDisplays()
    })

    ApiHandler.onWindow('close', (event, args,instance) => {
      windowManager.close(instance.name)
    })

    ApiHandler.onWindow('setAlwaysOnTop', (event, args, instance) => {
      if(instance.window) {
        instance.window.setAlwaysOnTop(args.flag)
      }
    })

    ApiHandler.onWindow('isAlwaysOnTop', (event, args, instance) => {
      if (instance.type === 'view') {
        event.returnValue = false //view的话，统一返回false
      } else if (instance.type === 'frameWindow') {
        event.returnValue = instance.frame.isAlwaysOnTop()
      } else if (instance.type === 'window') {
        event.returnValue = instance.window.isAlwaysOnTop()
      }
    })

    ApiHandler.onWindow('maximize',(event,args,instance)=>{
      if(instance.type==='frameWindow'){
        instance.frame.maximize()
      }else if (instance.type === 'window') {
        instance.window.maximize()
      }
    })
    ApiHandler.onWindow('minimize',(event,args,instance)=>{
      if(instance.type==='frameWindow'){
        instance.frame.minimize()
      }else if (instance.type === 'window') {
        instance.window.minimize()
      }
    })
    ApiHandler.onWindow('restore',(event,args,instance)=>{
      if(instance.type==='frameWindow'){
        instance.frame.restore()
      }else if (instance.type === 'window') {
        instance.window.restore()
      }
    })
    ApiHandler.onWindow('getBounds',(event,args,instance)=>{
      if(instance.type==='frameWindow'){
        event.returnValue= instance.frame.getBounds()
      }else if (instance.type === 'window') {
        event.returnValue= instance.window.getBounds()
      }

    })

    ApiHandler.onWindow('setBounds',(event,args,instance)=>{
      if(instance.type==='frameWindow'){
        instance.frame.setBounds(args)
      }else if (instance.type === 'window') {
        instance.window.setBounds(args)
      }
    })
    ApiHandler.onWindow('setFullScreen',(event,args,instance)=>{
      if(instance.type==='frameWindow'){
        instance.frame.setFullScreen(args)
      }else if (instance.type === 'window') {
        instance.window.setFullScreen(args)
      }
    })
    ApiHandler.onWindow('attach', (event, args, instance) => {
      if (windowManager.attachedInstance === instance) {
        return
      }
      windowManager.attachInstance(instance, args.pos, args.width)
    })

    ApiHandler.onWindow('detach', (event, args, instance) => {
      if (windowManager.attachedInstance !== instance) {
        return
      }
      windowManager.detachInstance()
    })

    ApiHandler.onWindow('getAttachStatus', (event, args, instance) => {
      if (windowManager.attachedInstance !== instance) {
        event.returnValue = false
      } else {
        event.returnValue = windowManager.attachStatus
      }
    })

    ApiHandler.on('notification', 'send', (event, args, instance) => {
      //需要前置处理消息设置的状态决定到底发不发消息
      if (instance.app) {
        appManager.onNotice(instance.app, args)
      }
      // const result = appManager.beforeEachNotification(notificationSettingStatus, args)
      // if (result) {
      //   appManager.notification(args.saAppId, {
      //     title: args.title,
      //     body: args.body,
      //   }, typeof args.ignoreWhenFocus == 'undefined' ? false : args.ignoreWhenFocus)
      //   return { code: 200, msg: '成功' }
      // } else {
      //   return { code: 500, msg: '失败' }
      // }
    })
  }
  /**
   * 通用绑定事件方法，额外增加了一个instance参数以便于api区分当前的instance
   * @param channel
   * @param cb
   */
  static onWindow(channel, cb) {
    ApiHandler._on('api.window.' + channel, (event, args) => {
      let instance = windowManager.get(args['_name'])
      cb(event, args['args'], instance)
    })
  }

  static on(module, channel, cb) {
    ApiHandler._on('api.' + module + '.' + channel, (event, args) => {
      let instance = windowManager.get(args['_name'])
      cb(event, args['args'], instance)
    })
  }

  static _on(channel, cb) {
    require('electron').ipcMain.on(channel, cb)
  }
}

module.exports=ApiHandler
