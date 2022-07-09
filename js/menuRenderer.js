/* Handles messages that get sent from the menu bar in the main process */

var webviews = require('webviews.js')
var webviewGestures = require('webviewGestures.js')
var browserUI = require('browserUI.js')
var focusMode = require('focusMode.js')
var modalMode = require('modalMode.js')
var findinpage = require('findinpage.js')
var PDFViewer = require('pdfViewer.js')
var tabEditor = require('navbar/tabEditor.js')
var readerView = require('readerView.js')
var taskOverlay = require('taskOverlay/taskOverlay.js')
const bookmark = require('./extras/bookmark/bookmarkSys')
let settings=require('../js/util/settings/settings')
window.waitOpenTabs=[]

module.exports = {
  initialize: function () {
    ipc.on('zoomIn', function () {
      webviewGestures.zoomWebviewIn(tabs.getSelected())
    })

    ipc.on('zoomOut', function () {
      webviewGestures.zoomWebviewOut(tabs.getSelected())
    })

    ipc.on('zoomReset', function () {
      webviewGestures.resetWebviewZoom(tabs.getSelected())
    })

    ipc.on('print', function () {
      if (PDFViewer.isPDFViewer(tabs.getSelected())) {
        PDFViewer.printPDF(tabs.getSelected())
      } else if (readerView.isReader(tabs.getSelected())) {
        readerView.printArticle(tabs.getSelected())
      } else if (webviews.placeholderRequests.length === 0) {
        // work around #1281 - calling print() when the view is hidden crashes on Linux in Electron 12
        // TODO figure out why webContents.print() doesn't work in Electron 4
        webviews.callAsync(tabs.getSelected(), 'executeJavaScript', 'window.print()')
      }
    })

    ipc.on('findInPage', function () {
      /* Page search is not available in modal mode. */
      if (modalMode.enabled()) {
        return
      }

      findinpage.start()
    })
    //查看源码

    ipc.on('inspectPage', function () {
      webviews.callAsync(tabs.getSelected(), 'toggleDevTools')
    })

    ipc.on('openEditor', function () {
      tabEditor.show(tabs.getSelected())
    })

    ipc.on('showBookmarks', function () {
      ipc.send('handleTsbProtocol',{url:'tsb://app/redirect/?package=com.thisky.fav&url=/'})
      //tabEditor.show(tabs.getSelected(), '!bookmarks ')
    })

    ipc.on('showHistory', function () {
      tabEditor.show(tabs.getSelected(), '!history ')
    })

    ipc.on('duplicateTab', function (e,arg) {
      if (modalMode.enabled()) {
        return
      }

      if (focusMode.enabled()) {
        focusMode.warn()
        return
      }
      if(arg.id){
        browserUI.duplicateTab(tabs.get(arg.id))
      }else
         browserUI.duplicateTab(tabs.get(tabs.getSelected()))
    })

    ipc.on('addTab', function (e, data) {
      /* new tabs can't be created in modal mode */
      if (modalMode.enabled()) {
        return
      }

      /* new tabs can't be created in focus mode */
      if (focusMode.enabled()) {
        focusMode.warn()
        return
      }
      if(!tabs){
        window.waitOpenTabs.push(data.url)
        //如果还没有初始化好tabs，则将此tab放置到要初始化的tabs队列
      }else{
        var newTab = tabs.add({
          url: data.url || ''
        })

        browserUI.addTab(newTab, {
          enterEditMode: !data.url // only enter edit mode if the new tab is empty
        })
      }

    })

    //定位到task组的某tabid，往后插入创建tab
    ipc.on('toTaskAddTab', (event, arg) => {
      if(arg.tab.id) {
        //右键移动的操作
        let newTask = tasks.get(arg.taskId)

        //移除老的
        let previousTask = tasks.getSelected()
        previousTask.tabs.splice(previousTask.tabs.getIndex(arg.tab.id), 1)

        //插入新的
        newTask.tabs.splice(arg.tabIndex + 1, 0, arg.tab)
        ipc.send('closeTaskSelect')
        browserUI.switchToTask(arg.taskId)

      } else {
        //购物车应用的操作
        let newTab = tasks.get(arg.taskId).tabs.add({
          url: arg.tab.url,
          title: arg.tab.name
        }, {}, arg.tabIndex)

        browserUI.addTab(newTab, {
          enterEditMode: false,
          openInBackground: !settings.get('openTabsInForeground')
        })
      }
    })


    var myVar = setInterval(function(){
      var valueStr
      settings.listen('filteringBlockedCount', function (value) {
        var count = value || 0
        if (count > 50000) {
          valueStr = new Intl.NumberFormat(navigator.locale, { notation: 'compact', maximumSignificantDigits: 4 }).format(count)
        } else {
          valueStr = new Intl.NumberFormat().format(count)
        }
      })
      ipc.send('valueCount',valueStr)
      if(valueStr>'2,000'){
        clearInterval(myVar)
      }
    },1000)



    ipc.on('blockSetting',(event,args)=>{
      let value = {}
      value.blockingLevel = args
      settings.set('filtering', value)
      updateBlockingLevelUI(args)
    })

    settings.get('siteTheme', function (value) {
      if (value === true || value === undefined) {
        siteThemeCheckbox.checked = true
      } else {
        siteThemeCheckbox.checked = false
      }
    })

    ipc.on('themeSelect',(event,args)=>{
      settings.set('siteTheme', args)
    })

    ipc.on('selectEngine',(event,args)=>{
      settings.get('searchEngine')

      settings.set('searchEngine',{ name: args })
    })


    ipc.on('saveCurrentPage', async function () {
      var currentTab = tabs.get(tabs.getSelected())

      // new tabs cannot be saved
      if (!currentTab.url) {
        return
      }

      // if the current tab is a PDF, let the PDF viewer handle saving the document
      if (PDFViewer.isPDFViewer(tabs.getSelected())) {
        PDFViewer.savePDF(tabs.getSelected())
        return
      }

      if (tabs.get(tabs.getSelected()).isFileView) {
        webviews.callAsync(tabs.getSelected(), 'downloadURL', [tabs.get(tabs.getSelected()).url])
      } else {
        var savePath = await ipc.invoke('showSaveDialog', {
          defaultPath: currentTab.title.replace(/[/\\]/g, '_')
        })

        // savePath will be undefined if the save dialog is canceled
        if (savePath) {
          if (!savePath.endsWith('.html')) {
            savePath = savePath + '.html'
          }
          webviews.callAsync(tabs.getSelected(), 'savePage', [savePath, 'HTMLComplete'])
        }
      }
    })

    ipc.on('saveViewCapture',()=>{
      ipc.send('saveViewCapture', { id: tabs.getSelected() })
    })

    ipc.on('saveViewFullCapture',()=>{
      ipc.send('saveViewFullCapture', { id: tabs.getSelected() })
    })

    ipc.on('saveCurrentPageToPdf', async function () {
      var currentTab = tabs.get(tabs.getSelected())

      // new tabs cannot be saved
      if (!currentTab.url) {
        return
      }

      // if the current tab is a PDF, let the PDF viewer handle saving the document
      if (PDFViewer.isPDFViewer(tabs.getSelected())) {
        PDFViewer.savePDF(tabs.getSelected())
        return
      }

      if (tabs.get(tabs.getSelected()).isFileView) {
        webviews.callAsync(tabs.getSelected(), 'downloadURL', [tabs.get(tabs.getSelected()).url])
      } else {
        var savePath = await ipc.invoke('showSaveDialog', {
          defaultPath: currentTab.title.replace(/[/\\]/g, '_')+'.pdf'
        })

        // savePath will be undefined if the save dialog is canceled
        if (savePath) {
          if (!savePath.endsWith('.pdf')) {
            savePath = savePath + '.pdf'
          }
          // webviews.callAsync(tabs.getSelected(), 'printToPDF', [savePath])
          ipc.send('printToPDF',{'id':tabs.getSelected(),savePath})
        }
      }
    })
    ipc.on('addPrivateTab', function () {
      /* new tabs can't be created in modal mode */
      if (modalMode.enabled()) {
        return
      }

      /* new tabs can't be created in focus mode */
      if (focusMode.enabled()) {
        focusMode.warn()
        return
      }

      browserUI.addTab(tabs.add({
        private: true
      }))
    })

    ipc.on('toggleTaskOverlay', function () {
      taskOverlay.toggle()
    })

    ipc.on('goBack', function () {
      webviews.callAsync(tabs.getSelected(), 'goBack')
    })

    ipc.on('goForward', function () {
      webviews.callAsync(tabs.getSelected(), 'goForward')
    })

    ipc.on('bookmarkMigration', (event, args) => {
      bookmark.oldImport(args)
    })
  }
}
