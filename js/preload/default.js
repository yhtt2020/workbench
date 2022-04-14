/* imports common modules */

var electron = require('electron')
var ipc = electron.ipcRenderer

var propertiesToClone = ['deltaX', 'deltaY', 'metaKey', 'ctrlKey', 'defaultPrevented', 'clientX', 'clientY']

function cloneEvent (e) {
  var obj = {}

  for (var i = 0; i < propertiesToClone.length; i++) {
    obj[propertiesToClone[i]] = e[propertiesToClone[i]]
  }
  return JSON.stringify(obj)
}

// workaround for Electron bug
setTimeout(function () {
  /* Used for swipe gestures */
  window.addEventListener('wheel', function (e) {
    ipc.send('wheel-event', cloneEvent(e))
  })

  var scrollTimeout = null

  window.addEventListener('scroll', function () {
    clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(function () {
      ipc.send('scroll-position-change', Math.round(window.scrollY))
    }, 200)
  })
}, 0)

/* Used for picture in picture item in context menu */
ipc.on('getContextMenuData', function (event, data) {
  // check for video element to show picture-in-picture menu
  var hasVideo = Array.from(document.elementsFromPoint(data.x, data.y)).some(el => el.tagName === 'VIDEO')
  ipc.send('contextMenuData', { hasVideo })
})

ipc.on('enterPictureInPicture', function (event, data) {
  var videos = Array.from(document.elementsFromPoint(data.x, data.y)).filter(el => el.tagName === 'VIDEO')
  if (videos[0]) {
    videos[0].requestPictureInPicture()
  }
})

window.addEventListener('message', function (e) {
  if(e.data && e.data.eventName && e.data.eventName === 'webNotice') {
    ipc.send('webOsNotice', e.data)
  }

  if (!e.origin.startsWith('file://')) {
    return
  }

  if (e.data && e.data.message && e.data.message === 'showCredentialList') {
    ipc.send('showCredentialList')
  }
})


electron.webFrame.executeJavaScript(`
  function copyData(obj, cache = []) {
    // 如果obj是不可变值，就返回
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    // 如果obj被击中，则为圆形结构
    const hit = find(cache, c => c.original === obj);
    if (hit) {
      return hit.copy;
    }

    const copy = Array.isArray(obj) ? [] : {};
    // 先把副本放到缓存里
    // 因为我们想在copyData递归中引用它
    cache.push({
      original: obj,
      copy
    });

    Object.keys(obj).forEach(key => {
      copy[key] = copyData(obj[key], cache);
    });

    return copy;
  }

  function getFavicon(){
    var favicon = undefined;
    var nodeList = document.getElementsByTagName("link");
    for (var i = 0; i < nodeList.length; i++)
    {
      if((nodeList[i].getAttribute("rel") == "icon")||(nodeList[i].getAttribute("rel") == "shortcut icon"))
      {
        favicon = nodeList[i].getAttribute("href");
      }
    }
    return favicon;
  }

  let oldNotice = copyData(window.Notification)
  Notification = function(title, options) {
    //oldNotice.call(this, title, options)
    new oldNotice(title, options)
    window.postMessage({
      eventName: 'webNotice',
      url: new URL(window.origin).hostname,
      title: arguments[0],
      body: arguments[1].body,
      icon: arguments[1].hasOwnProperty('icon') ? arguments[1].icon : null,
      favicon: getFavicon() ? getFavicon() : null
    })
  }

  let prototype = Object(oldNotice.prototype);
  let requestPermission = copyData(oldNotice.requestPermission)
  prototype.constructor = Notification;
  Notification.prototype = prototype;
  Notification.requestPermission = requestPermission
  Notification.permission = 'granted'
`)
