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
  }
}


module.exports = oneTab
