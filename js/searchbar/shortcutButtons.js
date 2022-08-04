const searchbar = require('searchbar/searchbar.js')
const searchbarPlugins = require('searchbar/searchbarPlugins.js')

const shortcuts = [
  {
    icon: 'recently-viewed',
    text: '!history ',
    title:'浏览历史'
  },
  {
    icon: 'star',
    text: '!bookmarks ',
    title:'书签收藏'
  },
  {
    icon: 'overflow-menu-horizontal',
    text: '!',
    title:'快捷指令'
  }
]

function showShortcutButtons (text, input, event) {
  var container = searchbarPlugins.getContainer('shortcutButtons')

  searchbarPlugins.reset('shortcutButtons')

  shortcuts.forEach(function (shortcut) {
    var el = document.createElement('button')
    el.className = 'searchbar-shortcut i carbon:' + shortcut.icon
    el.title = shortcut.text
    el.innerHTML =" "+ shortcut.title
    el.tabIndex = -1
    el.addEventListener('click', function () {
      if(shortcut.text==='!bookmarks '){
        ipc.send('handleTsbProtocol',{url:'tsb://app/redirect/?package=com.thisky.fav&url=/'})
        return
      }
      input.value = shortcut.text
      input.focus()
      searchbar.showResults(shortcut.text)
    })

    container.appendChild(el)
  })
}

function initialize () {
  searchbarPlugins.register('shortcutButtons', {
    index: 10,
    trigger: function (text) {
      return !text
    },
    showResults: showShortcutButtons
  })
}

module.exports = { initialize }
