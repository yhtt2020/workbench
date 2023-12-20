const api = require('../browserApi/baseApi')
window.tsbApi = require('../browserApi/baseApi')
window.tableApi = require('../tableApi/baseApi')
const si = require('systeminformation')
const groupApi = require('../api/groupApi')
//
let ipc = require('electron').ipcRenderer
ipc.on('updateMusicStatus', (e, a) => {
  if (window.updateMusicStatusHandler) {
    window.updateMusicStatusHandler(a)
  }
})
window.loudness = require('loudness')
window.iconv = require('iconv-lite')
window.brightness = require('brightness')
if (process.platform === 'win32') {
  window.readAida64 = require('aida64-to-json')
}

window.fs = require('fs-extra')

const win32 = require('hmc-win32')
const StorageModel = require('../model/storageModel')
window.$models = {
  appModel: require('../model/appModel'),
  axios: require('axios'),
  nanoid: require('nanoid'),
  fs: require('fs-extra'),
  storageModel: new StorageModel(),
  sysInfo: require('systeminformation'),
  inspector: require('./_inspector'),
  path: require('path'),
  https: require('https'),
  steamFs: require('fs'),
  rpc: require('../rpc/rpc'),
  electron: require('electron'),
  osUtils: require('node-os-utils'),
  win32
}
try {
  window.$models.steamUser = require('steam-user')

} catch (e) {
  console.error('注册steam包失败，错误信息：', e)
}
try {
  window.$models.steamSession = require('steam-session')
} catch (e) {
  console.error('注册steamSession包失败，错误信息：', e)
}
window.$models.appModel.initDb()

window.$models.storageModel.initDb()
window.$apis = {
  groupApi
}
tsbApi.barrage.setOnUrlChanged((a) => {
  if (tsbApi.barrage.urlChangedCallback) {
    tsbApi.barrage.urlChangedCallback(a.url)
    tsbApi.barrage.reload()
  }
})
window.getSerialNum = async () => {
  try {
    // console.log('尝试获取机器码')
    // let s = (await si.diskLayout())[0]
    // console.log(s,'ddd')
    // let serial = {
    //   baseboardSerial: s,
    // }
    // console.log(s)
    let serial = localStorage.getItem('serial')
    if (serial === null) {
      //去生成
      serial = tsbApi.runtime.clientId
      let crypto = require('crypto')
      serial = crypto.createHash('sha256').update(JSON.stringify(serial)).digest('hex')
      localStorage.setItem('serial', serial)
    }
    return serial
  } catch (e) {
    console.error(e)
  }

}

let currentRoundEdge = 0
let currentDirection = 'left'
let times = 0
let timer = null
let sleep = false
let lastPos = {
  x: 0,
  y: 0
}
let pinPos = {
  x: 0,
  y: 0
}
let go = false
const options = {
  timeout: 1000,
  sleep: 1000,
  debounce: 10
}
win32.mouseHook.on('move', (x, y, mousePoint) => {
  if(!window.shake?.enable){
    return
  }
  if (times === 0) {
    lastPos = {
      x, y
    }
  }
  if (sleep) {
    return
  }

  function setClearTimeout () {
    if (!timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      times = 0
    }, options.timeout)
  }

  function judeTimes (cbTimes, cb) {
    if (times >= cbTimes) {
      sleep = true
      setTimeout(() => {
        sleep = false
      }, options.sleep)
      times = 0
      cb(mousePoint)
    } else {
    }
  }

  function setCursorPos (x, y) {
    for (let i = 0; i < 50; i++) {
      win32.Auto.setCursorPos(x, y)//移动过去，但是这个过程中鼠标在移动则无法移动
      win32.sleep(10)
    }
  }

  function shakeMouseEvent (mousePoint) {
    document.getElementById('shakeAudio').play()
    if (!go) {
      go = true
      pinPos = { ...lastPos }
      if (window.shake?.pos) {
        setCursorPos(window.shake.pos.x, window.shake.pos.y)
      }
    } else {
      go = false
      if (window.shake?.pos) {
        setCursorPos(pinPos.x, pinPos.y)
      }
    }
    times = 0
  }

  if (currentDirection === 'left') {
    if (x > (currentRoundEdge + options.debounce)) {
      //左移的时候，x突然大于当前位置，代表反向了
      setClearTimeout()
      currentDirection = 'right'
      times++
      judeTimes(window.shake?.sensitive, shakeMouseEvent)
      return
    } else {
      //继续突破
      currentRoundEdge = x
    }
  } else if (currentDirection === 'right') {
    if (x < (currentRoundEdge - options.debounce)) {
      setClearTimeout()
      //左移的时候，x突然大于当前位置，代表反向了
      currentDirection = 'left'
      times++
      judeTimes(window.shake?.sensitive, shakeMouseEvent)
      return
    } else {
      //继续突破
      currentRoundEdge = x
    }
  }
})
win32.mouseHook.start()

