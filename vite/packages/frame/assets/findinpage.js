// var webviews = require('webviews.js')
// var keybindings = require('keybindings.js')
// var PDFViewer = require('pdfViewer.js')

var findinpage = {
  container: document.getElementById('findinpage-bar'),
  input: document.getElementById('findinpage-input'),
  counter: document.getElementById('findinpage-count'),
  previous: document.getElementById('findinpage-previous-match'),
  next: document.getElementById('findinpage-next-match'),
  endButton: document.getElementById('findinpage-end'),
  activeTab: null,
  sendIPC(event,args){
    args.id=window.id
    ipc.send(event,args)
  },
  start: function () {
    //webviews.releaseFocus()
    findinpage.sendIPC('releaseFocus',{})
    findinpage.input.placeholder = '在页面内搜索'
    findinpage.input.focus()

    findinpage.activeTab = window.id

    /* special case for PDF viewer */

    // if (PDFViewer.isPDFViewer(findinpage.activeTab)) {
    //   PDFViewer.startFindInPage(findinpage.activeTab)
    // }

    findinpage.counter.textContent = ''
    findinpage.container.style.display='flex'
    findinpage.input.focus()
    findinpage.input.select()
    document.getElementById('titleBar').style.display='none'
    if (findinpage.input.value) {
      findinpage.sendIPC('saAppFindInPage',{'text':findinpage.input.value,findNext:true})
      //webviews.callAsync(findinpage.activeTab, 'findInPage', findinpage.input.value)
    }
  },
  end: function (options) {
    options = options || {}
    var action = options.action || 'keepSelection'

    findinpage.container.style.display='none'
    document.getElementById('titleBar').style.display='flex'

    if (findinpage.activeTab) {
      console.log('satstowad')
      findinpage.sendIPC('saAppStopFindInPage',{'action':action})
      //webviews.callAsync(findinpage.activeTab, 'stopFindInPage', action)

      /* special case for PDF viewer */
      // if (tabs.get(findinpage.activeTab) && PDFViewer.isPDFViewer(findinpage.activeTab)) {
      //   PDFViewer.endFindInPage(findinpage.activeTab)
      // }

      findinpage.sendIPC('saAppFocusView',{})
      //webviews.callAsync(findinpage.activeTab, 'focus')
    }

    findinpage.activeTab = null
  }
}

findinpage.input.addEventListener('click', function () {
  //webviews.releaseFocus()
})

findinpage.endButton.addEventListener('click', function () {
  findinpage.end()
})

findinpage.input.addEventListener('input', function (e) {
  if (this.value) {
    findinpage.sendIPC('saAppFindInPage',{'text':findinpage.input.value,findNext:false})
    //webviews.callAsync(findinpage.activeTab, 'findInPage', findinpage.input.value)
  }
})

findinpage.input.addEventListener('keypress', function (e) {
  if (e.keyCode === 13) { // Return/Enter key
    findinpage.sendIPC('saAppFindInPage',{'text':findinpage.input.value,forward:!e.shiftKey,findNext:false})
    // webviews.callAsync(findinpage.activeTab, 'findInPage', [findinpage.input.value, {
    //   forward: !e.shiftKey, // find previous if Shift is pressed
    //   findNext: false
    // }])
  }
})

findinpage.previous.addEventListener('click', function (e) {
  // webviews.callAsync(findinpage.activeTab, 'findInPage', [findinpage.input.value, {
  //   forward: false,
  //   findNext: false
  // }])
  findinpage.sendIPC('saAppFindInPage',{'text':findinpage.input.value,forward:false,findNext:false})
  findinpage.input.focus()
})

findinpage.next.addEventListener('click', function (e) {
  // webviews.callAsync(findinpage.activeTab, 'findInPage', [findinpage.input.value, {
  //   forward: true,
  //   findNext: false
  // }])
  findinpage.sendIPC('saAppFindInPage',{'text':findinpage.input.value,forward:true,findNext:false})
  findinpage.input.focus()
})

// webviews.bindEvent('view-hidden', function (tabId) {
//   if (tabId === findinpage.activeTab) {
//     findinpage.end()
//   }
// })
//
// webviews.bindEvent('did-start-navigation', function (tabId, url, isInPlace, isMainFrame, frameProcessId, frameRoutingId) {
//   if (!isInPlace && tabId === findinpage.activeTab) {
//     findinpage.end()
//   }
// })
//

ipc.on('found-in-page',(event,args)=>{
  if (args.data.matches !== undefined) {
    var text
    if (args.data.matches === 1) {
      text = l('findMatchesSingular')
    } else {
      text = l('findMatchesPlural')
    }
  }
  findinpage.counter.textContent = text.replace('%i', args.data.activeMatchOrdinal).replace('%t', args.data.matches)
})
// webviews.bindEvent('found-in-page', function (tabId, data) {
//   if (data.matches !== undefined) {
//     var text
//     if (data.matches === 1) {
//       text = l('findMatchesSingular')
//     } else {
//       text = l('findMatchesPlural')
//     }
//   }
// })
//
// keybindings.defineShortcut('followLink', function () {
//   findinpage.end({ action: 'activateSelection' })
// })
//
// keybindings.defineShortcut({ keys: 'esc' }, function (e) {
//   findinpage.end()
// })

module.exports = findinpage
