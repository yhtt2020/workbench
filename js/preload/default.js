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



ipc.on('get-content-size', function() {
  var height = Math.max( document.body.scrollHeight, document.body.offsetHeight,
    document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight );
  ipc.send('return-content-size', {
    width: window.innerWidth,
    height: height,
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth,
    scrollBarWidth: window.innerWidth - document.body.clientWidth
  });
});
let fixedElements=[]
let needShow=[]
function getFixed(){
  fixedElements=[]
  needShow=[]
  var elems = document.body.getElementsByTagName("*");
  var len = elems.length
  for (var i=0;i<len;i++) {
    if (window.getComputedStyle(elems[i],null).getPropertyValue('position') == 'fixed') {
      fixedElements.push(elems[i])
    }
  }
}
// /**
//  * 判断元素是否可见
//  * @param el{dom}: dom元素
//  * @eg: isVisible(document.querySelector(cssSelector));
//  **/
// function isVisible(el) {
//   var loopable = true,
//     visible = window.getComputedStyle(el).display != 'none' && window.getComputedStyle(el).visibility != 'hidden';
//
//   while(loopable && visible) {
//     el = el.parentNode;
//
//     if(el && el != document.body) {
//       visible = window.getComputedStyle(el).display != 'none' && window.getComputedStyle(el).visibility != 'hidden';
//     }else {
//       loopable = false;
//     }
//   }
//
//   return visible;
// }
ipc.on('move-page-to', function(events, page) {
  var height = Math.max( document.body.scrollHeight, document.body.offsetHeight,
    document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight );
  if(page===1){
    getFixed()
  }else if(page>1 && window.innerHeight * page <=height){
    //隐藏页面元素
    fixedElements.forEach(ele=>{
        ele.hidden=true
        needShow.push(ele)
    })
  }else{
    needShow.forEach(ele=>{
      ele.hidden=false
    })
  }

  window.scrollTo(0, window.innerHeight * (page - 1) )
  setTimeout(function() {
    ipc.send('return-move-page', page);
  }, 100)
});
