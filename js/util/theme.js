if (typeof require !== 'undefined') {
  if(typeof require('electron').app==='undefined'){
    var tempSettings = require('./settings/settings.js')
  }else{
    var tempSettings=global.settings
      //var settings=global.settings
  }
}else{
  var tempSettings = window.settings
}

function systemShouldEnableDarkMode () {
  return tempSettings.list.systemShouldUseDarkColors
}

function isNightTime () {
  var hours = new Date().getHours()
  return (hours > 21 || hours < 6)
}

function enableDarkMode () {
  document.body.classList.add('dark-mode')
  window.isDarkMode = true
  requestAnimationFrame(function () {
    window.dispatchEvent(new CustomEvent('themechange'))
  })
  window.postMessage({
    message: 'themeChange',
    status: 'enable'
  })
}

function disableDarkMode () {
  document.body.classList.remove('dark-mode')
  window.isDarkMode = false
  requestAnimationFrame(function () {
    window.dispatchEvent(new CustomEvent('themechange'))
  })
  window.postMessage({
    message: 'themeChange',
    status: 'disable'
  })
}

/**
 * 获取是否应该是夜间模式
 * @returns {boolean}
 */
function getShouldDarkMod(){
  // 1 or true: dark mode is always enabled
  const value=tempSettings.get('darkMode')
  if (value === 1 || value === true) {
    return true
  }
  if (value === 2 ) {
    if (systemShouldEnableDarkMode()) {
      return true
    } else {
      return false
    }
  } else if (value === 0) {
    // 0: automatic dark mode at night
    if (isNightTime()) {
      return true
    } else {
      return false
    }
    //undefined和false都默认和永久禁用一致
  } else if (value === undefined || value === -1 || value === false) {
    // -1: never enable
    return false
  }


}

var themeInterval = null

function initialize () {
  function themeSettingsChanged (value) {
    /*
    value is the value of the darkMode pref
    0 - automatic dark mode
    -1: never
    0: at night
    1: always
    2: follow system (default)
    true / false: legacy pref values, translate to always/system
    */
    clearInterval(themeInterval)

    // 1 or true: dark mode is always enabled
    if (value === 1 || value === true) {
      enableDarkMode()
      return
    }

    // 2, undefined, or false: automatic dark mode following system
    // 移除undefined和false
    if (value === 2) {
      if (systemShouldEnableDarkMode()) {
        enableDarkMode()
      } else {
        disableDarkMode()
      }

      themeInterval = setInterval(function () {
        if (systemShouldEnableDarkMode()) {
          if (!window.isDarkMode) {
            enableDarkMode()
          }
        } else if (window.isDarkMode) {
          disableDarkMode()
        }
      }, 10000)
    } else if (value === 0) {
      // 0: automatic dark mode at night
      if (isNightTime()) {
        enableDarkMode()
      } else {
        disableDarkMode()
      }

      themeInterval = setInterval(function () {
        if (isNightTime()) {
          if (!window.isDarkMode) {
            enableDarkMode()
          }
        } else if (window.isDarkMode) {
          disableDarkMode()
        }
      }, 10000)
      // undefined和false都默认和永久禁用一致
    } else if (value === undefined || value === -1 || value === false) {
      // -1: never enable
      disableDarkMode()
    }
  }
  tempSettings.listen('darkMode', themeSettingsChanged)
  tempSettings.listen('systemShouldUseDarkColors', function () {
    // the settings API differs between the UI process and tabs
    if (typeof process === 'undefined') {
      tempSettings.get('darkMode', themeSettingsChanged)
    } else {
      themeSettingsChanged(tempSettings.get('darkMode'))
    }
  })
}

if (typeof module !== 'undefined') {
  module.exports = { initialize ,systemShouldEnableDarkMode,getShouldDarkMod}
} else {
  initialize()
}
