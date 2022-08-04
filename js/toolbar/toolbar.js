const webviews = require('webviews.js')
const urlParser = require('util/urlParser.js')
const settings = require('../util/settings/settings.js')

const sideBar = {
  minSizeCss: '45px',
  maxSizeCss: '145px',
  minWidth: 45,
  maxWidth: 145,
  expandWidth: 100,
  mod: 'close',// auto.自动展开收起, open.一直展开 ,最小化。
  isMessageFixed: false,
  //切换侧边栏模式
  switchSideMod () {

    switch (sideBar.mod) {
      case 'auto':
        // 切换到展开
        //更换图标
        ipc.send('sideSetOpen')
        sideBar.mod = 'open'
        break
      case 'close':
        if(sideBar.isMessageFixed) {
          ipc.send('message',{type:"error",config:{content:'消息中心固定状态下无法切换,请取消固定状态'}})
          break
        }
        // 切换到自动模式
        ipc.send('sideSetAuto')
        //更换图标
        sideBar.mod = 'auto'
        //更换模式
        break
      //更换模式
      case 'open':
        // 切换到关闭
        ipc.send('sideSetClose')
        //更换图标
        sideBar.mod = 'close'
        break
    }
    sideBar.syncMod()
  },
  setIcon (icon) {
    toolbar.sideModeButton.src = icon
  },
  setTitle (title) {
    toolbar.sideModeButton.title = title
  },
  /**
   * 同步模式的左侧栏
   */
  syncMod () {
    switch (sideBar.mod) {
      case 'auto':
        sideBar.setIcon('./icons/toolbar/sideauto.svg')
        sideBar.setTitle('当前模式：自动展开收起；点击切换收起左侧栏，不再自动展开')
        sideBar.setToMin()
        break
      case 'open':
        sideBar.setIcon('./icons/toolbar/sideopen.svg')
        sideBar.setTitle('当前模式：展开模式；点击切换到自动模式')
        sideBar.setToMax()
        break
      case 'close':
        sideBar.setIcon('./icons/toolbar/sideclose.svg')
        sideBar.setTitle('当前模式：精简模式；点击切换到展开模式')//设置提示文字
        sideBar.setToMin()

    }
  },
  /**
   * 将侧边栏模式更改为展开
   */
  setToMax () {
    let posLeft = sideBar.minWidth + sideBar.expandWidth
    sideBar.setLayoutLeft(posLeft)
  },
  setLayoutLeft (posLeft) {
    let postLeftCss = String(posLeft) + 'px'
    //调整主界面中各个组件的位置
    if(sideBar.isMessageFixed) {
      postLeftCss = String(posLeft + 300) + 'px'
      //设置webviews位置
      const adjustLeft = posLeft - webviews.viewMargins[3] + 300
      webviews.adjustMargin([0, 0, 0, adjustLeft])//调整工具栏左侧
    } else {
      //设置webviews位置
      const adjustLeft = posLeft - webviews.viewMargins[3]
      webviews.adjustMargin([0, 0, 0, adjustLeft])//调整工具栏左侧
    }
    document.getElementById('mouseRcoverArea').style.width = postLeftCss//调整左侧的感应区大小
    //设置工具栏位置
    toolbar.toolbarEl.style.left = postLeftCss//调整webviews框的位置
    toolbar.toolbarEl.style.width = 'calc(100vw - ' + postLeftCss + ')'
    //设置搜索栏的左侧位置
    document.getElementById('searchbar').style.left = 'calc((100% - ' + postLeftCss + ' )*0.02 + ' + postLeftCss + ' )'
    document.getElementById('searchbar').style.width = 'calc( (100% - ' + postLeftCss + ' ) * 0.96)'
    //设置overlay的左侧
    document.getElementById('webview-placeholder').style.marginLeft = postLeftCss
    document.getElementById('webview-placeholder').style.width = 'calc(100% - ' + postLeftCss + ')'
    //调整密码提示的左侧位置
    document.getElementById('password-capture-bar').style.left = postLeftCss
    document.getElementById('password-capture-bar').style.width = 'calc(100% - ' + postLeftCss + ')'
    //调整下载框的左侧位置
    // document.getElementById('download-bar').style.left = postLeftCss
    // document.getElementById('download-bar').style.width = 'calc(100% - ' + postLeftCss + ')'
  },
  setToMin () {
    let posLeft = sideBar.minWidth
    //发送ipc消息给侧边栏，告诉他要切换到open模式
    sideBar.setLayoutLeft(posLeft)
    // document.getElementById('mouseRcoverArea').style.width='45px'
    // toolbar.toolbarEl.style.left='45px'
    // toolbar.toolbarEl.style.width='calc(100vw - 45px)'
    // webviews.adjustMargin([0, 0, 0, -sideBar.expandWidth])
    // document.getElementById('searchbar').style.left='calc((100% - 45px )*0.02 + 45px )'
    // document.getElementById('searchbar').style.width='calc( (100% - 45px ) * 0.96)'
    // document.getElementById('webview-placeholder').style.width='calc(100% - 45px)'
    // document.getElementById('webview-placeholder').style.left='45px'
  }
}
window.sideBar=sideBar

