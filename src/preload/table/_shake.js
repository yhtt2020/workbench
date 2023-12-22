const win32 = require('hmc-win32')
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
  const point=tsbApi.mouse.getPos()
  x=point.x
  y=point.y
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
module.exports= {
  start:()=>{
    console.log('开始hook监听鼠标')
    win32.mouseHook.start()
  },
  stop:()=>{
    console.log('停止hook监听鼠标')
    win32.mouseHook.close()
  }
}
console.log('执行shake','tray')
