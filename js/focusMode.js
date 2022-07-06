var  isFocusMode = false
var  isGuideMode= false
var  isFirstGuideMode = false

ipc.on('enterFocusMode', function () {
  isFocusMode = true
  document.body.classList.add('is-focus-mode')

  setTimeout(function () { // wait to show the message until the tabs have been hidden, to make the message less confusing
    ipc.invoke('showFocusModeDialog1')
  }, 16)
})

ipc.on('exitFocusMode', function () {
  isFocusMode = false
  document.body.classList.remove('is-focus-mode')
})


ipc.on('enterFirstGuide',()=>{
  isFocusMode = true
  document.body.classList.add('is-focus-mode')
  isFirstGuideMode = true
})

ipc.on('exitFirstGuide',()=>{
  isFocusMode = false
  isFirstGuideMode= false
  document.body.classList.remove('is-focus-mode')
})

ipc.on('enterGuide', function () {
  isFocusMode = true
  document.body.classList.add('is-focus-mode')
  isGuideMode=true
})

ipc.on('exitGuide', function () {
  isFocusMode = false
  isGuideMode= false
  document.body.classList.remove('is-focus-mode')
})


module.exports = {
  enabled: function () {
    return isFocusMode
  },
  warn: function () {
    if(isGuideMode===false&&isFirstGuideMode===false){
      ipc.invoke('showFocusModeDialog2')
    }
    if(isFirstGuideMode===true){
      ipc.invoke('showFirstGuideDialog')
    }
    if(isGuideMode===true) {
      ipc.invoke('showGuideDialog')
    }
  }
}