ipc.on('openToolbar',()=>{
  document.getElementById('password-capture-bar').style.top = -36+'px'
  if (sideBar.mod==='close' || sideBar.mod==='auto'){
    toolbar.expanded = true
    toolbar.toolbarEl.hidden = false
    document.getElementById('searchbar').style.top = ` calc(var(--control-space-top) + 36px + 40px )`
    document.getElementById('tab-editor').hidden = false
    // document.getElementById('tabs').insertBefore(document.getElementById('tab-editor'), document.getElementById('tabs').children[0]).hidden = true
    webviews.viewMargins = [document.getElementById('toolbar').hidden ? 0 : 40, 0, 0, 45]
    webviews.adjustMargin([0, 0, 0, 0])
    document.getElementById('address-bar').appendChild(document.getElementById('tab-editor'))
    document.getElementById('toolbar-navigation-buttons').hidden = true
  }
  if(sideBar.mod==='open'){
    toolbar.expanded = true
    toolbar.toolbarEl.hidden = false
    document.getElementById('searchbar').style.top = ` calc(var(--control-space-top) + 36px + 40px )`
    document.getElementById('tab-editor').hidden = false
    // document.getElementById('tabs').insertBefore(document.getElementById('tab-editor'), document.getElementById('tabs').children[0]).hidden = true
    webviews.viewMargins = [document.getElementById('toolbar').hidden ? 0 : 40, 0, 0, 45]
    webviews.adjustMargin([0, 0, 0,100])
    document.getElementById('address-bar').appendChild(document.getElementById('tab-editor'))
    document.getElementById('toolbar-navigation-buttons').hidden = true
  }

  if(settings.get('thirdToolbar') == 'show') {
    document.querySelector('#third-toolbar').hidden = false
    webviews.autoAdjustMargin()
  }

})

ipc.on('hideToolbar',()=>{

  setTimeout(function () {
    ipc.invoke('showToolbarDialog')
  }, 16)
  if(sideBar.mod==='close' || sideBar.mod==='auto'){
    toolbar.expanded = false
    toolbar.toolbarEl.hidden = true
    document.getElementById('searchbar').style.top = ` calc(var(--control-space-top) + 36px )`
    document.getElementById('tab-editor').hidden = true
    document.getElementById('tabs').insertBefore(document.getElementById('tab-editor'), document.getElementById('tabs').children[0])
    webviews.viewMargins = [document.getElementById('toolbar').hidden ? 0 : 40, 0, 0, 45]
    webviews.adjustMargin([0, 0, 0, 0])
    document.getElementById('toolbar-navigation-buttons').hidden = false
  }
  if(sideBar.mod==='open'){
    toolbar.expanded = false
    toolbar.toolbarEl.hidden = true
    document.getElementById('searchbar').style.top = ` calc(var(--control-space-top) + 36px )`
    document.getElementById('tab-editor').hidden = true
    document.getElementById('tabs').insertBefore(document.getElementById('tab-editor'), document.getElementById('tabs').children[0])
    webviews.viewMargins = [document.getElementById('toolbar').hidden ? 0 : 40, 0,0,45]
    webviews.adjustMargin([0, 0, 0, 100])
    document.getElementById('toolbar-navigation-buttons').hidden = false
  }
})


