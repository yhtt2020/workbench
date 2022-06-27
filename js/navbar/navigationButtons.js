const webviews = require('webviews.js')
const toolbar = require('js/toolbar/toolbar.js')
var navigationButtons = {
  tabsList: document.getElementById('tabs-inner'),
  container: document.getElementById('toolbar-navigation-buttons'),
  backButton: document.getElementById('back-button'),
  forwardButton: document.getElementById('forward-button'),
  backButtonToolbar:document.getElementById('back-button-toolbar'),
  forwardButtonToolbar: document.getElementById('forward-button-toolbar'),

  update: function () {
    if (!tabs.get(tabs.getSelected()).url) {
      //navigationButtons.backButton.disabled = true
      //navigationButtons.forwardButton.disabled = true
      navigationButtons.setBackButtonDisabled(true)
      navigationButtons.setForwardButtonDisabled(true)
      return
    }
    webviews.callAsync(tabs.getSelected(), 'canGoBack', function (err, canGoBack) {
      if (err) {
        return
      }
      //navigationButtons.backButton.disabled = !canGoBack
      navigationButtons.setBackButtonDisabled(!canGoBack)
    })
    webviews.callAsync(tabs.getSelected(), 'canGoForward', function (err, canGoForward) {
      if (err) {
        return
      }
      //navigationButtons.forwardButton.disabled = !canGoForward
      navigationButtons.setForwardButtonDisabled(!canGoForward)
      if (canGoForward) {
        navigationButtons.container.classList.add('can-go-forward')
        navigationButtons.forwardButtonToolbar.classList.remove('disable')
      } else {
        navigationButtons.container.classList.remove('can-go-forward')
        navigationButtons.forwardButtonToolbar.classList.add('disable')
      }
    })
  },

  //重新抽象设置方法
  setBackButtonDisabled:function(disabled){
    navigationButtons.backButton.disabled = disabled
    navigationButtons.backButtonToolbar.disabled = disabled
    if(disabled){
      navigationButtons.backButtonToolbar.classList.add('disable')
    }else{
      navigationButtons.backButtonToolbar.classList.remove('disable')
    }

  },
  setForwardButtonDisabled:function(disabled){
    navigationButtons.forwardButton.disabled = disabled
    navigationButtons.forwardButtonToolbar.disabled = disabled

  },



  initialize: function () {
    if(!toolbar.expanded){
      navigationButtons.container.hidden = false
    }
    navigationButtons.backButton.addEventListener('click', function (e) {
      webviews.goBackIgnoringRedirects(tabs.getSelected())
    })

    navigationButtons.forwardButton.addEventListener('click', function () {
      webviews.callAsync(tabs.getSelected(), 'goForward')
    })

    // navigationButtons.container.addEventListener('mouseenter', function () {
    //   /*
    //   Prevent scrollbars from showing up when hovering the navigation buttons, if one isn't already shown
    //   This also works around a chromium bug where a flickering scrollbar is shown during the expanding animation:
    //   https://github.com/minbrowser/min/pull/1665#issuecomment-868551126
    //   */
    //   if (navigationButtons.tabsList.scrollWidth <= navigationButtons.tabsList.clientWidth) {
    //     navigationButtons.tabsList.classList.add('disable-scroll')
    //   }
    // })
    //
    // navigationButtons.container.addEventListener('mouseleave', function () {
    //   navigationButtons.tabsList.classList.remove('disable-scroll')
    // })

    tasks.on('tab-selected', this.update)
    webviews.bindEvent('did-navigate', this.update)
    webviews.bindEvent('did-navigate-in-page', this.update)
  }
}

module.exports = navigationButtons
