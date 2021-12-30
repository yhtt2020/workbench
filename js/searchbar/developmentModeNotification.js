var searchbarPlugins = require('searchbar/searchbarPlugins.js')

function initialize () {
  searchbarPlugins.register('developmentModeNotification', {
    index: 0,
    trigger: function (text) {
      return 'development-mode' in window.globalArgs
    },
    showResults: function () {
      searchbarPlugins.reset('developmentModeNotification')
      searchbarPlugins.addResult('developmentModeNotification', {
        title: '当前模式：开发者模式启用中'
      })
    }
  })
}

module.exports = { initialize }
