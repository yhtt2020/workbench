const webviews = require('webviews.js')
const urlParser = require('util/urlParser.js')
const toolbar={
  expanded:true,
  toolbarEl:document.getElementById('toolbar'),
  homeButton:document.getElementById('home-button-toolbar'),
  refreshButton:document.getElementById('refresh-button-toolbar'),
  forwardButton:document.getElementById('forward-button-toolbar'),
  backButton:document.getElementById('back-button-toolbar'),
  collapseButton:document.getElementById('collapse-button-toolbar'),

  initialize:function (){
      toolbar.homeButton.addEventListener('click',()=>{
        require('browserUI.js').addTab(tabs.add({}))
      })
      toolbar.refreshButton.addEventListener('click',()=>[
        webviews.update(tabs.getSelected(),urlParser.parse(tabs.get(tabs.getSelected()).url))
      ])


    toolbar.forwardButton.addEventListener('click', function () {
      webviews.callAsync(tabs.getSelected(), 'goForward')
    })
    toolbar.backButton.addEventListener('click', function () {
      webviews.goBackIgnoringRedirects(tabs.getSelected())
    })

    toolbar.collapseButton.addEventListener('click',()=>{
      toolbar.expanded=false
      toolbar.toolbarEl.hidden=true
      document.getElementById('searchbar').style.top=` calc(var(--control-space-top) + 36px )`
      document.getElementById('tab-editor').hidden=true
      document.getElementById('tabs').insertBefore(document.getElementById('tab-editor'), document.getElementById('tabs').children[0])
      webviews.viewMargins= [document.getElementById('toolbar').hidden?0:40, 0, 0, 45]
      webviews.adjustMargin([0, 0, 0, 0])
      document.getElementById('toolbar-navigation-buttons').hidden=false
    })
    if(toolbar.expanded){
      document.getElementById('address-bar').appendChild(document.getElementById('tab-editor'))
      document.getElementById('searchbar').style.top=` calc(var(--control-space-top) + 36px + 40px )`
      document.getElementById('tab-editor').hidden=false
      document.getElementById('toolbar-navigation-buttons').hidden=true
    }
  }
}
toolbar.initialize()
module.exports=toolbar
