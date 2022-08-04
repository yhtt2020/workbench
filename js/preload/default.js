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


if(location.href.startsWith('https://chrome.google.com/webstore')){
   injectChromeWebstoreInstallButton= ()=> {
    const baseUrl =
      'https://clients2.google.com/service/update2/crx?response=redirect&acceptformat=crx2,crx3&prodversion=%VERSION&x=id%3D%ID%26installsource%3Dondemand%26uc';
    const ibText = '安装到想天浏览器';
    const ibTemplate =
      '<div role="button" class="dd-Va g-c-wb g-eg-ua-Uc-c-za g-c-Oc-td-jb-oa g-c" aria-label="' +
      ibText +
      '" tabindex="0" style="user-select: none;"><div class="g-c-Hf"><div class="g-c-x"><div class="g-c-R  webstore-test-button-label">' +
      ibText +
      '</div></div></div></div>';

    console.log('导入谷歌商店proload')
    function waitForCreation(selector, callback) {
      const element = document.querySelector(selector);
      if (element != null) {
        callback(element);
      } else {
        setTimeout(() => {
          waitForCreation(selector, callback);
        }, 50);
      }
    }

    waitForCreation('.h-F-f-k.F-f-k', (element) => {
      element.addEventListener('DOMNodeInserted', (event) => {
        if (event.relatedNode != element) return;

        setTimeout(() => {
          console.log('before enter function ')
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          InstallButton( event.target.querySelector('.h-e-f-Ra-c.e-f-oh-Md-zb-k'),)

          // new (InstallButton as any)(
          //  ,
          // );
        }, 10);
      });
    });

    document.addEventListener('DOMNodeInserted', (event) => {
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        Array.from(document.getElementsByClassName('a-na-d-K-ea')).forEach(
          (el) => {
            el.parentNode.removeChild(el);
          },
        );
      }, 10);
    });

    function installPlugin(
      id,
      version = navigator.userAgent.match(/(?<=Chrom(e|ium)\/)\d+\.\d+/)[0],
    ) {
      window.location.href = baseUrl
        .replace('%VERSION', version)
        .replace('%ID', id);
    }


    function InstallButton(
      wrapper,
      id = document.URL.match(/(?<=\/)(\w+)(\?|$)/)[1],
    ) {
      if (wrapper == null) return;
      wrapper.innerHTML += ibTemplate;
      this.DOM = wrapper.children[0];

      console.log('run this.dom')
      /* Styling */
      this.DOM.addEventListener('mouseover', () => {
        this.DOM.className =
          'dd-Va g-c-wb g-eg-ua-Uc-c-za g-c-0c-td-jb-oa g-c g-c-l';
      });
      this.DOM.addEventListener('mouseout', () => {
        this.DOM.className = 'dd-Va g-c-wb g-eg-ua-Uc-c-za g-c-Oc-td-jb-oa g-c';
      });
      this.DOM.addEventListener('mousedown', () => {
        this.DOM.className =
          'dd-Va g-c-wb g-eg-ua-Uc-c-za g-c-Oc-td-jb-oa g-c g-c-Xc g-c-Sc-ci g-c-l g-c-Bd';
      });
      this.DOM.addEventListener('mouseup', () => {
        this.DOM.className =
          'dd-Va g-c-wb g-eg-ua-Uc-c-za g-c-0c-td-jb-oa g-c g-c-l';
      });
      this.DOM.addEventListener('click', () => {
        installPlugin(id);
      });
    }
  }
  injectChromeWebstoreInstallButton()
}
document.ondrop=function (e){
  console.log(e.dataTransfer.getData('url'))
  ipc.send('onDropUrl', { url:e.dataTransfer.getData('url') })
}

document.ondragover=function (e){
  e.preventDefault()
}
