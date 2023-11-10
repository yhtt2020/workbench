const Watch = require('./apiHander/watch')
const Web = require('./apiHander/web')
const Window = require('./apiHander/window')
/**
 * 专用于拆分出api的处理方法，主要是绑定各种方法并进行处理
 */
const { ipcMain: ipc, app } = require('electron')
const captureHelper = require('./captureHelper')
const SystemHelper = require('./libs/systemHelper')
console.log(SystemHelper, '系统帮助')
const apiList = {

  window: [
    'close',
  ]
}

class ApiHandler {
  apiInstance = []
  static onUrlChanged = []
  static downloadingItems = []
  static downloadWebContents = []
  static downloadSession = []

  static handlers = []

  constructor () {
  }

  static bindIPC () {
    ApiHandler.handlers.push(new Watch())
    ApiHandler.handlers.push(new Web())
    ApiHandler.handlers.push(new Window())
    ApiHandler.handlers.forEach(handler => {
      handler.bindIPC()
    })
    ipc.on('changeUrl', (e, a) => {
      ApiHandler.onUrlChanged.forEach(instance => {
        try {
          instance.webContents.send('tabs.onUrlChanged', a)
        } catch (e) {
          //发现已经挂了，就直接delete掉
          ApiHandler.onUrlChanged.splice(ApiHandler.onUrlChanged.findIndex(ins => {
            return ins === instance
          }), 1)
        }
      })
    })
    ApiHandler.on('tabs', 'setOnUrlChanged', (event, args, instance) => {
      //添加一个弹幕观测
      if (instance.type === 'view')
        ApiHandler.onUrlChanged.push(instance.view)
      else {
        ApiHandler.onUrlChanged.push(instance.window)
      }
    })

    ApiHandler.on('settings', 'get', (event, args, instance) => {
      event.returnValue = settings.get(args.key)
    })
    ApiHandler.on('settings', 'set', (event, args, instance) => {
      console.log('set ', args.key, args.value)
      event.returnValue = settings.set(args.key, args.value)
    })

    ApiHandler.on('settings', 'setAutoRun', (event, args) => {
      event.returnValue = settings.set('autoRun', args)
      require('electron').app.setLoginItemSettings({
        openAtLogin: args,
        path: process.execPath,
        args: []
      })
    })

    ApiHandler.on('dialog', 'showOpenDialog', (event, args, instance) => {
      console.log(args)
      event.returnValue = require('electron').dialog.showOpenDialogSync(instance.window || instance.view, args)
    })
    ApiHandler.on('dialog', 'showSaveDialog', (event, args, instance) => {
      event.returnValue = require('electron').dialog.showSaveDialogSync(instance.window || instance.view, args)
    })
    ApiHandler.on('dialog', 'showMessageBox', (event, args, instance) => {
      event.returnValue = require('electron').dialog.showMessageBoxSync(instance.window || instance.view, args)
    })
    ApiHandler.on('dialog', 'showErrorBox', (event, args, instance) => {
      require('electron').dialog.showErrorBox(instance.window || instance.view, args)
      event.returnValue = true
    })

    ApiHandler.on('download', 'start', (event, args, instance) => {
      //启动一个下载
      let ins = instance.window || instance.view
      let webContents = ins.webContents
      args.webContentsId = webContents.id

      ApiHandler.downloadingItems.push(args)

      /*
      * url:this.getVideo(item),
        savePath: this.appData.papers.settings.savePath+'/lively/'+item.name,
        updated:(item,event,state)=>{
          //https://www.electronjs.org/zh/docs/latest/api/download-item#%E4%BA%8B%E4%BB%B6%E5%90%8D-updated
        },
        done:(item,event,state)=>{

        }*/
      /**
       * 获取到下载中的item，这个item是触发的时候给的item，不是下载的时候生成的那个
       * @param url
       * @returns {*}
       */
      function getDownloadingItem (url) {
        return ApiHandler.downloadingItems.find(di => {
          return di.url === url
        })
      }

      let originEvent = event

      function send (webContents, channel, args) {
        if (webContents && !webContents.isDestroyed()) {
          webContents.send(channel, args)
        }
      }

      function bindDownloadListener (webContents) {
        let found = ApiHandler.downloadSession.find(ds => {
          return ds === webContents.session
        })
        if (found) {
          //已经绑定了直接return
          return
        } else {
          let session = webContents.session
          webContents.on('closed', () => {
            //当webcontent被关闭的时候，自动清理掉downloadWebcontents
            ApiHandler.downloadWebContents.splice(ApiHandler.downloadWebContents.findIndex(wc => {
              return wc === webContents
            }),)
          })
          session.on('will-download', (event, item, webContents) => {
            let myItem = getDownloadingItem(item.getURL())
            let saveDir = require('path').dirname(myItem.savePath)
            let fs = require('fs-extra')
            fs.ensureDirSync(saveDir)
            let savePath = require('path').normalize(myItem.savePath)
            if (fs.existsSync(myItem.savePath)) {
              fs.rmSync(myItem.savePath)//自动删除已经存在的文件，放置文件不存在无法下载
            }
            item.setSavePath(savePath)
            send(webContents, 'download.onWillDownload', { item: myItem })

            //绑定更新
            item.on('updated', (event, state) => {
              let myItem = getDownloadingItem(item.getURL())
              send(webContents, 'download.onUpdated', {
                item: myItem, state: state, downloadInfo: {
                  totalBytes: item.getTotalBytes(),
                  receivedBytes: item.getReceivedBytes(),
                }
              })
            })
            //绑定下载完成
            item.on('done', (event, state) => {
              let myItem = getDownloadingItem(item.getURL())
              if (myItem) {
                let foundIndex = ApiHandler.downloadingItems.findIndex(di => {
                  return di.url === item.getURL()
                })
                if (foundIndex > -1) {
                  ApiHandler.downloadingItems.splice(foundIndex, 1)
                }

              }
              send(webContents, 'download.onDone', {
                item: myItem, state: state, downloadInfo: {
                  totalBytes: item.getTotalBytes(),
                  receivedBytes: item.getReceivedBytes()
                }
              })
            })
          })

          ApiHandler.downloadWebContents.push(webContents)
        }
      }

      try {
        bindDownloadListener(webContents)
        webContents.downloadURL(args.url)
      } catch (e) {
        console.warn('下载失败，原因', e)
      }

    })

    ApiHandler.on('system', 'extractFileIcon', async (event, args) => {
      try {
        event.returnValue = await SystemHelper.extractFileIcon(args.uri)
      } catch (e) {
        console.error('获取文件图标失败', e)
        return event.returnValue = ''
      }
    })

    ApiHandler.on('runtime', 'init', (event, args, instance) => {
      try {
        let modMap = {
          'frameWindow': 'frameWindow',
          'window': 'window',
          'view': 'attach'
        }
        let runtime = {
          mod: modMap[instance.type]
        }

        event.sender.send('api.runtime.initResponse', { runtime }) //回传当前模式信息
      } catch (e) {
        console.warn('回传失败', e)
      }
    })

    ApiHandler.on('screen', 'getAllDisplays', (event, args, instance) => {
      event.returnValue = require('electron').screen.getAllDisplays()
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


  static on (module, channel, cb) {
    ApiHandler._on('api.' + module + '.' + channel, (event, args) => {
      let instance = windowManager.get(args['_name'])
      cb(event, args['args'], instance)
    })
  }

  static _on (channel, cb) {
    require('electron').ipcMain.on(channel, cb)
  }
}

module.exports = ApiHandler
