const webviews = require('webviews.js')
const urlParser = require('util/urlParser.js')
const sideBar={
  minSizeCss:'45px',
  maxSizeCss:'145px',
  minWidth:45,
  maxWidth:145,
  expandWidth:100,
  mod:'auto',// auto.自动展开收起, open.一直展开 ,最小化。
  //切换侧边栏模式
  switchSideMod(){
    function setIcon(icon){
      toolbar.sideModeButton.src=icon
    }
    function setTitle(title){
      toolbar.sideModeButton.title=title
    }
    switch (sideBar.mod){
      case 'auto':
        // 切换到展开
        //更换图标
        ipc.send('sideSetOpen')
        setIcon('./icons/toolbar/sideopen.svg')
        sideBar.mod='open'
        setTitle('当前模式：展开模式；点击切换到自动模式')
        sideBar.setToMax()
        break
      case 'close':
        // 切换到自动模式
        ipc.send('sideSetAuto')
        //更换图标
        setIcon('./icons/toolbar/sideauto.svg')
        sideBar.mod='auto'
        setTitle('当前模式：自动展开收起；点击切换收起左侧栏，不再自动展开')
        sideBar.setToMin()
        //更换模式
        break
      //更换模式
      case 'open':
        // 切换到关闭
        ipc.send('sideSetClose')
        //更换图标
        setIcon('./icons/toolbar/sideclose.svg')
        sideBar.mod='close'
        setTitle('当前模式：精简模式；点击切换到展开模式')//设置提示文字
        sideBar.setToMin()
    }
  },
  /**
   * 将侧边栏模式更改为展开
   */
  setToMax(){
    let posLeft = sideBar.minWidth+sideBar.expandWidth
    sideBar.setLayoutLeft(posLeft)
  },
  setLayoutLeft(posLeft){
    let postLeftCss= String(posLeft)+'px'
    document.getElementById('mouseRcoverArea').style.width=postLeftCss//调整左侧的感应区大小
    //调整主界面中各个组件的位置
    //设置工具栏位置
    toolbar.toolbarEl.style.left=postLeftCss//调整webviews框的位置
    toolbar.toolbarEl.style.width= 'calc(100vw - '+postLeftCss+')'
    //设置webviews位置
    const adjustLeft= posLeft - webviews.viewMargins[3]
    webviews.adjustMargin([0, 0, 0, adjustLeft])//调整工具栏左侧
    //设置搜索栏的左侧位置
    document.getElementById('searchbar').style.left='calc((100% - '+postLeftCss+' )*0.02 + '+postLeftCss+' )'
    document.getElementById('searchbar').style.width='calc( (100% - '+postLeftCss+' ) * 0.96)'
    //设置overlay的左侧
    document.getElementById('webview-placeholder').style.marginLeft=postLeftCss
    document.getElementById('webview-placeholder').style.width='calc(100% - '+postLeftCss+')'
    //调整密码提示的左侧位置
    document.getElementById('password-capture-bar').style.left=postLeftCss
    document.getElementById('password-capture-bar').style.width='calc(100% - '+postLeftCss+')'
    //调整下载框的左侧位置
    document.getElementById('download-bar').style.left=postLeftCss
    document.getElementById('download-bar').style.width='calc(100% - '+postLeftCss+')'
  },
  setToMin(){
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

const toolbar = {
  expanded: true,
  sideModeButton:document.getElementById('side-mod-button-toolbar'),
  toolbarEl: document.getElementById('toolbar'),
  homeButton: document.getElementById('home-button-toolbar'),
  refreshButton: document.getElementById('refresh-button-toolbar'),
  forwardButton: document.getElementById('forward-button-toolbar'),
  backButton: document.getElementById('back-button-toolbar'),
  collapseButton: document.getElementById('collapse-button-toolbar'),
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
  updateScriptsCountTip(tabId=tabs.getSelected().id){
    matchedScripts= window.$matchedScriptsForSite[tabId]
    if(!!!matchedScripts){
      matchedScripts=[]
    }
    scriptCountEl= document.getElementById('scriptCount')
    scriptCountEl.hidden=!(matchedScripts.length>0)
    scriptCountEl.innerText=String(matchedScripts.length)
    scriptCountEl.title='共有'+matchedScripts.length+'个脚本生效中'
  },
  //设置密码管理器是否可用
  setPwdCanUse (canUse) {
    const pwdEl = document.getElementById('pwd-toolbar')
    if (!canUse) {
      toolbar.setElOpacity(pwdEl, 0.5)
      pwdEl.title = '密码管理器（内部页面不可用）'
      pwdEl.disabled = true
    } else {
      toolbar.setElOpacity(pwdEl, 1)
      pwdEl.style.opacity = 1
      pwdEl.title = '密码管理器'
      pwdEl.disabled = false
    }
  },
  //设置一个元素的透明度
  setElOpacity (el, opacity = 1) {
    el.style.opacity = opacity
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

    toolbar.sideModeButton.addEventListener('click',sideBar.switchSideMod)

    toolbar.collapseButton.addEventListener('click', () => {
      toolbar.expanded = false
      toolbar.toolbarEl.hidden = true
      document.getElementById('searchbar').style.top = ` calc(var(--control-space-top) + 36px )`
      document.getElementById('tab-editor').hidden = true
      document.getElementById('tabs').insertBefore(document.getElementById('tab-editor'), document.getElementById('tabs').children[0])
      webviews.viewMargins = [document.getElementById('toolbar').hidden ? 0 : 40, 0, 0, 45]
      webviews.adjustMargin([0, 0, 0, 0])
      document.getElementById('toolbar-navigation-buttons').hidden = false
    })
    if (toolbar.expanded) {
      document.getElementById('address-bar').appendChild(document.getElementById('tab-editor'))
      document.getElementById('searchbar').style.top = ` calc(var(--control-space-top) + 36px + 40px )`
      document.getElementById('tab-editor').hidden = false
      document.getElementById('toolbar-navigation-buttons').hidden = true
    }
  }
}
toolbar.initialize()





module.exports = toolbar
