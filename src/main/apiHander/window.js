const Base = require('./base')
const captureHelper = require('../captureHelper')
const ipc = require('electron').ipcMain

class Window extends Base {
  instances = []

  callbacks = {}

  constructor () {
    super('window')
  }

  bindIPC () {
    this.on('close', (event, args, instance) => {
      windowManager.close(instance.name)
    })

    this.on('setFocusable', (event, args, instance) => {
      if (instance.window) {
        console.log('设置窗口可否聚焦',args.flag)
        instance.window.setFocusable(args)
      }
    })
    this.on('setSkipTaskbar', (event, args, instance) => {
      if (instance.window) {
        instance.window.setSkipTaskbar(args)
      }
    })ddd
    this.on('focus', (event, args, instance) => {
      if (instance.window) {
        instance.window.focus()
      }
    })

    this.on('isFocusable', (event, args, instance) => {
      if (instance.window) {
        event.returnValue = instance.window.setFocusable()
      }
    })

    this.on('setAlwaysOnTop', (event, args, instance) => {
      if (instance.window) {
        instance.window.setAlwaysOnTop(args.flag)
      }
    })

    this.on('isAlwaysOnTop', (event, args, instance) => {
      if (instance.type === 'view') {
        event.returnValue = false //view的话，统一返回false
      } else if (instance.type === 'frameWindow') {
        event.returnValue = instance.frame.isAlwaysOnTop()
      } else if (instance.type === 'window') {
        event.returnValue = instance.window.isAlwaysOnTop()
      }
    })

    this.on('isMaximized', (event, args, instance) => {
      if (instance.type === 'view') {
        event.returnValue = false //view的话，统一返回false
      } else if (instance.type === 'frameWindow') {
        event.returnValue = instance.frame.isMaximized()
      } else if (instance.type === 'window') {
        event.returnValue = instance.window.isMaximized()
      }
    })
    this.on('maximize', (event, args, instance) => {
      if (instance.type === 'frameWindow') {
        instance.frame.maximize()
      } else if (instance.type === 'window') {
        instance.window.maximize()
      }
    })
    this.on('unmaximize', (event, args, instance) => {
      if (instance.type === 'frameWindow') {
        instance.frame.unmaximize()
      } else if (instance.type === 'window') {
        instance.window.unmaximize()
      }
    })
    this.on('minimize', (event, args, instance) => {
      if (instance.type === 'frameWindow') {
        instance.frame.minimize()
      } else if (instance.type === 'window') {
        instance.window.minimize()
      }
    })
    this.on('restore', (event, args, instance) => {
      if (instance.type === 'frameWindow') {
        instance.frame.restore()
      } else if (instance.type === 'window') {
        instance.window.restore()
      }
    })

    this.on('getSize', (event, args, instance) => {
      if (instance.type === 'frameWindow') {
        event.returnValue = instance.view.getSize()
      } else if (instance.type === 'window') {
        event.returnValue = instance.window.getSize()
      }
    })

    this.on('getZoomFactor', (event, args, instance) => {
      if (instance.type === 'frameWindow') {
        event.returnValue = instance.view.webContents.getZoomFactor()
      } else if (instance.type === 'window') {
        event.returnValue = instance.window.webContents.getZoomFactor()
      }
    })

    this.on('setZoomFactor', (event, args, instance) => {
      if (instance.type === 'frameWindow') {
        instance.view.webContents.setZoomFactor(args)
      } else if (instance.type === 'window') {
        instance.window.webContents.setZoomFactor(args)
      }
    })

    this.on('getBounds', (event, args, instance) => {
      if (instance.type === 'frameWindow') {
        event.returnValue = instance.frame.getBounds()
      } else if (instance.type === 'window') {
        event.returnValue = instance.window.getBounds()
      }

    })

    this.on('setBounds', (event, args, instance) => {
      if (instance.type === 'frameWindow') {
        instance.frame.setBounds(args)
      } else if (instance.type === 'window') {
        instance.window.setBounds(args)
      }
    })
    this.on('setFullScreen', (event, args, instance) => {
      if (instance.type === 'frameWindow') {
        instance.frame.setFullScreen(args)
      } else if (instance.type === 'window') {
        instance.window.setFullScreen(args)
      }
    })
    this.on('isFullScreen', (event, args, instance) => {
      if (instance.type === 'view') {
        event.returnValue = false //view的话，统一返回false
      } else if (instance.type === 'frameWindow') {
        event.returnValue = instance.frame.isFullScreen()
      } else if (instance.type === 'window') {
        event.returnValue = instance.window.isFullScreen()
      }
    })
    this.on('attach', (event, args, instance) => {
      if (windowManager.attachedInstance === instance) {
        return
      }
      windowManager.attachInstance(instance, args.pos, args.width)
    })

    this.on('detach', (event, args, instance) => {
      if (windowManager.attachedInstance !== instance) {
        return
      }
      windowManager.detachInstance()
    })

    this.on('getAttachStatus', (event, args, instance) => {
      if (windowManager.attachedInstance !== instance) {
        event.returnValue = false
      } else {
        event.returnValue = windowManager.attachStatus
      }
    })

    this.on('getCapture', async (event, args, instance) => {
      if (instance.type === 'window') {
        let captureImg = await captureHelper.capture(event.sender)
        if (captureImg) {
          event.returnValue = captureImg
        } else {
          event.returnValue = null
        }
      }
    })
  }

}

module.exports = Window
