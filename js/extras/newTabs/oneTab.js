const settings = require('../../util/settings/settings.js')

const oneTab = {
  newtabList: [
    'ts://newtab',
    'https://limestart.cn/',
    'https://inftab.com/',
    'https://go.itab.link/'
  ],

  selectOnetab() {
    let selected = ''
    const browserTab = settings.get('browserTab')
    const customTabUrl = settings.get('customTabUrl')

    if(browserTab && browserTab.tabIdx < this.newtabList.length) {
      selected = this.newtabList.find((v, index) => index === browserTab.tabIdx)
    }

    if(browserTab && browserTab.tabIdx === this.newtabList.length) {
      if(customTabUrl) {
        selected = customTabUrl
      }
    }

    selected = selected.length > 0 ? selected : 'ts://newtab'
    return selected
  },

  //处理来自其他页面的设置
  handleSettings(tabName) {
    if(tabName === 'tstab') {
      settings.set('browserTab', {
        tabIdx: 0
      })
    } else if(tabName === 'qntab') {
      settings.set('browserTab', {
        tabIdx: 1
      })
    } else if(tabName === 'inftab') {
      settings.set('browserTab', {
        tabIdx: 2
      })
    } else if(tabName === 'itab') {
      settings.set('browserTab', {
        tabIdx: 3
      })
    }
  }
}


module.exports = oneTab