const toolbar = {
  expanded: true,
  sideModeButton: document.getElementById('side-mod-button-toolbar'),
  toolbarEl: document.getElementById('toolbar'),
  thirdToolbarEl: document.querySelector('#third-toolbar'),
  homeButton: document.getElementById('home-button-toolbar'),
  refreshButton: document.getElementById('refresh-button-toolbar'),
  forwardButton: document.getElementById('forward-button-toolbar'),
  backButton: document.getElementById('back-button-toolbar'),
  collapseButton: document.getElementById('collapse-button-toolbar'),
  startPageButton:document.getElementById('start-button-toolbar'),
  readEl : document.getElementById('read-toolbar'),
  //地址输入框焦点
  focusInput () {
    if ($toolbar.expanded && document.getElementById('searchbar').hidden) {
      //如果是toolbar展开模式，input获得焦点则触发事件
      require('../navbar/tabEditor.js').show(tabs.getSelected())
    }
  },
  //设置移动模式是否可用
  setMobileCanUse (canUse) {
    const mobileEl = document.getElementById('mobile-toolbar')
    if (!canUse) {
      toolbar.setElOpacity(mobileEl, 0.5)
      mobileEl.title = '手机浏览模式（内部页面不可用）'
      mobileEl.disable = true
    } else {
      toolbar.setElOpacity(mobileEl, 1)
      mobileEl.style.opacity = 1
      mobileEl.title = '手机浏览模式'
      mobileEl.disable = false
    }
  },
  updateStartPage(){
    let tabData=tabs.get(tabs.getSelected())
    if(tabData.lock){
      toolbar.startPageButton.parentElement.hidden=false
      if(tabData.startPage===tabData.url){
        toolbar.startPageButton.classList.add('disable')
      }else{
        toolbar.startPageButton.classList.remove('disable')
      }
    }else{
      toolbar.startPageButton.parentElement.hidden=true
    }
  },
  updateScriptsCountTip (tabId = tabs.getSelected().id) {
    matchedScripts = window.$matchedScriptsForSite[tabId]
    if (!!!matchedScripts) {
      matchedScripts = []
    }
    scriptCountEl = document.getElementById('scriptCount')
    scriptCountEl.hidden = !(matchedScripts.length > 0)
    scriptCountEl.innerText = String(matchedScripts.length)
    scriptCountEl.title = '共有' + matchedScripts.length + '个脚本生效中'
  },
  //设置密码管理器是否可用
  setPwdCanUse (canUse) {
    const pwdEl = document.getElementById('pwd-toolbar')
    if (!canUse) {
      toolbar.setElOpacity(pwdEl, 0.5)
      pwdEl.title = '密码管理器（内部页面不可用）'
      pwdEl.style.pointerEvents='none'
    } else {
      toolbar.setElOpacity(pwdEl, 1)
      pwdEl.style.opacity = 1
      pwdEl.title = '密码管理器'
      pwdEl.style.pointerEvents='auto'
    }
  },
  //设置一个元素的透明度
  setElOpacity (el, opacity = 1) {
    el.style.opacity = opacity
  },

  //设置阅读模式是否可用
  setCanRead (canRead) {

    if (!canRead) {
      toolbar.setElOpacity(toolbar.readEl, 0.5)
      toolbar.readEl.title = '阅读模式（内部页面不可用）'
      toolbar.readEl.style.pointerEvents='none'
    } else {
      toolbar.readEl.style.pointerEvents='auto'
      toolbar.setElOpacity(toolbar.readEl, 1)
      toolbar.readEl.style.opacity = 1
      toolbar.readEl.title = '阅读模式'
    }
  },


  initialize: function () {
    window.$toolbar = toolbar
    toolbar.homeButton.addEventListener('click', () => {
      require('browserUI.js').addTab(tabs.add({}))
    })
    toolbar.refreshButton.addEventListener('click', () => [
      webviews.update(tabs.getSelected(), urlParser.parse(tabs.get(tabs.getSelected()).url))
    ])

    toolbar.forwardButton.addEventListener('click', function () {
      webviews.callAsync(tabs.getSelected(), 'goForward')
    })
    toolbar.backButton.addEventListener('click', function () {
      webviews.goBackIgnoringRedirects(tabs.getSelected())
    })

    toolbar.sideModeButton.addEventListener('click', sideBar.switchSideMod)

    toolbar.collapseButton.addEventListener('click', () => {
      ipc.send('changeToolbar')
      setTimeout(function () {
        ipc.invoke('showToolbarDialog')
      }, 16)
      document.getElementById('password-capture-bar').style.top = 36+'px'
      if(sideBar.mod==='close' || sideBar.mod==='auto'){
        toolbar.expanded = false
        toolbar.toolbarEl.hidden = true
        document.getElementById('searchbar').style.top = ` calc(var(--control-space-top) + 36px )`
        document.getElementById('tab-editor').hidden = true
        document.getElementById('tabs').insertBefore(document.getElementById('tab-editor'), document.getElementById('tabs').children[0])
        webviews.viewMargins = [document.getElementById('toolbar').hidden ? 0 : 40, 0, 0, 45]
        webviews.adjustMargin([0, 0, 0, 0])
        document.getElementById('toolbar-navigation-buttons').hidden = false
      }
      if(sideBar.mod==='open' ){
        toolbar.expanded = false
        toolbar.toolbarEl.hidden = true
        document.getElementById('searchbar').style.top = ` calc(var(--control-space-top) + 36px )`
        document.getElementById('tab-editor').hidden = true
        document.getElementById('tabs').insertBefore(document.getElementById('tab-editor'), document.getElementById('tabs').children[0])
        webviews.viewMargins = [document.getElementById('toolbar').hidden ? 0 : 40, 0,0,45]
        webviews.adjustMargin([0, 0, 0, 100])
        document.getElementById('toolbar-navigation-buttons').hidden = false
      }
    })
    if (toolbar.expanded) {
      document.getElementById('address-bar').appendChild(document.getElementById('tab-editor'))
      document.getElementById('searchbar').style.top = ` calc(var(--control-space-top) + 36px + 40px )`
      document.getElementById('tab-editor').hidden = false
      document.getElementById('toolbar-navigation-buttons').hidden = true
    }
    toolbar.adjustSideBar()

    toolbar.startPageButton.addEventListener('click',()=>{
      if(toolbar.startPageButton.classList.contains('disable')){
        return
      }
      let tabData=tabs.get(tabs.getSelected())
      if(tabData.startPage){
        webviews.update(tabs.getSelected(), tabData.startPage)
      }else{
        if(confirm('此标签锁定在返回起始页功能推出前，无法返回到起始页。是否将当前位置设置为起始页？')){
          tabs.update(tabs.getSelected(),{startPage:tabData.url})
        }
      }
    })

  },

  adjustSideBar () {
    sideBar.mod = localStorage.getItem('sideMode') ?? 'auto'
    sideBar.isMessageFixed = localStorage.getItem('isMessageFixed') == 'true' ? true : false
    sideBar.syncMod()
  }

}
toolbar.initialize()

