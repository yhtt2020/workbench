var browserUI = require('browserUI.js')

var addTabButton = document.getElementById('add-tab-button')
var shareButton= document.getElementById('share-button')
function initialize () {
  addTabButton.addEventListener('click', function (e) {
    browserUI.addTab()
  })

  shareButton.addEventListener('click',function (){
    require('./tabBar.js').shareTask()
  })
}

module.exports = { initialize }
