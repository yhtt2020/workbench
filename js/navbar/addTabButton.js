var browserUI = require('browserUI.js')

var addTabButton = document.getElementById('add-tab-button')
var shareButton= document.getElementById('share-button')
function initialize () {
  addTabButton.addEventListener('click', function (e) {
    let tabId=tabs.add(undefined,{atEnd:true})
    browserUI.addTab(tabId,undefined,true)
  })

  shareButton.addEventListener('click',function (){
    require('./tabBar.js').shareTask()
  })
}

module.exports = { initialize }