ipc.on('adjustByFixed', () => {
  sideBar.isMessageFixed = true
  if(sideBar.mod === 'open') {
    sideBar.setToMax()
  } else {
    sideBar.setToMin()
  }
})

ipc.on('freeAdjustByFixed', () => {
  sideBar.isMessageFixed = false
  if(sideBar.mod === 'open') {
    sideBar.setToMax()
  } else {
    sideBar.setToMin()
  }
})
ipc.on('sideSetMod',(event,args)=>{
  switch (args.mod){
    case 'open':
      sideBar.setToMax()
      break
    case 'close':
      sideBar.setToMin()
      break
    case 'auto':
      sideBar.setToMin()
      break
  }
})
ipc.on('temporaryAdjust', (event, args) => {
  if(args.freeFixed) {
    if(sideBar.mod === 'open') {
      sideBar.isMessageFixed = false
      localStorage.setItem("isMessageFixed", false)
      sideBar.setToMax()
    } else {
      sideBar.isMessageFixed = false
      localStorage.setItem("isMessageFixed", false)
      sideBar.setToMin()
    }
  } else {
    if(sideBar.mod === 'open') {
      sideBar.isMessageFixed = true
      localStorage.setItem("isMessageFixed", true)
      sideBar.setToMax()
    } else {
      sideBar.isMessageFixed = true
      localStorage.setItem("isMessageFixed", true)
      sideBar.setToMin()
    }
  }
})

ipc.on('hideThirdToolbar', () => {
  document.querySelector('#third-toolbar').hidden = true
  settings.set('thirdToolbar', 'hidden')
  webviews.autoAdjustMargin()
})

ipc.on('showThirdToolbar', () => {
  document.querySelector('#third-toolbar').hidden = false
  settings.set('thirdToolbar', 'show')
  webviews.autoAdjustMargin()
})

if(settings.get('thirdToolbar') === 'show') {
  document.querySelector('#third-toolbar').hidden = false
  webviews.autoAdjustMargin()
}

module.exports = toolbar
